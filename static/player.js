(function(global) {

var shown = false;

function init() {
	global.opener.console.log('player.js: init() called');
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function ready() {
	global.opener.console.log('player.js: ready() called');
	yt = new YT.Player('ytdom', {
		playerVars: {
			// wmode: 'transparent',
			wmode: 'opaque',
			iv_load_policy: 3,
			modestbranding: 1,
			controls: 0,
			showinfo: 0
		},
		events: {
			onReady:                  global.h_ready,
			onPlaybackQualityChange:  global.h_quality,
			onStateChange:            global.h_state,
			onError:                  global.h_error,
		}
	});
}

function show() {
	global.opener.console.log('player.js: show() called');
	var ytdom = document.getElementById('ytdom');
	ytdom.classList.remove('hidden');
	shown = true;
}

global.yt = null;
global.h_ready =   global.h_ready   || function() {};
global.h_quality = global.h_quality || function() {};
global.h_state =   global.h_state   || function() {};
global.h_error =   global.h_error   || function() {};
global.onYouTubeIframeAPIReady = ready;

$(window).on('unload', function() {
	global.opener.console.log('player.js: window:unload called');
	global.opener.ready = false;
	global.opener.player = null;
	global.close();
});

init();

})(this);
