
    var file;
	$(document).ready(function() {

        loadingGifToGetFadeIn();
        $.ajax({
            url: userHost + "/get/avatar",
            method: 'GET',
            success: function(obj) {
                loadingGifFadeOut();
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                var imgBase64 = obj.data.imgUrl;
                if (imgBase64 != null && imgBase64 != '') {
                    showPreviewAndDelete("update", imgBase64);
                } else {
                    $("#updateShowImg").empty();
                }
            }
        });

        $("#updateBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate('update');
        });
    });

    function addOrUpdate(prefix){
         var idPrefix = '#' + prefix;
         var files = new FormData();
         files.append('file', file);

         var imgUrl = $("#updateImgPreview").attr('src');
         var hasImg = "0";
         if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
             hasImg = "1";
         }
         files.append('hasImg', hasImg);
        $("#updateBtn").attr('disabled',"disabled");
         $.ajax({
             url: userHost + "/update/avatar",
             type: 'POST',
             data: files,
             dataType: 'json',
             processData: false,
             contentType: false,
             success: function(obj) {
                $("#updateBtn").removeAttr('disabled');
                 if (obj.code != 1) {
                     openAlert("修改失败 !");
                     return;
                 }
                 openAlert("保存成功 !");
                 //top.location.href = "index.html";
             }
         });
    }