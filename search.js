
var key = 'AIzaSyDwozRpbCqV5G7GjCI0T1QB7QES27rjHWY';
var baseURL = 'https://www.googleapis.com/youtube/v3';
var player;

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




setTimeout(function(){
  $("#playerWrapper").empty();
  $("#playerWrapper").append('<div id="player"></div>');
  CreatePlayer();
}, 200);
function CreatePlayer() {
  player = new YT.Player('player', {
    //videoId: id,
    events: {
      'onReady': onPlayerReady,
      //'onStateChange': onPlayerStateChange
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


function Search(){
  $("#results").empty();
  var query = $('#query').val();
  console.log(query);
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
        var result = "<div class='item draggable' data-id=" + id + ">" + thumb + title + "</div>";
        //var result = "<div class='item draggable'></div>";
        $("#results").append(result);
      }
      $(".item").click(function(){

        player.loadVideoById($(this).data("id"), 5, "large")
      });

      $(function() {
          $( "#queue" ).sortable({
            //items: "> .item",
            //handle: "div",

            tolerance: "pointer",
            //distance: 60,
            cursorAt: { left: 60 },
            axis: "x",
            revert: true,
            //grid: [120, 120 ],
            helper: "clone",
            //placeholder: "sortable-placeholder",

            //zIndex: 9999,
            start: function(e, ui){
              //$(ui.placeholder).hide(200);
            },
            change: function (e,ui){
              //$(ui.placeholder).hide().show(200);
            },
            scroll: false
          });

          $( ".draggable" ).draggable({
            connectToSortable: "#queue",
            helper: "clone",
            revert: "invalid",
            cursorAt: { left: 60 },
            zIndex: 9999999,
            scroll: false
          });
        });
  });
}
