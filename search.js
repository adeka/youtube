
var key = 'AIzaSyDwozRpbCqV5G7GjCI0T1QB7QES27rjHWY';
var baseURL = 'https://www.googleapis.com/youtube/v3';
var playlistURL = 'https://www.googleapis.com/youtube/v3/playlistItems';
var player;
var index = 0;
var currentId;
var currentIndex;
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

$('')
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

setTimeout(function(){
  //var n = player.getIframe();
  //var controls = $(n).find(".html5-video-controls").hide();
  //$("#player").contents().find('div').hide();
  //$("#playerWrapper").empty();
  //$("#playerWrapper").append(n);
  //$(".ytp-button-prev").css("display", "inline-block");
  //$(".ytp-button-next").show();
  //$("#playerWrapper").append(controls);
}, 1000);


function CreatePlayer() {
  $("#playerWrapper").empty();

  /*
  var soundOff = '<span class="fa-stack">' +
    '<i class="fa fa-volume-off fa-stack-1x"></i>' +
    '<i class="fa fa-ban fa-stack-2x text-danger"></i>' +
  '</span>';
  */

  var back = "<i class='fa fa-backward'></i>";
  var play = "<i class='fa fa-play' id='play'></i>";
  var forward = "<i class='fa fa-forward'></i>";
  var soundMax = "<i class='fa fa-volume-up'></i>";
  var soundMid = "<i class='fa fa-volume-down'></i>";
  var soundMin = "<i class='fa fa-volume-off'></i>";

  var repeat = "<i class='fa fa-history'></i>";
  var controls = "<div id='playerControls'>"+back+play+forward+soundMin+soundMid+soundMax+repeat+"</div>";




  var controlCover = controls+'<div id="playerControlCover"><div class="cover"></div></div>';
  $("#playerWrapper").append(controlCover + '<div id="player"></div>');
  player = new YT.Player('player', {
    playerVars: {
      //origin: '',
      modestbranding: true,
      autohide: 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError,
    }
  });
}



function onPlayerError(event) {
  CreatePlayer();
}
function onPlayerReady(event) {




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
  //var currentId = player.getVideoData().video_id;
  //var currentId = playlist[currentIndex];
  var currentVideo = $("#queue").find("[data-index='" + currentIndex + "']");

  if (event.data == YT.PlayerState.ENDED) {
    $(currentVideo).attr("data-playing", false);

    //setTimeout(stopVideo, 6000);
    //var currentIndex = playlist.indexOf(currentId);
    if(currentIndex < playlist.length){
      currentIndex++;
      player.loadVideoById(playlist[currentIndex]);
    }
    //console.log(playlist);
  }
  if (event.data == YT.PlayerState.PAUSED) {
    $("#play").removeClass("fa-pause");
    $("#play").addClass("fa-play");
  }
  if (event.data == YT.PlayerState.PLAYING) {
    $("#play").removeClass("fa-play");
    $("#play").addClass("fa-pause");
    $("#queue").find(".fa-play-circle").remove();
    $(currentVideo).attr("data-playing", true);
    $(currentVideo).append("<i class='fa fa-play-circle animated bounceIn isPlaying'></i>");
  }
}
function stopVideo() {
  player.stopVideo();
}


function Search(){
  $("#results").empty();
  var query = $('#query').val();

  //test playlist id: "PL3B9C0CBE7596009A"
  ///*
  $.get(baseURL+'/search?part=snippet'+
                   '&q='+query+
                   '&maxResults=20'+
                   //'&type=video'+
                   '&key='+key, function(data, status){
  //*/
  /*
  $.get(playlistURL+'/?part=snippet'+
                   '&playlistId=PL3B9C0CBE7596009A'+
                   '&maxResults=50'+
                   //'&pageToken=CDIQAA'+
                   '&key='+key, function(data, status){
 */
      console.log(data);
      for(var i = 0; i< data.items.length; i++){
        var id = data.items[i].id.videoId;
        var thumbnailURL = data.items[i].snippet.thumbnails.default.url;
        var titleText = data.items[i].snippet.title;
        var title = "<div class='titleOverlay'>" + titleText + "</div>";

        var related = "<i class='fa fa-search findRelated'></i>";
        var play = "<i class='fa fa-play-circle-o findRelated'></i>";
        var add = "<i class='fa fa-plus-square findRelated'></i>";
        var refresh = "<i class='fa fa-refresh findRelated'></i>";
        var trash = "<i class='fa fa-trash findRelated'></i>";
        var relatedButton = "<div class='thumbButton'>"+related+"</div>";
        var addButton = "<div class='thumbButton'>"+add+"</div>";
        var refreshButton = "<div class='thumbButton'>"+refresh+"</div>";
        var trashButton = "<div class='thumbButton'>"+trash+"</div>";
        var playButton = "<div class='thumbButton'>"+play+"</div>";
        var buttons = "<div class='thumbButtonWrapper'>" + relatedButton + addButton + refreshButton + trashButton + playButton + "</div>";

        var status = "<div class='status'></div>";
        var thumb = "<div class='thumbWrapper'><img class='thumb' src=" + thumbnailURL + "></img></div>";
        var result = "<div class='item draggable' data-id=" + id + " data-index=-1 data-playing=false>" + buttons + thumb + title + "</div>";
        //var result = "<div class='item draggable'></div>";
        $("#results").append(result);
      }
      /*
      setTimeout(function(){
        $("#results").find(".animated").removeClass("animated");
      }, 1000);
      */
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
            //zIndex: 99999,

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
                currentIndex = 0;
                player.loadVideoById(id);
                MatchQueue();
              }
            },
            scroll: false
          });

          $( ".draggable" ).draggable({
            start: function(e, ui){
              //console.log(e);
              //$(e.target).css("border", "5px solid red");
            },
            stack: ".item",
            zIndex:10000,
            connectToSortable: "#queue",
            helper: "clone",
            revert: "invalid",
            cursorAt: { left: 60 },
            //zIndex: 99999,
            scroll: false
          });
        });
  });
}

function MatchQueue(){
  var queue = $("#queue").children();
  var ids = [];
  for(var i=0; i< queue.length; i++){
    $(queue[i]).attr("data-index", i);

    if($(queue[i]).hasClass("draggable")){
      $(queue[i]).removeClass("draggable");
    }

    if($(queue[i]).hasClass("item")){
      ids.push(queue[i].dataset.id);
      //console.log($(queue[i]).data("index"));
    }

    if($(queue[i]).attr("data-playing") == "true"){
      currentIndex = i;
      //console.log("playing");
    }
  };
  playlist = ids;
  console.log(playlist);

}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

setInterval(function(){
  $('.ytp-time-current').text(Math.floor(player.getDuration()/60) + ":" + player.getDuration()%60);
},1000);
