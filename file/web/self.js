    $(document).ready(function() {

        $.ajax({
            url: userHost + "/gender",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,value){
                    $("#updateGender").append("<option value='" +index+ "'>"+value+"</option>");
                });
                getHomePage();
            }
        });

        $("#updateBtn").on('click', function(event) {

            var userName = $('#updateUserName').val();
            if (userName == '') {
                openAlert("账号不能为空！");
                return;
            }
            if (!checkUserName(userName)) {
                openAlert(MSG_ILLEGAL_USER_NAME);
                return;
            }

           var nickName = $("#updateNickName").val();
           var homePage = $("#updateHomePage").val();
           let user = {
                    "userName": userName,
                    "nickName": nickName,
                       "email": $("#updateEmail").val(),
                      "mobile": $("#updateMobile").val(),
                      "gender": $("#updateGender").val(),
                      "homePage": $("#updateHomePage").val()
                     };

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
                   if (nickName != null && nickName != '') {
                         toCache(TOKEN.NICK_NAME, nickName)
                    }
                    openAlert("保存成功");
                    //top.location.href = "index.html";
                }
            });
        });
	});

	function getHomePage (){
        $.ajax({
            url: userHost + "/homePage",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,value){
                    $("#updateHomePage").append("<option value='" +index+ "'>"+value+"</option>");
                });
                getInfo();
            }
        });
	}

	function getInfo () {
        $.ajax({
            url: userHost + "/get/info",
            method: 'GET',
            success: function(obj) {
                $("#updateUserName").val(obj.data.userName);
                var nickName = obj.data.nickName;
                $("#updateNickName").val(nickName);
//                $("#updateEmail").val(obj.data.email);
//                $("#updateMobile").val(obj.data.mobile);
                $("#updateGender").val(obj.data.gender);
                $("#updateHomePage").val(obj.data.homePage);
                $(".container").show();
            }
        });
	}