(function(global) {

function submit_videos() {
	var form_controls = $('button, textarea');
	var submit_button = $('#submit_button');
	var url_entry = $('#url_entry');
	form_controls.prop('disabled', true);
	$.post('add_heap', { urls: url_entry.val() }, function() {
		form_controls.prop('disabled', false);
		url_entry.val('');
	});
}

$('#submit_button').click(submit_videos);

$(window).keydown(function(e) {
	if (e.keyCode == 10 || e.keyCode == 13)
		if (e.ctrlKey)
			submit_videos();
});

})(this);
