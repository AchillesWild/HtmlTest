    function showPreviewAndDelete(type, imgBase64){
         showPreview(type, imgBase64);
         $("#"+type+"ShowImg").append("<span id='deleteImgBtn' style='float:right;color:red;font-weight:bold;font-size:15px'>移除图片</span>");
         $("#deleteImgBtn").on('click', function() {
            removeImgPreview(type);
         });
    }

    function showPreview(type, imgBase64){
        $("#"+type+"ShowImg").empty().append("<img src="+imgBase64+" id='"+type+"ImgPreview' name='imgUrl' height='205px' width='260px'/>");
    }

    function removeImgPreview (type){
        $("#"+type+"ShowImg").empty();
        $("#"+type+"UploadImage").val(null);
        file = null;
    }

    $(document).ready(function() {

       $("#updateUploadImage").change(async function(){
         file = await compressImage($(this)[0].files[0]);
         showPreviewAndDelete("update", URL.createObjectURL(file));
       });
       $('#update-drop-area').on('dragover', function(event) {
         event.preventDefault();
         $(this).addClass('dragover');
       });

       $('#update-drop-area').on('dragleave', function(event) {
         event.preventDefault();
         $(this).removeClass('dragover');
       });
       $('#update-drop-area').on('drop', async function(event) {
         event.preventDefault();
         $(this).removeClass('dragover');

         file = event.originalEvent.dataTransfer.files[0];
         if (!file.type.match('image.*')) {
           alert('请选择图片文件');
           return;
         }

         file = await compressImage(file);
         var reader = new FileReader();
         reader.onload = function(event) {
            showPreviewAndDelete("update", URL.createObjectURL(file));
         };
         reader.readAsDataURL(file);
       });

       $("#addUploadImage").change(async function(){
         file = await compressImage($(this)[0].files[0]);
         showPreviewAndDelete("add", URL.createObjectURL(file));
       });
       $('#add-drop-area').on('dragover', function(event) {
         event.preventDefault();
         $(this).addClass('dragover');
       });

       $('#add-drop-area').on('dragleave', function(event) {
         event.preventDefault();
         $(this).removeClass('dragover');
       });
       $('#add-drop-area').on('drop', async function(event) {
         event.preventDefault();
         $(this).removeClass('dragover');

         file = event.originalEvent.dataTransfer.files[0];
         if (!file.type.match('image.*')) {
           alert('请选择图片文件');
           return;
         }

         file = await compressImage(file);
         var reader = new FileReader();
         reader.onload = function(event) {
            showPreviewAndDelete("add", URL.createObjectURL(file));
         };
         reader.readAsDataURL(file);
       });
    });