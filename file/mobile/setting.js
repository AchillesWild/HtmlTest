    $(document).ready(function() {

        ifToLoginByLocalToken();

        $("#nickName").text(getNickName() + "   ➡️");
        $("#userName").text(getUserName() + "   ➡️");
        $("#homePage").text(getHomePageValue(getHomePage()) + "   ➡️");
        var myAvatar = getAvatar();
        if(myAvatar == null){
            myAvatar = DEFAULT_IMG_BASE64;
        }
        $("#avatar").attr("src", myAvatar);

         $.ajax({
             url: userHost + "/if/set/question",
             method: 'GET',
             success: function(obj) {
                 var text;
                 if (obj.code != 1 || obj.data != 1) {
                     text = '未设置(用于找回密码)   ➡️';
                 } else {
                     text = '已设置   ➡️';
                 }
                var span = $('<span href="#" style="color:#00868B;font-weight:bold;font-size:1.3em">'+text+'</span>');
                $('#question').prepend(span);
             }
         });

        $.ajax({
            url: configHost + "/get/contact",
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                var contactEmail = obj.data.contactEmail == null ? "" : obj.data.contactEmail;
                $("#contactEmail").text(contactEmail);
            }
        });

        $("#nickName").on('click', function(event) {
            location.href =  "settingUpdate.html?type=nickName";
        });

        $("#userName").on('click', function(event) {
            location.href =  "settingUpdate.html?type=userName";
        });

        $("#homePage").on('click', function(event) {
            location.href =  "settingUpdate.html?type=homePage";
        });

        $("#question").on('click', function(event) {
        //检查是否已经设置问题，如果设置了，弹框要求输入密码。输入密码点击确定后，校验成功后，截取加密后密码的一版返回，然后再带到下一个也获取答案
            $.ajax({
                 url: userHost + "/if/set/question",
                 method: 'GET',
                 success: function(obj) {
                     if (obj.code != 1 || obj.data != 1) {
                         location.href = "settingUpdate.html?type=question";
                         return;
                     }
                    openPassAlert();
                 }
            });
        });

        $("#confirmPass").on('click', function(event) {
            event.preventDefault();
            toCheckPass();
        });

        $("#cancelPass").on('click', function(event) {
            closePassAlert();
        });

        $("#updatePassIcon").on('click', function(event) {
            location.href =  "settingUpdate.html?type=password";
        });

        $("#toListPage").on('click', function(event) {
            $(this).addClass("active").css("background-color", commonFootBackgroundColor);
            toListPage();
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
	});

    function changeAvatar() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async function (event) {
            var reader = new FileReader();
            reader.onload = function () {
                document.getElementById('avatar').src = reader.result;
            };
            reader.readAsDataURL(event.target.files[0]);

             var files = new FormData();
             var file = await compressImg(event.target.files[0], 500, 500);
             files.append('file', file);
             $.ajax({
                 url: userHost + "/update/avatar",
                 type: 'POST',
                 data: files,
                 dataType: 'json',
                 processData: false,
                 contentType: false,
                 success: function(obj) {
                     if (obj.code != 1) {
                         openAlert("修改失败 !");
                         return;
                     }
                     removeCache(INIT.USER_AVATAR);
                     toCache(INIT.USER_AVATAR, reader.result);
                 }
             });
        };
        input.click();
    }

    function cancel(){
       customConfirm("您确定注销账号吗? (注销后该账号在本系统的所有数据将被删除, 且不可恢复!)",
            function() {
                customConfirm(SECOND_CONFIRM,
                     function() {
                        showLoadingAndOverlay();
                        $.ajax({
                            url: userHost + "/cancel",
                            method: 'POST',
                            success: function(obj) {
                                hideLoadingAndOverlay();
                                if (obj.code != 1) {
                                    openAlert("失败 !");
                                    return;
                                }
                                openAlert("账号已注销 !");
                            }
                        });
                     },
                     function() {return;}
                )
            }
       , function() {return;});

    }

    function openPassAlert(){
        $("#alertOverlay0").show();
        $('#alertPass').show();
    }

    function closePassAlert(){
        $('#alertOverlay0').hide();
        $('#alertPass').hide();
        $('#password').val("").attr('type', 'password');
        $('.showPassword').text('👁️'); // 重置图标
    }

    function toCheckPass() {
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
                "password": password
               };
        $.ajax({
            url: userHost + "/check/pass/get/part",
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code != 1) {
                    openAlert(PASSWORD_IS_WRONG.MSG);
                    return;
                }
                var partEncPass = obj.data;
                location.href = "settingUpdate.html?type=question&partEncPass=" + partEncPass;
                closePassAlert();
            }
        });
    }