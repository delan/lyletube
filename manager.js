(function(global) {

var popup = window.open(
	'popup.html', 'popup',
	'width=640,height=360,scrollbars=0,' +
	'menubar=0,toolbar=0,location=0,' +
	'personalbar=0,directories=0,status=0'
);

$(window).on('unload', function() {
	popup.close();
});

global.popup = popup;

})(this);
