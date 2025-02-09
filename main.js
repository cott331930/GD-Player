var player;
var currentPlay = 0;
var repeat = false;// 0=false
var count=1;

function _Click()
{
    if(count==1)
    {
        document.getElementById("RepeatButton").style.background="red";
        document.getElementById("RepeatButton").style.color="white";
        repeat = true;
        count=0;
    }
    else
    {
        document.getElementById("RepeatButton").style.background="lightgray";
        document.getElementById("RepeatButton").style.color="black";
        repeat = false;
        count=1;
    }
}

function getVideoSetting(){

    let startSeconds, endSeconds = 0;
    if(videoList[currentPlay].playTime != null){
        startSeconds = videoList[currentPlay].playTime[0];
        endSeconds = videoList[currentPlay].playTime[1];
    }

    return {
        "videoId":videoList[currentPlay].id,
        "startSeconds": startSeconds,
        "endSeconds": endSeconds,
        "suggestedQuality":"large"
    }
}

// When API ready
function onYouTubeIframeAPIReady(){
    player = new YT.Player("player",
        {
            height:"1080",
            width:"1920",
            videoId:videoList[currentPlay].id,
            playerVars:{
                "autoplay":0, // do not play automatically
                "controls":0, // donot show control panel           
                "showinfo":0, // connot turn off after 2018/9/25
                "rel":0, //still display after 2018/9/25
                "iv_load_policy":3 // don't show notify of video
            },
            events:{
                "onReady":onPlayerReady,
                "onStateChange":onPlayerStateChange
            }
        }
    );
}

// when YT-player ready
function onPlayerReady(event){
    $("#playButton").click(function(){
        player.loadVideoById(getVideoSetting());
        $("h1").text(player.getVideoData().title);   
    });
}

// when state of YT-player cahenged
function onPlayerStateChange(event){     

    if( Math.floor(player.getCurrentTime()) >= videoList[currentPlay].playTime[1] - 1.1 ){      
        // play next normally
        if(currentPlay<videoList.length-1){
            currentPlay++;
            player.loadVideoById(getVideoSetting());
        }
        else
        { // if is last one, prepare first song and stop play
            currentPlay = 0;
            if (repeat)
            {
                player.loadVideoById(getVideoSetting());
            }
            else
            {             
                player.cueVideoById(getVideoSetting());
            }
        }
             
    }

    // catch title of the video
    if(player.getVideoLoadedFraction()>0){
        $("h1").text(player.getVideoData().title);
    }

}

