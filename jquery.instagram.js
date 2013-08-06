/* Find the access token: http://www.pinceladasdaweb.com.br/instagram/access-token */
(function ($){
  $.fn.instagram = function (options) {
    var that = this,
        apiEndpoint = "https://api.instagram.com/v1",
        settings = {};
        
    options && $.extend(settings, options);
    
    function createPhotoElement(photo) {
      var image_url = photo.images.low_resolution.url; // 306 x 306
      //var image_url = photo.images.thumbnail.url; // 150 x 150
      //var image_url = photo.images.standard_resolution.url; // 612 x 612
      var likes = photo.likes.count;
      var user = photo.user.username;
      var username = photo.user.full_name;
      var userurl = 'http://instagram.com/' + user;

      var innerHtml = $('<img>')
        .addClass('instagram-image')
        .attr('src', image_url);
      
      
      var cap_details = '<figcaption><i class="likes entypo-heart"> ' + likes + '</i><i class="user"><a href="' + userurl + '" target="_blank">' + username + '</a></i></figcaption>';
  
      innerHtml = $('<a>')
          .attr('target', '_blank')
          .attr('href', photo.link)
          .append(innerHtml);

      return $('<figure>')
        .addClass('myImg')
        .attr('id', photo.id)
        .append(innerHtml)
        .append(cap_details);
    }
    
    function createEmptyElement() {
      return $('<div>')
        .addClass('instagram-placeholder')
        .attr('id', 'empty')
        .append($('<p>').html('No photos for this query'));
    }
    
    
    settings.onLoad != null && typeof settings.onLoad == 'function' && settings.onLoad();
    
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: 'https://api.instagram.com/v1/users/self/media/liked?access_token=XXXXXXXXXXX',
      success: function (res) {
        var length = typeof res.data != 'undefined' ? res.data.length : 0;
        var limit = settings.show != null && settings.show < length ? settings.show : length;
        
        if (limit > 0) {
          for (var i = 0; i < limit; i++) {
            that.append(createPhotoElement(res.data[i]));
          }
        }
        else {
          that.append(createEmptyElement());
        }

        settings.onComplete != null && typeof settings.onComplete == 'function' && settings.onComplete(res.data, res);
      }
    });
    
    return this;
  };
})(jQuery);

$('document').ready(function(){
	$(function() {
	  $(".instagram").instagram();	
	 });
});
