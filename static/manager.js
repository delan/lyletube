(function(global) {

global.player = null;
global.ready = false;

function reopen() {
	console.log('reopen() called');
	ready = false;
	if (player && !player.closed)
		player.close();
	if (player = window.open(
		'player', 'player',
		'width=640,height=360,scrollbars=0,' +
		'menubar=0,toolbar=0,location=0,' +
		'personalbar=0,directories=0,status=0'
	)) {
		player.h_ready = h_ready;
	}
}

function h_ready() {
	console.log('h_ready() called');
	ready = true;
}

function time(sec) {
	var m = String(sec / 60 | 0);
	var s = String(sec % 60 | 0);
	s = s.length < 2 ? '0' + s : s;
	return m + ':' + s;
}

function update() {
	if (ready) {
		var seek = $('#seek')[0];
		var a = player.yt.getCurrentTime();
		var b = player.yt.getDuration();
		$('#total').text(time(seek.max = b));
		$('#elapsed').text(time(seek.value = a));
	}
}

function play(id) {
	player.$('#ytdom').css('opacity', 1);
	player.yt.loadVideoById(id);
}

function seek() {
	player.yt.seekTo(this.value);
}

$(window).on('unload', function() {
	if (player)
		player.close();
});

$('#reopen').click(reopen);

$('#seek').change(seek);

global.setInterval(update, 500);

reopen();

global.play = play;

})(this);
