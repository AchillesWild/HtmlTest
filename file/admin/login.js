
    $(document).ready(function() {

        $('#adminName').focus();

        $("#login").on('click', function() {
            login();
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
        var adminName = $('#adminName').val();
        if (adminName == '') {
            alert(MSG_USER_NAME_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkUserName(adminName)) {
            alert(MSG_ILLEGAL_USER_NAME);
            return;
        }
        var password = $('#password').val();
        if (password == '') {
            alert(MSG_PASSWORD_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkPassWord(password)) {
            alert(MSG_ILLEGAL_PASSWORD_PROMPT);
            return;
        }
        let user = {
                    "adminName": adminName,
                     "password": password
                   };
        $.ajax({
            url: adminHost + "/login",
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code != 1) {
                    alert(obj.message);
                    return;
                }
                toCache(ADMIN_TOKEN.NAME, obj.data.token);
                location.href = "index.html";
            },
            error: function(error) {
                alert("error");
            }
        });
    }