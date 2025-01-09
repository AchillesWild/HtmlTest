    $(document).ready(function() {

        $(document).on('click', '#confirmNotice', function() {
            readNotice();
        });

        getNotice();
    });

    function getNotice(){
        $.ajax({
            url: userNoticeHost + "/get/one",
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    return;
                }
                var id = obj.data.id;
                $("#noticeId").val(id);
//                var token = getToken();
//                var key = token + "_" + id;
//                var haveDone = getCache(key);
//                if(haveDone != null){
//                    return;
//                }
//                toCache(key, "1");
                var content = obj.data.content;
                $("#alertNoticeMessage").html(content);
                if(obj.data.repeated == 1){
                    $('.checkbox-container').show();
                } else {
                    $('.checkbox-container').hide();
                }
                $('#alertNotice').show();
                openMask();
            }
        });
    }

    function readNotice(){
        var closeRepeat;
        if ($('#readCheckbox').is(':checked')) {
            closeRepeat = 1;
        } else {
            closeRepeat = 0;
        }
        let notice = {
                    "noticeId": $("#noticeId").val(),
                 "closeRepeat": closeRepeat
                 };

        $.ajax({
            url: userNoticeHost + "/read/one",
            method: 'POST',
            data: JSON.stringify(notice),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                $('#alertNotice').hide();
                closeMask();
            }
        });
    }