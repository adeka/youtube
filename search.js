
var key = 'AIzaSyDwozRpbCqV5G7GjCI0T1QB7QES27rjHWY';
var baseURL = 'https://www.googleapis.com/youtube/v3';
var player;
var index = 0;
var currentId;
var playlist = [];



/*
$(".ui-autocomplete").keypress(function(e) {
        alert('You pressed enter!');
});
*/
setTimeout(function(){

}, 500);

$( "#query" ).on('input', function() {
  //console.log(  $("#query").val());

});

$('#query').keypress(function (e) {
  if (e.which == 13) {
    Search();
    return false;    //<---- Add this line
  }
});

$("#submit").click(function(){
  Search();
});

$("#queue").bind("DOMNodeInserted",function(){
  //UpdatePlaylist();
  //alert("child is appended");
});

function UpdatePlaylist(){

}

setTimeout(function(){
  CreatePlayer();
}, 200);
function CreatePlayer() {
  $("#playerWrapper").empty();
  $("#playerWrapper").append('<div id="player"></div>');
  player = new YT.Player('player', {
    //videoId: id,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

function onPlayerError(event) {
  CreatePlayer();
}
function onPlayerReady(event) {
  /*
  $(".ytp-button-prev").css("display", "inline-block");
  $(".ytp-button-next").show();
  */
  //console.log(player);
  //event.target.playVideo();
  /*
  var cssLink = document.createElement("link")
cssLink.href = "iframe.css";
cssLink .rel = "stylesheet";
cssLink .type = "text/css";
$("#player").append(cssLink);
*/
}

//YT.PlayerState.ENDED
//YT.PlayerState.PLAYING
//YT.PlayerState.PAUSED
//YT.PlayerState.BUFFERING
//YT.PlayerState.CUED
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    //setTimeout(stopVideo, 6000);
    var currentId = player.getVideoData().video_id;
    var currentIndex = playlist.indexOf(currentId);
    if(currentIndex < playlist.length){
      player.loadVideoById(playlist[currentIndex+1]);
    }
    //console.log(playlist);
  }
}
function stopVideo() {
  player.stopVideo();
}


function Search(){
  $("#results").empty();
  var query = $('#query').val();
  $.get(baseURL+'/search?part=snippet'+
                   '&q='+query+
                   '&maxResults=20'+
                   '&type=video'+
                   '&key='+key, function(data, status){
      //console.log(data);
      for(var i = 0; i< data.items.length; i++){
        var id = data.items[i].id.videoId;
        var thumbnailURL = data.items[i].snippet.thumbnails.default.url;
        var titleText = data.items[i].snippet.title;
        var title = "<div class='titleOverlay'>" + titleText + "</div>";
        var status = "<div class='status'></div>";
        var thumb = "<div class='thumbWrapper'><img class='thumb' src=" + thumbnailURL + "></img></div>";
        var result = "<div class='item draggable' data-id=" + id + ">" + status + thumb + title + "</div>";
        //var result = "<div class='item draggable'></div>";
        $("#results").append(result);
      }
      $(".item").click(function(){
        /*
        console.log("clicked");
        var clone = $(this).clone();
        var id = $(this).data("id");
        clone.attr("id", id);
        $("#queue").prepend(clone);
        //$("#queue").scrollTo({left: '+=110px' }, 800);

        player.loadVideoById($(this).data("id"), 5, "large")
        */
      });

      $(function() {
          $( "#queue" ).sortable({
            //items: "> .item",
            //handle: "div",
            delay: .1,
            distance: 10,
            tolerance: "pointer",
            //distance: 60,
            cursorAt: { left: 60 },
            axis: "x",
            revert: true,
            //grid: [120, 120 ],
            helper: "clone",
            //placeholder: "sortable-placeholder",
            zIndex: 999999999,

            start: function(e, ui){
            },
            stop: function(e, ui){
              if(playlist.length > 0){
                MatchQueue();
              }
            },
            change: function (e,ui){

            },
            receive: function (e,ui){
              if(playlist.length == 0){
                var id = ui.sender[0].dataset.id;
                player.loadVideoById(id);
                MatchQueue();
              }
            },
            scroll: false
          });

          $( ".draggable" ).draggable({
            connectToSortable: "#queue",
            helper: "clone",
            revert: "invalid",
            cursorAt: { left: 60 },
            zIndex: 9999999999,
            scroll: false
          });
        });
  });
}

function MatchQueue(){
  var queue = $("#queue").children();
  var ids = [];
  for(var i=0; i< queue.length; i++){
    if($(queue[i]).hasClass("item")){
      ids.push(queue[i].dataset.id);
    }
  };
  playlist = ids;
  console.log(playlist);

}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
