$( document ).ready(function() {
    var ext = ['.mp4', '.webm', '.jpg', '.png', '.gif'];
    var mime = ['video/mp4', 'video/webm'];
    $( "#video_attachment1" ).bind( "change", function(event) {
        var strArray = (event.target.value).split('.');
        if (strArray.length > 0) {
            if ('.'+strArray[(strArray.length-1)] == ext[0] || '.'+strArray[(strArray.length-1)] == ext[1]) {
                if ($('#video_id_input').length > 0) {
                    $('#video_id_input').val((event.target.value).split('\\')[(event.target.value).split('\\').length-1]);
                }
                switch('.'+strArray[(strArray.length-1)]) {
                    case ext[0]:
                        if ($('#mime_type_input').length > 0) {
                            $('#mime_type_input').val(mime[0]);
                        }
                    break;
                    case ext[1]:
                        if ($('#mime_type_input').length > 0) {
                            $('#mime_type_input').val(mime[1]);
                        }
                    break;
                }
            } else {
                alert ('Sorry, only MP4/WEBM files expected');
                event.target.value = '';
            }
        }
    });
    $( "#video_attachment2" ).bind( "change", function(event) {
        var strArray = (event.target.value).split('.');
        if (strArray.length > 0) {
            if ('.'+strArray[(strArray.length-1)] == ext[2] || '.'+strArray[(strArray.length-1)] == ext[3] || '.'+strArray[(strArray.length-1)] == ext[4]) {
                if ($('#poster_id_input').length > 0) {
                    $('#poster_id_input').val((event.target.value).split('\\')[(event.target.value).split('\\').length-1]);
                }
            } else {
                alert ('Sorry, only JPEG/PNG files expected');
                event.target.value = '';
            }
        }
    });
    if (navigator.mediaDevices) {
        if (navigator.mediaDevices.getUserMedia && $('#camera').length > 0) {
			 var video_constraints = {
				width: { min: 1280, ideal: 1280, max: 1280 },
        		height: { min: 720, ideal: 720, max: 720 }
			};
			var device = navigator.mediaDevices.getUserMedia({audio: false, video: video_constraints});
            device.then(function(mediaStream) {
                $('#camera').attr('src', window.URL.createObjectURL(mediaStream));
            });
            device.catch(function(err) {
                alert (err);
            });
        }
    }
});