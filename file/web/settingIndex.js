
    $(document).ready(function() {

        var lastLoginDate = timestampToDate(getLastLoginDate());
        if(lastLoginDate != ""){
            $("#lastLoginDate").html("上次登录时间 : " + lastLoginDate);
        }

//        var nickName = getNickName();
//        $("#helloNickName").html(nickName + " !");

//        var homePage = $(this).val();
//        var href = "self.html";
//        changeChosen($("#check a[value='0']")[0]);
//        if (homePage == 0) {
//            href = "updatePass.html";
//        } else if (homePage == 1){
//            href = "self.html";
//        }
        //$("iframe").attr('src', href);

//        var $array =  $("#check a");
//        $.each($array,function(index, obj){
//            if($array[index].href.endsWith(href)){
//                changeChosen(this);
//            } else {
//                $(obj).removeAttr("style");
//            }
//        });

        $(document).on('click',"#check a", function() {
            var value = $(this).attr('value');
            $(this).parent().parent().children().find('a').removeAttr("style");
            changeChosen(this);
//            changeNickName();
        })

//        changeNickName();
    });

    function changeChosen(obj) {
        $(obj).css('color','#006400').css('font-weight','bold');
    }

//    function changeNickName() {
//        $('#helloNickName').css('color','#8B3A3A').css('font-weight','bold').css('font-size','20px');
//    }