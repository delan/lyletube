(function(global) {

var player = window.open(
	'player.html', 'player',
	'width=640,height=360,scrollbars=0,' +
	'menubar=0,toolbar=0,location=0,' +
	'personalbar=0,directories=0,status=0'
);

$(window).on('unload', function() {
	player.close();
});

global.player = player;

})(this);
