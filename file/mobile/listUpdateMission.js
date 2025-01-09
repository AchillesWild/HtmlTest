
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            if(headerType != "mission"){
                return;
            }
            openScroll = false;
            var id = getCache('id');
            getTheMissionType();
            if(id != null){
                $("#headerName").html("待办(查看)");
            } else {
                $("#headerName").html("待办(新增)");
                showMissionElements();
                $("#updatePaceDiv").hide();
                allowEdit();
                showUploadArea();
            }
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            if(headerType != "mission"){
                return;
            }
            var id = getCache('id');
            if(id != null){
                getMissionDetail(id);
            } else {
                $("#updateTitle").focus();
            }
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            if(headerType != "mission"){
                return;
            }
            event.preventDefault();
            addOrUpdateMission(this);
        });

        $("#allowEdit").on('click', function(event) {
            if(headerType != "mission"){
                return;
            }
            allowEdit();
            $("#headerName").html("待办(编辑)");
            showUploadArea();
            $(".deleteIcon").show();
            $(".getImg").hide();
            $("#updateTitle").focus();
        });
    });

    function showMissionElements(){
        $("#updateTitleDiv, #updateTypeDiv, #updateContentDiv").show();
    }

    function addOrUpdateMission(object){

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
        var pace = $("#updatePace").val();
        if(pace != undefined){
            files.append('pace', pace);
        }
        var imgUrl = $("#imagePreview").attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
        var id = $("#updateId").val();
        var url = missionHost + "/update/"+id;
        if (id == null || id == "") {
            url = missionHost + "/add";
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
                if (obj.code == MISSION_OUT_OF_LIMIT.CODE) {
                    openAlert(MISSION_OUT_OF_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                toCache(LIST.HEADER_TYPE, "mission");
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();
            }
        });
    }

    function getMissionDetail(id){
        showLoadingAndOverlay();
        $.ajax({
            url: missionHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                showMissionElements();
                $("#updateId").val(obj.data.id);
                $("#updateTitle").val(obj.data.title);
                var content = obj.data.content;
                if(content != null && content != ''){
                    $("#updateContent").val(content);
                    $("#copyContentDiv").show();
                }
                resizeTextArea('updateContent');
                $('#updateType').val(obj.data.type).selectmenu("refresh");
                getPace();
                $("#updatePace").val(obj.data.pace).selectmenu("refresh");
                $("#updatePaceDiv").show()

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

    function getTheMissionType () {
        $("#updateType").empty();
        var missionTypeMap = getMissionType();
        $.each(missionTypeMap, function(index, value){
            $("#updateType").append("<option value='" +index+ "'>"+value+"</option>");
            if(index == 0){
                $('#updateType').val(index).attr('selected', true).selectmenu('refresh');
            }
        });
    }

    function getPace () {
        $("#updatePace").empty();
        var missionPaceMap = getMissionPace();
        $.each(missionPaceMap, function(index, value){
            $("#updatePace").append("<option value='" +index+ "'>"+value+"</option>");
            if(index == 0){
                $('#updatePace').val(index).attr('selected', true).selectmenu('refresh');
            }
        });
    }