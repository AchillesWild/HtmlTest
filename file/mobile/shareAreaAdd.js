    var file;
    $(document).ready(function() {

        $(document).on('pageshow', '#addPopup', function() {
            ifToLoginByLocalToken();
            $("#back, #addOneShare").show();
//            var myAvatar = getAvatar();
//            if(myAvatar == null){
//                myAvatar = DEFAULT_IMG_BASE64;
//            }
//            $("#avatar").attr("src", myAvatar);
//            var nickName = getNickName();
//            $("#nickName").html(nickName);
        });

       $("#postImage").change(async function(){
           $("#imagePreviewDiv").show();
           $("#imagePreview").attr("src", URL.createObjectURL($(this)[0].files[0]));
           file = await compressImg($(this)[0].files[0], 600, 600);
       });

       $("#addOneShare").on('click', function(event) {
            event.preventDefault();
            addOneShare();
         });
    });

    function addOneShare(){
         var files = new FormData();
         files.append('file', file);
         var content = $('#addContent').val();
         if (content == null || content == '') {
             openAlert("内容不能为空 !");
             return;
         }
         files.append('content', content);
         showLoadingAndOverlay();
         $.ajax({
             url: shareHost + "/add",
             type: 'POST',
             data: files,
             dataType: 'json',
             processData: false,
             contentType: false,
             success: function(obj) {
                 hideLoadingAndOverlay();
                 if (obj.code == DATA_TOO_LARGE) {
                     console.log("图片大小超过限制 !");
                     openAlert("发布失败 !");
                     return;
                 }
                 if (obj.code != 1) {
                     openAlert("发布失败 !");
                     return;
                 }
                 var id = obj.data.id;
                 toCache('id', id);
                 $("#back").click();
             }
         });
    }

    function resetForm(){
        $("#addContent").val(null);
        removeImg();
    }
