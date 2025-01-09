
    $(document).ready(function() {

        $('#userName').focus();

        $("#login").on('click', function() {
           login();
	    });

        $("#toRegister").on('click', function() {
             window.location.href = "register.html";
	    });
        $("#findPass").on('click', function() {
            var params = "";
            var userName = $('#userName').val();
            if (userName != '' && userName != null) {
                 params = "?userName="+userName;
            }
            location.href = "findPass.html"+params;
        });

         $(document).on('click', '.showPassword', function() {
             if($('#password').val() == ''){
                 return;
             }
             var inputType = $('#password').attr('type') === 'password' ? 'text' : 'password';
             $('#password').attr('type', inputType);
             $(this).text(inputType === 'password' ? '👁️' : '🙈');
         });

         $('#password').on('input', function() {
             if ($(this).val() === '') {
                 $(this).attr('type', 'password');  // 恢复为密码状态
                 $('.showPassword').text('👁️'); // 重置图标
             }
         });

        $(document).keydown(function(event) {
            if (event.key == 'Enter') {
                login();
            }
        });
    });

    function login(){
        var userName = $('#userName').val();
        if (userName == '') {
            openAlert(MSG_USER_NAME_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkUserName(userName)) {
            openAlert(MSG_ILLEGAL_USER_NAME);
            return;
        }
        var password = $('#password').val();
        if (password == '') {
            openAlert(MSG_PASSWORD_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkPassWord(password)) {
            openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
            return;
        }
        let user = {
                    "userName": userName,
                    "password": password
                   };
        $.ajax({
            url: userHost + "/login",
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code == USER_IS_FROZEN_BY_WRONG_PASSWORD.CODE) {
                     openAlert(obj.message);
                     return;
                }
                if (obj.code == USER_IS_MISSING.CODE) {
                     openAlert(USER_IS_MISSING.MSG)
                     return;
                }
                if (obj.code == PASSWORD_IS_WRONG.CODE) {
                     openAlert(PASSWORD_IS_WRONG.MSG);
                     return;
                }
                if (obj.code == USER_IS_FROZEN.CODE) {
                     openAlert(USER_IS_FROZEN.MSG);
                     return;
                }
                if (obj.code != 1) {
                    return;
                }
                deleteWebCache();
                toCache(TOKEN.NAME, obj.data.token);
                location.href = "index.html";
            }
        });
    }