
var key = 'AIzaSyDwozRpbCqV5G7GjCI0T1QB7QES27rjHWY';
var baseURL = 'https://www.googleapis.com/youtube/v3';





$("#search-button").click(function(){
    $("#results").empty();
    var query = $('#query').attr('value');
    $.get(baseURL+'/search?part=snippet'+
                     '&q='+query+
                     '&maxResults=20'+
                     '&type=video'+
                     '&key='+key, function(data, status){
        console.log(data);
        for(var i = 0; i< data.items.length; i++){
          var id = data.items[i].id.videoId;
          var thumbnailURL = data.items[i].snippet.thumbnails.default.url;
          var titleText = data.items[i].snippet.title;
          var title = "<div class='titleOverlay'>" + titleText + "</div>";
          var thumb = "<div class='thumbWrapper'><img class='thumb' src=" + thumbnailURL + "></img></div>";
          var result = "<div class='item' data-id=" + id + ">" + thumb + title + "</div>";
          $("#results").append(result);
        }
        $(".item").click(function(){
          $("#playerWrapper").empty();
          $("#playerWrapper").append('<div id="player"></div>');
          CreatePlayer($(this).data("id"));
        });
    });
});



var player;
function CreatePlayer(id) {
  player = new YT.Player('player', {
    videoId: id,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    //setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}
