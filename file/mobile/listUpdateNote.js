
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            if(headerType != "note"){
                return;
            }
            openScroll = false;
            var id = getCache('id');
            getTheNoteType();
            if(id != null){
                $("#headerName").html("笔记(查看)");
            } else {
                $("#headerName").html("笔记(新增)");
                showNoteElements();
                allowEdit();
                showUploadArea();
            }
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            if(headerType != "note"){
                return;
            }
            var id = getCache('id');
            if(id != null){
                getNoteDetail(id);
            } else {
                $("#updateTitle").focus();
            }
        });


        $("#addOrUpdateBtn").on('click', function(event) {
            if(headerType != "note"){
                return;
            }
            event.preventDefault();
            addOrUpdateNote(this);
        });

        $("#allowEdit").on('click', function(event) {
            if(headerType != "note"){
                return;
            }
            allowEdit();
            $("#headerName").html("笔记(编辑)");
            showUploadArea();
            $(".deleteIcon").show();
            $(".getImg").hide();
            $("#updateTitle").focus();
        });
    });

    function showNoteElements(){
        $("#updateTitleDiv, #updateTypeDiv, #updateContentDiv").show();
    }

    function addOrUpdateNote(object){
        var title = $("#updateTitle").val();
        if(title == '' || title.length > 64){
            openAlert(MSG_TITLE_64);
            return;
        }

        var files = new FormData();
        files.append('file', file);
        files.append('title', title);
        files.append('content', $("#updateContent").val());
        files.append('type', $("#updateType").val());
        var imgUrl = $("#imagePreview").attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
        var id = $("#updateId").val();
        var url = noteHost + "/update/"+id;
        if (id == null || id == "") {
            url = noteHost + "/add";
        }
        showLoadingAndOverlay();
        $.ajax({
            url: url,
            type: 'POST',
            data: files,
            dataType: 'json',
            processData: false,
            contentType: false,
//            async: false,
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code == NOTE_OUT_OF_LIMIT.CODE) {
                    openAlert(NOTE_OUT_OF_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                toCache(LIST.HEADER_TYPE, "note");
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();

            }
        });
    }

    function getNoteDetail(id){
        showLoadingAndOverlay();
        $.ajax({
            url: noteHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                showNoteElements();
                $("#updateId").val(obj.data.id);
                $("#updateTitle").val(obj.data.title);
                var content = obj.data.content;
                if(content != null && content != ''){
                    $("#updateContent").val(content);
                    $("#copyContentDiv").show();
                }
                resizeTextArea('updateContent');
                $('#updateType').val(obj.data.type).selectmenu("refresh");
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
                disabledAll();
                if(ifShareUser()){
                    $("#allowEdit").hide()
                }
            }
        });
    }

    function getTheNoteType () {
        $("#updateType").empty();
        var noteTypeMap = getNoteType();
        $.each(noteTypeMap, function(index, value){
            $("#updateType").append("<option value='" +index+ "'>"+value+"</option>");
            if(index == 0){
                $('#updateType').val(index).attr('selected', true).selectmenu('refresh');
            }
        });
    }