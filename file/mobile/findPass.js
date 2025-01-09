
    var userName = getQueryString("userName");
    $(document).ready(function() {
        if(userName != null && userName != "" && userName != undefined){
            $("#userName").val(userName);
        }

        $("#back").on('click', function(event) {
            location.href = "login.html";
        });

        $("#toAnswer").on('click', function(event) {
            getQuestions (userName);
        });

        $("#checkBtn").on('click', function(event) {
            checkAnswer (userName);
        });

        $("#updatePassBtn").on('click', function() {
            updatePass();
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

    function updatePass(){
        var userName = $('#userName').val();
        if (userName == '') {
            openAlert(MSG_USER_NAME_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkUserName(userName)) {
            openAlert(MSG_ILLEGAL_USER_NAME);
            return;
        }
        var answer1 = $("#answer1").val()
        var checkAnswer1Msg = checkAnswer1(answer1);
        if(checkAnswer1Msg != null){
            openAlert(checkAnswer1Msg);
            return
        }
        var answer2 = $("#answer2").val()
        var checkAnswer2Msg = checkAnswer2(answer2);
        if(checkAnswer2Msg != null){
            openAlert(checkAnswer2Msg);
            return
        }
        var answer3 = $("#answer3").val()
        var checkAnswer3Msg = checkAnswer3(answer3);
        if(checkAnswer3Msg != null){
            openAlert(checkAnswer3Msg);
            return
        }
        var newPassword = $("#newPassword").val();
        if (newPassword == null || newPassword == "") {
            openAlert(MSG_PASSWORD_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkPassWord(newPassword)) {
             openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
            return;
        }
        var newPassword2 = $("#newPassword2").val();
        if (newPassword2 == null || newPassword2 == "") {
            openAlert(MSG_INPUT_NEW_PASSWORD_AGAIN);
            return;
        }
        if (newPassword != newPassword2) {
            openAlert(MSG_PASSWORD_NOT_SAME);
            return;
        }

        let user = {
                            "userName": userName,
                         "newPassword": newPassword,
                           "question1": $("#question1").val(),
                             "answer1": answer1,
                           "question2": $("#question2").val(),
                             "answer2": answer2,
                           "question3": $("#question3").val(),
                             "answer3": answer3
                   };
        $.ajax({
            url: userHost + "/update/password/question",
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code == MASTER_AND_SHARE_USER_PASS_CAN_NOT_SAME.CODE) {
                    openAlert(MASTER_AND_SHARE_USER_PASS_CAN_NOT_SAME.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                openAlert("密码重置成功, 请重新登录 !");
                $('#closeAlert').click(function() {
                    closeAlert();
                    location.href = "login.html";
                });
            }
       });
    }

     function getQuestions () {
        var userName = $("#userName").val();
        if(userName == null || userName == ""){
            openAlert(MSG_USER_NAME_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkUserName(userName)) {
            openAlert(MSG_ILLEGAL_USER_NAME);
            return;
        }
         $.ajax({
             url: userHost + "/get/all/question",
             method: 'GET',
             success: function(obj) {
                 var arr = obj.data;
                 $.each(arr,function(index, object){
                     $("#question1,#question2,#question3").append("<option value='" +object.key+ "'>"+object.value+"</option>");
                 });

                 $.ajax({
                     url: userHost + "/get/question/update/pass",
                     method: 'GET',
                     data: "userName="+userName,
                     async: false,
                     success: function(obj) {
                         if (obj.code == USER_IS_MISSING.CODE) {
                             openAlert(USER_IS_MISSING.MSG)
                             return;
                         }
                         if (obj.code == USER_NOT_SET_QUESTION.CODE) {
                              openAlert(USER_NOT_SET_QUESTION.MSG)
                              return;
                          }
                         if (obj.code == SHARE_USER) {
                              openAlert(MSG_SHARE_USER_CAN_NOT_FIND_PASSWORD)
                              return;
                          }
                         var data = obj.data;
                         $("#question1").val(data.question1).attr('selected', true).selectmenu('refresh');
                         $("#question2").val(data.question2).attr('selected', true).selectmenu('refresh');
                         $("#question3").val(data.question3).attr('selected', true).selectmenu('refresh');

                         $(".way").hide();
                         $(".answer").show();
                     }
                 });
             }
         });
     }

    function checkAnswer () {
        var userName = $('#userName').val();
        if (userName == '') {
            openAlert(MSG_USER_NAME_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkUserName(userName)) {
            openAlert(MSG_ILLEGAL_USER_NAME);
            return;
        }
        var checkAnswer1Msg = checkAnswer1($("#answer1").val());
        if(checkAnswer1Msg != null){
            openAlert(checkAnswer1Msg);
            return
        }
        var checkAnswer2Msg = checkAnswer2($("#answer2").val());
        if(checkAnswer2Msg != null){
            openAlert(checkAnswer2Msg);
            return
        }
        var checkAnswer3Msg= checkAnswer3($("#answer3").val());
        if(checkAnswer3Msg != null){
            openAlert(checkAnswer3Msg);
            return
        }
        $.ajax({
             url: userHost + "/check/answer",
             method: 'GET',
             data: $("#checkForm").serialize()+"&userName="+userName,
             async: false,
             success: function(obj) {
                 if (obj.code != 1) {
                     openAlert("验证不通过 !");
                     return;
                 }
                openAlert("验证通过 !");
                $(".answer").hide();
                $(".pass").show();
             }
        });
    }

    function checkAnswer1(answer1){
        if(answer1 == null || answer1 == ""){
            return "请输入问题1的答案!";
        }
        return null;
    }

    function checkAnswer2(answer2){
        if(answer2 == null || answer2 == ""){
            return "请输入问题2的答案!";
        }
        return null;
    }

    function checkAnswer3(answer3){
        if(answer3 == null || answer3 == ""){
            return "请输入问题3的答案!";
        }
        return null;
    }