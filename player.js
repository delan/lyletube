(function(global) {

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
}

function play(id) {
	yt.loadVideoById(id);
}

function on(ytevent, func) {
	handlers[ytevent] = handlers[ytevent] || [];
	handlers[ytevent].push(func);
}

function handler(event) {
	handlers[this].forEach(function(func) {
		func(event);
	});
}

var handlers = {};

global.yt = null;
global.onYouTubeIframeAPIReady = ready;
global.show = show;
global.play = play;
global.yton = on;

$(window).on('unload', global.close);

init();

})(this);
