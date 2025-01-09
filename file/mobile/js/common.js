
    const LIST = {
      HEADER_TYPE: 'headerType',
    }

    var headerType = getCache(LIST.HEADER_TYPE);

    $.ajaxSetup({
        beforeSend:function(xhr) {
            addHeaderToken (xhr);
        }
    });

    $(document).ajaxSuccess(function(event, xhr, settings) {
        var res = xhr.responseText;
        if (res == undefined) {
            return;
        }
        var jsonData = JSON.parse(res);
        ifToLoginByCode (jsonData.code);
        storageResponseHeaderToken (xhr);
        console.log(getDecode(CONNECT_MSG));
    });

    function getTraceId() {
        return "m" + getUuid() + "_" + getYyyyMMddHHmmssSSS(new Date());
    }

    function resizeTextArea(id) {
        var textarea = document.getElementById(id);
        textarea.style.height = 'auto'; // 先将高度设置为auto，用于获取内容完整高度
        textarea.style.height = textarea.scrollHeight + 'px'; // 根据内容高度来设置textarea高度
    }

    function disabledAll(){
        $('#getOrUpdate, #add-page').find("input, select, textarea").prop("disabled", true);
        $("#allowEdit").show();
        $("#addOrUpdateBtn").hide();
    }

     function allowEdit(){
          $("#addOrUpdateBtn").show();
          $('#getOrUpdate, #add-page').find("input, select, textarea").prop("disabled", false);
          $(".checkbox-div[type='checkbox']").prop("disabled", false).checkboxradio("refresh");
          $("#allowEdit").hide();
     }

    function logout(){
         deleteMobileCache();
         location.href = "login.html";
    }

    function deleteMobileCache(){
         deleteAllCache();

         removeCache(TOKEN.USER_NAME);

         removeCache(LIST.HEADER_TYPE);
         removeCache('id');
         removeCache('justUpdated');

         removeCache("missionTotal");
         removeCache("noteTotal");
         removeCache("financeTotal");
         removeCache("productOutputTotal");
         removeCache("tradeGoodsTotal");
         removeCache("shareUserTotal");

         removeCache(INIT.GOODS_SUPPLIER_TYPE);
         removeCache("supplier");
         removeCache(INIT.GOODS_SUPPLIER_TYPE);
         removeCache("goods");
         removeCache(INIT.GOODS_TRADE_TYPE);
         removeCache(INIT.UNIT);
         removeWithPrefix("product_");
         removeWithPrefix("transaction_type_");
         removeCache(INIT.NOTE_TYPE);
         removeCache(INIT.MISSION_PACE);
         removeCache(INIT.MISSION_TYPE);
         removeCache(INIT.USER_AVATAR);
         removeCache(INIT.USER_HOME_PAGE);
    }

    function self(){
       location.href = "self.html";
    }

    function hideAddBtn(){
        $("#addBtn").hide();
    }

    function hideUpdateBtn(){
        $("[id^='delete_']").hide();
    }

    function toListPage(){
        location.href = "list.html";
    }

    function hideOrShowToTop(position){
        if(position > 300) {
            $("#scrollTopBtn").fadeIn('slow');
        } else {
            prePosition = null;
            $("#scrollTopBtn").fadeOut('slow');
        }
    }

    function showBottomNoMessage(){
        $("#bottom-message").show();
    }

    function hideBottomNoMessage(){
        $("#bottom-message").hide();
    }

    function toTop(){
        $('html, body').animate({scrollTop: 0}, 'fast');
        $("#scrollTopBtn").hide();
        prePosition = null;
    }

    function removeImg(){
        $("#imagePreviewDiv").hide();
        file = null;
        document.getElementById('postImage').value = '';
        $("#imagePreview").removeAttr("src");
    }

    function showUploadArea(){
        if(isVip()){
            $(".upload-area").show();
        }
    }

    function hideUploadArea(){
        $(".upload-area").hide();
    }

    function showLoadingAndOverlay(){
        $.mobile.loading("show");
        showOverlay();
    }

    function showOverlay(){
        $("#loading-overlay").show();
    }

    function hideLoadingAndOverlay(){
        $.mobile.loading("hide");
        hideOverlay();
    }

    function hideOverlay(){
        $("#loading-overlay").hide();
    }

    function closeAlert(){
        $('#alertOverlay').hide();
        $('#alertModal').hide();
    }

    function openAlert(message){
        $('#alertMessage').text(message);
        $("#alertOverlay").show();
        $('#alertModal').show();
        $('#closeAlert').show();
        $('#confirm, #cancel').hide();
    }

     function customConfirm(message, onConfirm, onCancel) {
        openAlert(message);
        $('#closeAlert').hide();
        $('#confirm, #cancel').show();
        $('#confirm').off('click').on('click', function() {
            closeAlert();
            if (onConfirm) {
                onConfirm();
            }
        });

        $('#cancel').off('click').on('click', function() {
            closeAlert();
            if (onCancel) {
                onCancel();
            }
        });

        $('#alertOverlay').off('click').on('click', function() {
            closeAlert();
        });
     }

    function getBigImg(url){
        showLoadingAndOverlay();
        $.ajax({
            url: url,
            method: 'GET',
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code != 1){
                    return;
                }
                var imgBase64 = obj.data.imgUrl;
                if (imgBase64 == null || imgBase64 == '') {
                    return;
                }
                $("#imagePreview").attr("src", imgBase64);
                $(".getImg").hide();
            }
        });
    }

    function getBackgroundColor(headerType){
        var backgroundColor;
        if (headerType == "mission") {
           backgroundColor = "#B0E0E6";
        } else if (headerType == "note"){
           backgroundColor = "#D1EEEE";
        } else if (headerType == "finance"){
           backgroundColor = "#EEEED1";
        } else if (headerType == "product"){
           backgroundColor = "#B4EEB4";
        } else if (headerType == "goods"){
           backgroundColor = "#B4CDCD";
        }
        return backgroundColor;
    }

    var commonFootBackgroundColor = "#8FBC8F";

    var searchSelectDefaultBackgroundColor = "#E8E8E8";
    var searchSelectChosenBackgroundColor = "#96CDCD";