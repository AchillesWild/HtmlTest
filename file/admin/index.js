
    $(document).ready(function() {

        var nickName = getNickName();
        $("#helloNickName").html(nickName + " !");

        var href = "userList.html";
        var homePage = getCache("homePage");
        if(homePage == 2){
            href = "tokenList.html";
        } else if (homePage == 3){
            href = "logModelClickList.html";
        } else if (homePage == 4){
            href = "noticeList.html";
        } else if (homePage == 5){
            href = "configList.html";
        } else if (homePage == 6){
            href = "deleteModelClick.html";
        }

         $("iframe").attr('src', href);
         var $array =  $("#check a");
         $.each($array, function(index, obj){
             if($array[index].href.endsWith(href)){
                 changeChosen(this);
             } else {
                 $(obj).removeAttr("style");
             }
         });

        $(document).on('click',"#check a", function() {
            var value = $(this).attr('value');
            toCache("homePage", value);
            $(this).parent().parent().children().find('a').css("color","inherit");
            changeChosen(this);
        })

        $(document).on('click',"#helloNickName", function() {;
            $("#check a").css("color","inherit");
        })
    });

    function changeChosen(obj) {
        $(obj).css('color','#006400').css('font-weight','bold');
    }

    function logout() {
        deleteAllCache();
        top.location.href = "login.html";
    }