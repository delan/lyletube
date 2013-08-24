(function(global) {

var seeking = false;
var heap_lastid = 0;

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
		if (!seeking) {
			seek.value = a;
			seek.max = b;
		}
		$('#elapsed').text(time(a));
		$('#total').text(time(b));
	} else {
		$('#title').text('(none)');
		$('#elapsed, #total').text('0:00');
	}
	$('#controls input, #controls button:not(#reopen)').
		prop('disabled', !ready);
	$.get('heap?after=' + heap_lastid, function(data) {
		for (var i = data.length - 1; i >= 0; i--) {
			$('#heaps')[0].add(new Option(
				data[i].serial + ' - ' +
				time(data[i].duration) + ' - ' +
				data[i].title,
				i
			), 0);
			if (data[i].serial > heap_lastid)
				heap_lastid = data[i].serial;
		}
	});
}

function play(id) {
	console.log('play() called');
	if (ready) {
		player.$('#ytdom').css('opacity', 1);
		player.yt.loadVideoById(id);
	}
}

$(window).on('unload', function() {
	console.log('window:unload called');
	if (player)
		player.close();
});

$('#reopen').click(reopen);

$('#seek').change(function() {
	console.log('#seek:change called');
	player.yt.seekTo(this.value);
});

$('#seek').mousedown(function() {
	console.log('#seek:mousedown called');
	seeking = true;
});

$('#seek').mouseup(function() {
	console.log('#seek:mouseup called');
	seeking = false;
});

$('#pp').click(function() {
	console.log('#pp:click called');
	if (player.yt.getPlayerState() == 2)
		player.yt.playVideo();
	else
		player.yt.pauseVideo();
});

global.setInterval(update, 500);

reopen();

global.play = play;

})(this);
