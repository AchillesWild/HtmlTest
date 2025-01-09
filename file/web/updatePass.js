
    $(document).ready(function() {

        $.ajax({
            url: userHost + "/get/info",
            method: 'GET',
            success: function(obj) {
                $("#userName").val(obj.data.userName);
            }
        });

        $("#updatePassBtn").on('click', function() {

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
            if (!checkPassWord(newPassword)) {
                 openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
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
                        top.location.href = "login.html";
                    });
                }
            });
	    });

        $("#toRegister").on('click', function() {
             location.href = "register.html";
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