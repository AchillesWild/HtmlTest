
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            $("#back").show();
            openScroll = false;
            var id = getCache('id');
            if(id != null){
                $("#headerName").html("商品(查看)");
                getDetail(id);
                disabledAll();
               if(ifShareUser()){
                    $("#allowEdit").hide()
               }
            } else {
                $("#headerName").html("商品(新增)");
                allowEdit();
                showUploadArea();
            }
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdateGoods();
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            var id = getCache('id');
            if(id == null){
                $("#updateName").focus();
            }
        });

        $("#allowEdit").on('click', function(event) {
            $("#headerName").html("商品(编辑)");
            allowEdit();
            $("#updateName").focus();
            showUploadArea();
            $(".deleteIcon").show();
            $(".getImg").hide();
        });

        $("#postImage").change(async function(){
           $(".getImg").hide();
           $("#imagePreview").attr("src", URL.createObjectURL($(this)[0].files[0]));
           file = await compressImg($(this)[0].files[0], 1000, 1000);
            $("#imagePreviewDiv").show();
        });

        $(".getImg").on('click', function(event) {
            event.preventDefault();
            var id = getCache('id');
            getBigImg(goodsHost + "/get/img/"+id);
        });

        $("#imagePreview").on("load", function () {  //just take care of add case
           var id = getCache('id');
           if(id == null){
               $(".deleteIcon").show();
           }
        });
    });

    function getDetail(id){
        $.ajax({
            url: goodsHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                 $("#updateId").val(obj.data.id);
                 $("#updateName").val(obj.data.name);
                 $("#updateCode").val(obj.data.code);
                 $("#updateSort").val(obj.data.sort);
                 $("#updateRemark").val(obj.data.remark);
                var imgBase64 = obj.data.compressImgUrl;
                if (imgBase64 != null && imgBase64 != '') {
                    $("#imagePreview").attr("src", imgBase64);
                    $(".getImg").show();
                    $(".deleteIcon").hide();
                    $("#imagePreviewDiv").show();
                } else {
                    $("#viewShowImg").empty();
                    $("#imagePreviewDiv").hide();
                }
            }
        });
    }

    function addOrUpdateGoods(){
         var files = new FormData();
         files.append('file', file);
         var name = $("#updateName").val();
         if(name == ''){
             openAlert(MSG_NAME_CAN_NOT_BE_NULL);
             return;
         }
         if(name.length > 32){
             openAlert(MSG_NAME_32);
             return;
         }
         files.append('name', name);
         var code = $("#updateCode").val();
         if(code != '' && code.length > 32){
             openAlert(MSG_CODE_32);
             return;
         }
         files.append('code', code);
         var sort = $("#updateSort").val();
         if(sort != '' && !checkPositiveAndZero(sort)){
             openAlert(MSG_ORDER_CHECK);
             return;
         }
         files.append('sort', sort);
         var remark = $("#updateRemark").val();
         if(remark != '' && remark.length > 128){
             openAlert(MSG_REMARK_128);
             return;
         }
        files.append('remark', remark);
        var imgUrl = $("#imagePreview").attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
        var id = $("#updateId").val();
        var url = goodsHost + "/update/"+id;
        if (id == undefined || id == null || id == "") {
            url = goodsHost + "/add";
        }
        showLoadingAndOverlay();
        $.ajax({
            url: url,
            type: 'POST',
            data: files,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code == HAS_RELATED_DATA) {
                    openAlert(MSG_PRODUCT_HAS_RELATED_DATA_CAN_NOT_UPDATE_UNIT);
                    return;
                }
                if (obj.code == NAME_HAS_EXISTED.CODE) {
                     openAlert(NAME_HAS_EXISTED.MSG);
                     return;
                }
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                removeGoodsCache();
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();
            }
        });
    }
