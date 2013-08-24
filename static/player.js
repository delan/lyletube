(function(global) {

function init() {
	global.opener.console.log('player.js: init() called');
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function ready() {
	global.opener.console.log('player.js: ready() called');
	global.yt = new YT.Player('youtube_element', {
		playerVars: {
			wmode: 'opaque',
			iv_load_policy: 3,
			modestbranding: 1,
			controls: 0,
			showinfo: 0
		},
		events: {
			onReady:                  global.yt_handler_ready,
			onPlaybackQualityChange:  global.yt_handler_quality,
			onStateChange:            global.yt_handler_state,
			onError:                  global.yt_handler_error,
		}
	});
}

global.yt = null;
global.yt_handler_ready =   global.yt_handler_ready   || function() {};
global.yt_handler_quality = global.yt_handler_quality || function() {};
global.yt_handler_state =   global.yt_handler_state   || function() {};
global.yt_handler_error =   global.yt_handler_error   || function() {};
global.onYouTubeIframeAPIReady = ready;

$(window).on('unload', function() {
	global.opener.console.log('player.js: window:unload called');
	global.opener.ready = false;
	global.opener.player = null;
	global.close();
});

init();

})(this);
