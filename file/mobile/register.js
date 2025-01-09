
    $(document).ready(function() {

        $('#userName').focus();

        $("#toLogin").on('click', function() {
            location.href = "login.html";
	    });


        $("#register").on('click', function() {
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
            var password2 = $("#password2").val();
            if (password == '') {
                openAlert(MSG_PASSWORD_CAN_NOT_BE_NULL);
                return;
            }
            if (!checkPassWord(password)) {
                openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
                return false;
            }
            if (password2 == '') {
                openAlert(MSG_INPUT_PASSWORD_AGAIN);
                return;
            }
            if (password != password2) {
                openAlert(MSG_PASSWORD_NOT_SAME);
                return;
            }

            let user = {
                        "userName": userName,
                        "password": password
                       };
            $.ajax({
                url: userHost + "/register",
                method: 'POST',
                data: JSON.stringify(user),
                contentType: 'application/json;charset=utf-8',
                success: function(obj) {
                    if (obj.code == USER_NAME_HAS_EXISTED.CODE) {
                        openAlert(USER_NAME_HAS_EXISTED.MSG);
                        return;
                    }
                    if (obj.code == REGISTER_OUT_OF_LIMIT.CODE) {
                        openAlert(REGISTER_OUT_OF_LIMIT.MSG);
                        return;
                    }
                    if (obj.code != 1) {
                        return;
                    }
                    openAlert("注册成功, 请登录 !");
                    $('#closeAlert').click(function() {
                        closeAlert();
                        location.href = "login.html";
                    });
                }
            });
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