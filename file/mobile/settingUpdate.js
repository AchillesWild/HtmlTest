
    var type = getQueryString("type");
    var partEncPass = getQueryString("partEncPass");

    $(document).ready(function() {

        ifToLoginByLocalToken();

        if(type == "homePage"){
            getTheHomePage();
            $("#homePage").val(getCache(TOKEN.HOME_PAGE)).selectmenu("refresh");
            $("#homePageDiv").show();
        } else if (type == "nickName"){
            $("#input").val(getCache(TOKEN.NICK_NAME));
            $("#inputDiv").show();
        } else if (type == "userName"){
            $("#input").val(getCache(TOKEN.USER_NAME));
            $("#inputDiv").show();
        } else if (type == "password"){
            $("#userName").val(getCache(TOKEN.USER_NAME));
            $("#passDiv").show();
        } else if (type == "question"){
            getQuestionsAndAnswer();
        }

        $("#addOrUpdateBtn").on('click', function(event) {
            if(type == "password"){
                updatePass();
            } else if(type == "question"){
                updateQuestion();
            } else {
                updateUser();
            }
        });

        $('#passwordSpan').on('click', function() {
            if($('#password').val() == ''){
                return;
            }
            var inputType = $('#password').attr('type') === 'password' ? 'text' : 'password';
            $('#password').attr('type', inputType);
            $(this).text(inputType === 'password' ? '👁️' : '🙈');
        });

        $('#firstPasswordSpan').on('click', function() {
            if($('#newPassword').val() == ''){
                return;
            }
            var inputType = $('#newPassword').attr('type') === 'password' ? 'text' : 'password';
            $('#newPassword').attr('type', inputType);
            $(this).text(inputType === 'password' ? '👁️' : '🙈');
        });

        $('#secondPasswordSpan').on('click', function() {
            if($('#newPassword2').val() == ''){
                return;
            }
            var inputType = $('#newPassword2').attr('type') === 'password' ? 'text' : 'password';
            $('#newPassword2').attr('type', inputType);
            $(this).text(inputType === 'password' ? '👁️' : '🙈');
        });

        $('#password').on('input', function() {
            if ($(this).val() === '') {
                $(this).attr('type', 'password');
                $('#passwordSpan').text('👁️');
            }
        });

        $('#newPassword').on('input', function() {
            if ($(this).val() === '') {
                $(this).attr('type', 'password');
                $('#firstPasswordSpan').text('👁️');
            }
        });

        $('#newPassword2 ').on('input', function() {
            if ($(this).val() === '') {
                $(this).attr('type', 'password');
                $('#secondPasswordSpan').text('👁️');
            }
        });
    });

    function updateQuestion(){
        var answer1 = $("#answer1").val();
        if(answer1 == '' || answer1.length > 64){
            openAlert(MSG_ILLEGAL_ANSWER);
            return;
        }
        var answer2 = $("#answer2").val();
        if(answer2 == '' || answer2.length > 64){
            openAlert(MSG_ILLEGAL_ANSWER);
            return;
        }
        var answer3 = $("#answer3").val();
        if(answer3 == '' || answer3.length > 64){
            openAlert(MSG_ILLEGAL_ANSWER);
            return;
        }
        var question1 = $("#question1").val();
        var question2 = $("#question2").val();
        var question3 = $("#question3").val();
        if(question1 == question2 || question1 == question3 || question2 == question3){
            openAlert(MSG_QUESTION_CAN_NOT_SAME);
            return;
        }
        if(answer1 == answer2 || answer1 == answer3 || answer2 == answer3){
            openAlert(MSG_ANSWER_CAN_NOT_SAME);
            return;
        }
        let questions = {
                    "question1": question1,
                      "answer1": answer1,
                    "question2": question2,
                      "answer2": answer2,
                    "question3": question3,
                      "answer3": answer3,
                 };
        $.ajax({
            url: userHost + "/update/user/question",
            method: 'POST',
            data: JSON.stringify(questions),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                location.href = "setting.html";
            }
        });
    }

     function getQuestionsAndAnswer() {
         $.ajax({
             url: userHost + "/get/all/question",
             method: 'GET',
             success: function(obj) {
                 var arr = obj.data;
                 $.each(arr,function(index, object){
                     $("#question1,#question2,#question3").append("<option value='" +object.key+ "'>"+object.value+"</option>");
                     if(index == 0){
                        $("#question1,#question2,#question3").val(object.key).selectmenu("refresh");
//                        $("#question2").val(object.key).selectmenu("refresh");
//                        $("#question3").val(object.key).selectmenu("refresh");
                     }
                 });

                 $(".answer").show();
                 if(partEncPass == null){
                    return;
                 }
                 $.ajax({
                     url: userHost + "/get/questionAndAnswer?partEncPass=" + partEncPass,
                     method: 'GET',
                     success: function(obj) {
                         if (obj.code != 1) {
                             return;
                         }
                         var data = obj.data;
                         $("#question1").val(data.question1).selectmenu("refresh");
                         $("#answer1").val(data.answer1);
                         $("#question2").val(data.question2).selectmenu("refresh");
                         $("#answer2").val(data.answer2);
                         $("#question3").val(data.question3).selectmenu("refresh");
                         $("#answer3").val(data.answer3);
                     }
                 });
             }
         });
     }

    function updatePass(){
        var userName = $("#userName").val();
        var password = $("#password").val();
        var newPassword = $("#newPassword").val();
        if (password == "") {
            openAlert(MSG_OLD_PASSWORD_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkPassWord(password)) {
            openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
            return;
        }
        if (newPassword == "") {
            openAlert(MSG_NEW_PASSWORD_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkPassWord(password)) {
             openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
             return;
         }
        if (password == newPassword) {
            openAlert(MSG_NEW_PASSWORD_CAN_NOT_BE_EQUAL_OLD);
            return;
        }
        var newPassword2 = $("#newPassword2").val();
        if (newPassword2 == "") {
            openAlert(MSG_INPUT_NEW_PASSWORD_AGAIN);
            return;
        }
       if (newPassword != newPassword2) {
            openAlert(MSG_NEW_PASSWORD_NOT_SAME);
            return;
        }
        let user = {
                    "userName": userName,
                    "password": password,
                 "newPassword": newPassword
                   };
        $.ajax({
            url: userHost + "/update/password",
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code == USER_IS_MISSING.CODE) {
                     openAlert(USER_IS_MISSING.MSG)
                     return;
                }
                if (obj.code == PASSWORD_IS_WRONG.CODE) {
                     openAlert(MSG_OLD_PASSWORD_IS_WRONG);
                     return;
                }
                if (obj.code == USER_IS_FROZEN.CODE) {
                     openAlert(USER_IS_FROZEN.MSG);
                     return;
                }
                if (obj.code == MASTER_AND_SHARE_USER_PASS_CAN_NOT_SAME.CODE) {
                    openAlert(MASTER_AND_SHARE_USER_PASS_CAN_NOT_SAME.MSG);
                    return;
                }
                if (obj.code != 1) {
                    return;
                }
                openAlert("修改成功, 请重新登录 !");
                $('#closeAlert').click(function() {
                    closeAlert();
                    location.href = "login.html";
                });
            }
        });
    }

	function updateUser(){
        let user;
        if(type == "homePage"){
            user = {"homePage": $("#homePage").val()}
        } else if(type == "nickName"){
            var nickName = $("#input").val();
            if (nickName == null || nickName == '') {
                openAlert(MSG_NICK_NAME_CAN_NOT_BE_NULL);
                return;
            }
            user = {"nickName": nickName}
        } else if(type == "userName"){
            var userName = $('#input').val();
            if (userName == null || userName == '') {
                openAlert(MSG_USER_NAME_CAN_NOT_BE_NULL);
                return;
            }
            if (!checkUserName(userName)) {
                openAlert(MSG_ILLEGAL_USER_NAME);
                return;
            }
            user = {"userName": userName}
        }

        $.ajax({
            url: userHost + "/update/user/info",
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code == USER_NAME_HAS_EXISTED.CODE) {
                    openAlert(USER_NAME_HAS_EXISTED.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                if(type == "homePage"){
                    toCache(TOKEN.HOME_PAGE, $("#homePage").val());
                } else if(type == "nickName"){
                    toCache(TOKEN.NICK_NAME, $('#input').val());
                } else if(type == "userName"){
                    toCache(TOKEN.USER_NAME, $('#input').val());
                }
                location.href = "setting.html";
            }
        });
	}

	function getTheHomePage(){
        var homePageArray = getHomePageSelect();
        $.each(homePageArray, function(index, value){
            $("#homePage").append("<option value='" +index+ "'>"+value+"</option>");
        });
	}
