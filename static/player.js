(function(global) {

var shown = false;

function init() {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function ready() {
	yt = new YT.Player('ytdom', {
		playerVars: {
			wmode: 'transparent',
			iv_load_policy: 3,
			modestbranding: 1,
			controls: 0,
			showinfo: 0
		},
		events: {
			onReady:                  handler.bind('ready'),
			onPlaybackQualityChange:  handler.bind('quality'),
			onStateChange:            handler.bind('state'),
			onError:                  handler.bind('error'),
		}
	});
}

function show() {
	var ytdom = document.getElementById('ytdom');
	ytdom.classList.remove('hidden');
	shown = true;
}

function play(id) {
	console.log('play() called');
	if (!shown) {
		console.log('play(): player not yet shown');
		on('ready', play.bind(null, id));
		show();
		return;
	}
	yt.loadVideoById(id);
	yt.unMute();
	yt.setVolume(100);
}

function seek(t) {
	console.log('seek() called');
	yt.seekTo(t);
}

function on(ytevent, func) {
	handlers[ytevent] = handlers[ytevent] || [];
	handlers[ytevent].push(func);
}

function handler(event) {
	if (handlers[this])
		handlers[this].forEach(function(func) {
			func(event);
		});
}

var handlers = {};

global.yt = null;
global.onYouTubeIframeAPIReady = ready;
global.show = show;
global.play = play;
global.seek = seek;
global.yton = on;

$(window).on('unload', global.close);

init();

})(this);
