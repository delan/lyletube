(function(global) {

$('#submit').click(function() {
	var submit = this;
	$('button, textarea').prop('disabled', true);
	$.post('heap', { urls: $('#urls').val() }, function() {
		$('button, textarea').prop('disabled', false);
		$('textarea').val('');
	});
});

})(this);
