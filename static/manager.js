(function(global) {

var seeking = false;
var last_heap_serial = 0;
var last_queue_serial = 0;

global.queue = [];
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
		player.h_state = h_state;
	}
}

function h_ready() {
	console.log('h_ready() called');
	ready = true;
}

function h_state(event) {
	console.log('h_state() called');
	if (event.data == 0) {
		next();
	}
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
	$.get('heap?after=' + last_heap_serial, function(data) {
		var heaps = $('#heaps')[0];
		for (var i = 0; i < data.length; i++) {
			heaps.add(new Option(
				'[' + time(data[i].duration) +
				'] ' + data[i].title,
				data[i].serial
			));
			if (data[i].serial > last_heap_serial)
				last_heap_serial = data[i].serial;
		}
	});
	$.get('queue?after=' + last_queue_serial, function(data) {
		var queues = $('#queues')[0];
		for (var i = 0; i < data.length; i++) {
			queues.add(new Option(
				'[' + time(data[i].duration) +
				'] ' + data[i].title,
				data[i].serial
			));
			if (data[i].serial > last_queue_serial)
				last_queue_serial = data[i].serial;
		}
	});
	$.get('queue', function(data) {
		queue = data;
	});
}

function play(id, start) {
	console.log('play() called');
	if (ready) {
		player.$('#ytdom').css('opacity', 1);
		player.yt.loadVideoById(id);
		player.yt.seekTo(start || 0);
	}
}

function next() {
	var obj = queue.shift();
	play(obj.id, obj.start);
	$('#title').text(obj.title);
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

$('#approve').click(function() {
	console.log('#approve:click called');
	var heaps = $('#heaps')[0];
	var serials = [];
	for (var i = heaps.options.length - 1; i >= 0; i--) {
		if (heaps.options[i].selected) {
			serials.push(parseInt(heaps.options[i].value));
			heaps.remove(i);
		}
	}
	$.post('queue', { serials: JSON.stringify(serials) });
});

global.setInterval(update, 500);

reopen();

global.play = play;
global.next = next;

})(this);
