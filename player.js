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
			modestbranding: 1,
			controls: 0,
			showinfo: 0
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

global.yt = null;
global.onYouTubeIframeAPIReady = ready;
global.show = show;
global.play = play;

init();

})(this);
