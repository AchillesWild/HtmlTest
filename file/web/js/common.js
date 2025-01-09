
    $.ajaxSetup({
        beforeSend:function(xhr) {
            addHeaderToken (xhr);
        }
    });

    $(document).ajaxComplete(function(event, xhr, settings) {
        var res = xhr.responseText;
        if (res == undefined) {
            return;
        }
//        const contentType = xhr.getResponseHeader("Content-Type");
//        if (contentType && contentType.includes("application/json")) {
            var jsonData = JSON.parse(res);
            ifToLoginByCode (jsonData.code);
            storageResponseHeaderToken (xhr);
//        }

        console.log(getDecode(CONNECT_MSG));
    });

    function getTraceId() {
        return "p" + getUuid() + "_" + getYyyyMMddHHmmssSSS(new Date());
    }

    function openMask(){
       $('.overlay').css('display','block');
    }

    function closeMask(){
       $('.overlay').css('display','none');
    }

    function changeTrBgcolor(obj){
       var children = $(obj).parent().children();
       $.each(children, function(i, value){
          if (i % 2 == 0) {
              bgcolor = '#DCDCDC';
          } else {
              bgcolor = '#B0C4DE';
          }
          $(value).css("background-color", bgcolor);
       });
       $(obj).css("background-color", "#6B8E23");
    }

    function hideUpdateBtn(){
        $('#editBtn,#deleteBtn,#copyBtn,#initBtn,#doingBtn,#doneBtn').hide();
    }

    function showBtn(){
        $("#openAddBtn").show();
    }

   function loadingGifToGetFadeIn(){
      $("#loadingGifDiv").fadeIn();
      $("#loadingMsg").html("加载中...");
   }

   function loadingGifToDoFadeIn(){
      $("#loadingGifDiv").fadeIn();
      $("#loadingMsg").html("处理中...");
   }

   function loadingGifFadeOut(){
      $("#loadingGifDiv").fadeOut();
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
    }

    function logout() {
        deleteWebCache();
        top.location.href = "login.html";
    }

    function deleteWebCache(){
        deleteAllCache();
        removeCache(TOKEN.SHARE_PAGES);
        removeCache("indexHref");
    }