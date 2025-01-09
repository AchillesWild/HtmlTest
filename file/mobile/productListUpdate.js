    var file = null;
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            $("#back").show();
            openScroll = false;
            var id = getCache('id');
            getTheUnits();
            if(id != null){
                $("#headerName").html("计量物(查看)");
                getDetail(id);
                disabledAll();
               if(ifShareUser()){
                    $("#allowEdit").hide()
               }
            } else {
                $("#headerName").html("计量物(新增)");
                allowEdit();
                showUploadArea();
            }
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate();
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            var id = getCache('id');
            if(id == null){
                $("#updateName").focus();
            }
        });

        $("#allowEdit").on('click', function(event) {
            $("#headerName").html("计量物(编辑)");
            allowEdit();
            showUploadArea();
            $("#updateName").focus();
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
            getBigImg(productHost + "/get/img/"+id);
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
            url: productHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                 $("#updateId").val(obj.data.id);
                 $("#updateName").val(obj.data.name);
                 $("#updateCode").val(obj.data.code);
                 $("#updateSort").val(obj.data.sort);
                 $("#updateUnit").val(obj.data.unit).selectmenu("refresh");
                 $("#updateDescription").val(obj.data.description);
                 resizeTextArea('updateDescription');
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

    function addOrUpdate(){
         var name = $("#updateName").val();
         if(name == '' || name.length > 32){
             openAlert(MSG_NAME_32);
             return;
         }

         var files = new FormData();
         files.append('file', file);
         files.append('name', name);
         var code = $("#updateCode").val();
         if(code.length > 32){
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
         files.append('unit', $("#updateUnit").val());
         var description = $("#updateDescription").val();
         if(description.length > 1024){
             openAlert(MSG_DESCRIPTION_1024);
             return;
         }
         files.append('description', description);
        var imgUrl = $("#imagePreview").attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
        var id = $("#updateId").val();
        var url = productHost + "/update/"+id;
        if (id == undefined || id == null || id == "") {
            url = productHost + "/add";
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
                removeProductCache();
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();
            }
        });
    }

    function getTheUnits() {
        $("#updateUnit").empty();
        var unitArray = getUnits();
        $.each(unitArray, function(index, object){
            $("#updateUnit").append("<option value='" +object.unit+ "'>"+object.unitValue+"</option>");
            if(index == 0){
                $('#updateUnit').val(object.unit).attr('selected', true).selectmenu('refresh');
            }
        });
    }
