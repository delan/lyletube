(function(global) {

var player, ready;

function reopen() {
	if (player && !player.closed)
		player.close();
	player = window.open(
		'player', 'player',
		'width=640,height=360,scrollbars=0,' +
		'menubar=0,toolbar=0,location=0,' +
		'personalbar=0,directories=0,status=0'
	);
	ready = false;
	if (player)
		$(player).load(setup);
	global.player = player;
}

function setup() {
	console.log('setup() called');
	player.yton('ready', function() {
		console.log('from player: ready event');
		ready = true;
	});
	player.yton('state', function(event) {
		console.log('from player: state event: ' + event.data);
	});
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

function seek() {
	player.seek(this.value);
}

$(window).on('unload', function() {
	if (player)
		player.close();
});

$('#reopen').click(reopen);

$('#seek').change(seek);

global.setInterval(update, 500);

reopen();

})(this);
