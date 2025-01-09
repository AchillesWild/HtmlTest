
    $(document).ready(function() {

        $('#userName').focus();

        $("#toLogin").on('click', function() {
             window.location.href = "login.html";
	    });


        $("#register").on('click', function() {
            register();
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

         $(document).keydown(function(event) {
             if (event.key == 'Enter') {
                 register();
             }
         });
    });

    function register(){
        var userName = $('#userName').val();
        if (userName == '') {
            openAlert("账号不能为空！");
            return;
        }
        if (!checkUserName(userName)) {
            openAlert(MSG_ILLEGAL_USER_NAME);
            return;
        }

        var password = $("#password").val();
        var password2 = $("#password2").val();
        if (password == '' || password2 == '') {
            openAlert("密码不能为空！");
            return;
        }
        if (password != password2) {
            openAlert("两次密码输入不一样！");
            return;
        }
        if (!checkPassWord(password)) {
            openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
            return false;
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
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                openAlert("注册成功, 请登录!");
                $('#closeAlert').click(function() {
                    closeAlert();
                    location.href = "login.html";
                });
            }
        });
    }