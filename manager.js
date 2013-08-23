(function(global) {

var player;

function reopen() {
	if (player && !player.closed)
		player.close();
	player = window.open(
		'player.html', 'player',
		'width=640,height=360,scrollbars=0,' +
		'menubar=0,toolbar=0,location=0,' +
		'personalbar=0,directories=0,status=0'
	);
	global.player = player;
}

$(window).on('unload', function() {
	if (player)
		player.close();
});

$('#reopen').click(reopen);

reopen();

})(this);
