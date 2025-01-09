
	$(document).ready(function() {

        $.ajax({
            url: configHost + "/get/contact",
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                var contactEmail = obj.data.contactEmail == null ? "" : obj.data.contactEmail;
                $("#contactEmail").text(contactEmail);
            }
        });
    });