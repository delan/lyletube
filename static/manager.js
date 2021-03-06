(function(global) {

var currently_mouse_seeking = false;
var last_heap_serial = 0;
var last_queue_serial = 0;
var last_history_serial = 0;

global.video_queue = [];
global.current_video = null;
global.player_window = null;
global.ready = false;

function reopen_player_window() {
	console.log('reopen_player_window() called');
	global.ready = false;
	if (player_window && !player_window.closed)
		player_window.close();
	if (player_window = window.open(
		'player', 'player_window',
		'width=640,height=360,scrollbars=0,' +
		'menubar=0,toolbar=0,location=0,' +
		'personalbar=0,directories=0,status=0'
	)) {
		player_window.yt_handler_ready = yt_handler_ready;
		player_window.yt_handler_state = yt_handler_state;
	}
}

function yt_handler_ready() {
	console.log('yt_handler_ready() called');
	global.ready = true;
	play_next_in_playlist();
}

function yt_handler_state(event) {
	console.log('yt_handler_state() called:', event.data);
	if (event.data == 0)
		play_next_in_playlist();
	else if (event.data == 1)
		player_window.yt.seekTo(current_video.start || 0);
}

function friendly_time(sec) {
	var m = String(sec / 60 | 0);
	var s = String(sec % 60 | 0);
	s = s.length < 2 ? '0' + s : s;
	return m + ':' + s;
}

function update_ui() {
	if (global.ready) {
		var seek = $('#seek')[0];
		var a = player_window.yt.getCurrentTime();
		var b = player_window.yt.getDuration();
		if (!currently_mouse_seeking) {
			seek.value = a;
			seek.max = b;
		}
		$('#elapsed').text(friendly_time(a));
		$('#total').text(friendly_time(b));
	} else {
		$('#title').text('(none)');
		$('#elapsed, #total').text('0:00');
	}
	$('#controls input, #controls button:not(#reopen)').
		prop('disabled', !global.ready);
	$.get('get_heap', get_heap_handler);
	$.get('get_queue', get_queue_handler);
	$.get('get_history', get_history_handler);
}

function add_video_to_select_box(list, video_obj, at_start) {
	var first = null;
	if (at_start)
		first = list.options[0] || null;
	list.add(new Option(
		'[' + friendly_time(video_obj.duration) +
		'] ' + video_obj.title, video_obj.serial
	), first);
}

function get_heap_handler(data) {
	var heap_list = $('#heap_list')[0];
	var old_last_heap_serial = last_heap_serial;
	for (var i = 0; i < data.length; i++) {
		if (data[i].serial <= old_last_heap_serial)
			continue;
		add_video_to_select_box(heap_list, data[i], false);
		if (data[i].serial > last_heap_serial)
			last_heap_serial = data[i].serial;
	}
}

function get_queue_handler(data) {
	var queue_list = $('#queue_list')[0];
	var old_last_queue_serial = last_queue_serial;
	global.video_queue = data;
	for (var i = 0; i < data.length; i++) {
		if (data[i].serial <= old_last_queue_serial)
			continue;
		add_video_to_select_box(queue_list, data[i], false);
		if (data[i].serial > last_queue_serial)
			last_queue_serial = data[i].serial;
	}
}

function get_history_handler(data) {
	var history_list = $('#history_list')[0];
	var old_last_history_serial = last_history_serial;
	for (var i = 0; i < data.length; i++) {
		if (data[i].serial <= old_last_history_serial)
			continue;
		add_video_to_select_box(history_list, data[i], true);
		if (data[i].serial > last_history_serial)
			last_history_serial = data[i].serial;
	}
}

function play_video(id) {
	console.log('play_video() called');
	if (ready) {
		player_window.$('#youtube_element').css('opacity', 1);
		player_window.yt.loadVideoById(id);
		player_window.yt.unMute();
		player_window.yt.setVolume(100);
	}
}

function play_next_in_playlist() {
	console.log('play_next_in_playlist() called');
	if (current_video = video_queue.shift()) {
		console.log('play_next_in_playlist():', current_video);
		var queue_list = $('#queue_list')[0];
		var serials = [parseInt(queue_list.options[0].value)];
		$.post('queue_to_history',
			{ serials: JSON.stringify(serials) });
		queue_list.remove(0);
		play_video(current_video.id);
		$('#title').text(current_video.title);
		$('#title').prop('title', current_video.title);
	}
}

function scalpel(list_id, do_delete, target_url) {
	var list = $('#' + list_id)[0];
	var serials = [];
	for (var i = list.options.length - 1; i >= 0; i--) {
		if (list.options[i].selected) {
			var value = list.options[i].value;
			serials.unshift(parseInt(value));
			if (do_delete)
				list.remove(i);
		}
	}
	$.post(target_url, { serials: JSON.stringify(serials) });
}

$(window).on('unload', function() {
	console.log('window:unload called');
	if (player_window)
		player_window.close();
});

$('#reopen').click(reopen_player_window);

$('#seek').change(function() {
	console.log('#seek:change called');
	player_window.yt.seekTo(this.value);
});

$('#seek').mousedown(function() {
	console.log('#seek:mousedown called');
	currently_mouse_seeking = true;
});

$('#seek').mouseup(function() {
	console.log('#seek:mouseup called');
	currently_mouse_seeking = false;
});

$('#pp').click(function() {
	console.log('#pp:click called');
	if (player_window.yt.getPlayerState() == 2)
		player_window.yt.playVideo();
	else
		player_window.yt.pauseVideo();
});

$('#next').click(play_next_in_playlist);

$('#heap_reject_button').click(function() {
	console.log('#heap_reject_button:click called');
	scalpel('heap_list', true, 'delete_heap');
});

$('#heap_approve_button').click(function() {
	console.log('#heap_approve_button:click called');
	scalpel('heap_list', true, 'heap_to_queue');
});

$('#queue_delete_button').click(function() {
	console.log('#queue_delete_button:click called');
	scalpel('queue_list', true, 'delete_queue');
});

$('#history_replay_button').click(function() {
	console.log('#history_replay_button:click called');
	scalpel('history_list', false, 'history_to_queue');
});

global.setInterval(update_ui, 500);

reopen_player_window();

global.play_video = play_video;

})(this);
