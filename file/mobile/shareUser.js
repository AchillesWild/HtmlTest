    var id = getQueryString("id");
    $(document).ready(function() {

        ifToLoginByLocalToken();

        if(id != null){
           $("#passwordDiv").hide();
           $("#headerName").html("分享账号(查看)");
           getDetail();
           disabledAll();
        } else {
           $("#headerName").html("分享账号(新增)");
           $("#addOrUpdateBtn").show();
           $("#allowEditShare").hide();
           $("#userName").focus();
        }

        $("#allowEditShare").on('click', function(event) {
          $("#addOrUpdateBtn").show();
          $('#getOrUpdate, #add-page').find("input").prop("disabled", false);
          $("[type='checkbox']").prop("disabled", false).checkboxradio("refresh");
          $(this).hide();
          $("#headerName").html("分享账号(编辑)");
//          $("#userName").focus();
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            if(id == null || id == undefined){
                add();
            } else {
                update();
            }
        });

        $("#selectAll").click(function(){
             var checkBoxAll = $("input[name='sharePages']");
             if(this.checked){
                  $.each(checkBoxAll,function(i,checkbox){
                      $(checkbox).prop("checked",true).checkboxradio("refresh");
                  });
              }else{
                  $.each(checkBoxAll,function(i,checkbox){
                      $(checkbox).prop("checked",false).checkboxradio("refresh");
                  });
              }
        });

        $("input[name='sharePages']").click(function(){
           var checkBoxAll = $("input[name='sharePages']");
           var checkedCount = 0;
           $.each(checkBoxAll, function(i,checkbox){
               var checked = $(checkbox).prop("checked");
               if(checked){
                  checkedCount++;
               }
           });
           if(checkBoxAll.length > checkedCount){
                $("#selectAll").prop("checked",false).checkboxradio("refresh");
           }else{
                $("#selectAll").prop("checked",true).checkboxradio("refresh");
           }
        });

        $('#firstPasswordSpan').on('click', function() {
            if($('#password').val() == ''){
                return;
            }
            var inputType = $('#password').attr('type') === 'password' ? 'text' : 'password';
            $('#password').attr('type', inputType);
            $(this).text(inputType === 'password' ? '👁️' : '🙈');
        });

        $('#secondPasswordSpan').on('click', function() {
            if($('#password2').val() == ''){
                return;
            }
            var inputType = $('#password2').attr('type') === 'password' ? 'text' : 'password';
            $('#password2').attr('type', inputType);
            $(this).text(inputType === 'password' ? '👁️' : '🙈');
        });

        $('#password').on('input', function() {
            if ($(this).val() === '') {
                $(this).attr('type', 'password');
                $('#firstPasswordSpan').text('👁️');
            }
        });

        $('#password2').on('input', function() {
            if ($(this).val() === '') {
                $(this).attr('type', 'password');
                $('#secondPasswordSpan').text('👁️');
            }
        });
    });

    function getDetail(){
        $.ajax({
            url: shareUserHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                $("#updateId").val(obj.data.id);
                $("#userName").val(obj.data.userName);
                $("#nickName").val(obj.data.nickName);
                var sharePages = obj.data.sharePages;
                var checkArray = sharePages.split(",");
                var checkBoxAll = $("input[name='sharePages']");
                for(var i = 0; i < checkArray.length; i++){
                     $.each(checkBoxAll,function(j,checkbox){
                         var checkValue = $(checkbox).val();
                         if(checkArray[i] == checkValue){
                             $(checkbox).prop("checked",true).checkboxradio("refresh");
                         }
                     })
                 }
                 if(checkArray.length == checkBoxAll.length){
                      $("#selectAll").prop("checked",true).checkboxradio("refresh");
                 }
            }
        });
    }

    function update(){
        var userName = $('#userName').val();
        if (userName == '') {
            openAlert(MSG_USER_NAME_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkUserName(userName)) {
            openAlert(MSG_ILLEGAL_USER_NAME);
            return;
        }
        var checkList = new Array();
        $('input[name="sharePages"]:checked').each(function(){
            checkList.push($(this).val());//向数组中添加元素
        });
        if(checkList.length == 0){
            openAlert(MSG_SHARE_MODEL_MUST_CHOOSE);
            return false;
        }
        var sharePages = checkList.join(',');//将数组元素连接起来以构建一个字符串

        let user = {
                    "userName": userName,
                    "nickName": $("#nickName").val(),
                  "sharePages": sharePages
                   };
        showLoadingAndOverlay();
        $.ajax({
            url: shareUserHost + "/update/"+$("#updateId").val(),
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code == USER_NAME_HAS_EXISTED.CODE) {
                    openAlert(USER_NAME_HAS_EXISTED.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                removeCache("shareUserTotal");
                location.href="shareUserList.html";
            }
        });
    }

    function add(){
        var userName = $('#userName').val();
        if (userName == '') {
            openAlert(MSG_USER_NAME_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkUserName(userName)) {
            openAlert(MSG_ILLEGAL_USER_NAME);
            return;
        }

        var password = $("#password").val();
        if (password == '') {
            openAlert(MSG_PASSWORD_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkPassWord(password)) {
            openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
            return false;
        }
        var password2 = $("#password2").val();
        if ( password2 == '') {
            openAlert(MSG_INPUT_PASSWORD_AGAIN);
            return;
        }
        if (password != password2) {
            openAlert(MSG_PASSWORD_NOT_SAME);
            return;
        }

        var checkList = new Array();
        $('input[name="sharePages"]:checked').each(function(){
            checkList.push($(this).val());//向数组中添加元素
        });
        if(checkList.length == 0){
            openAlert(MSG_SHARE_MODEL_MUST_CHOOSE);
            return false;
        }
        var sharePages = checkList.join(',');//将数组元素连接起来以构建一个字符串

        let user = {
                    "userName": userName,
                    "password": password,
                    "nickName": $("#nickName").val(),
                  "sharePages": sharePages
                   };
        $.ajax({
            url: shareUserHost + "/register",
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code == USER_NAME_HAS_EXISTED.CODE) {
                    openAlert(USER_NAME_HAS_EXISTED.MSG);
                    return;
                }
                if (obj.code == SHARE_USER_COUNT_EXCEED_LIMIT.CODE) {
                    openAlert(SHARE_USER_COUNT_EXCEED_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                removeCache("shareUserTotal");
                location.href="shareUserList.html";
            }
        });
    }
