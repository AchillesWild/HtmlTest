
    $(document).ready(function() {

        var nickName = getNickName();
        $("#helloNickName").html(nickName + " !");

        if(ifShareUser()){
            $("#avatar").attr("src", DEFAULT_IMG_BASE64);
        } else {
            $.ajax({
                url: userHost + "/get/avatar",
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert(obj.message);
                        return;
                    }
                    var imgUrl = obj.data.imgUrl;
                    if(imgUrl == null || imgUrl == ""){
                        imgUrl = DEFAULT_IMG_BASE64;
                    }
                    $("#avatar").attr("src", imgUrl);
                }
            });
        }

        $(document).on('click',"#check a", function() {
            var href = $(this).attr('href');
            toCache("indexHref", href);
            $(this).parent().parent().children().find('a').css("color","inherit");
            changeChosen(this);
        })

        $(document).on('click',"#helloNickName", function() {;
            $("#check a").css("color","inherit");
        })

        var sharePagesArray = getSharePagesArray();
        var href = "share.html";
        if(ifShareUser()){
            $("a[value='0']").parent().hide();
            //$("#firstLine,#forthLine").hide();
            $("#helloNickName").removeAttr('href');
            if(!ifShare('1')){
                $("a[value='1']").parent().hide();
            } else {
                href = "mission.html";
            }
            if(!ifShare('2')){
                $("a[value='2']").parent().hide();
            } else {
                href = "note.html";
            }
            if(!ifShare('3')){
                $("a[value='3'],a[value='4'],a[value='5']").parent().hide();
//                $("#secondLine").hide();
            } else {
                href = "finance.html";
            }
            if(!ifShare('4')){
                $("a[value='6'],a[value='7'],a[value='8']").parent().hide();
//                $("#thirdLine").hide();
            } else {
                href = "productOutput.html";
            }
            if(!ifShare('5')){
                $("a[value='9'],a[value='10'],a[value='11'],a[value='12'],a[value='13']").parent().hide();
//                $("#thirdLine,#forthLine").hide();
            } else {
                href = "goodsTrade.html";
            }
        } else {
             var indexHref = getCache("indexHref");
             if(indexHref != null) {
                href = indexHref;
             } else {
                 var homePage = getHomePage();
                 if (homePage == 1) {
                     href = "mission.html";
                 } else if (homePage == 2) {
                     href = "note.html";
                 } else if (homePage == 3) {
                     href = "finance.html";
                 } else if (homePage == 4) {
                     href = "productOutput.html";
                 } else if (homePage == 5) {
                     href = "goodsTrade.html";
                 }
             }
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
    });

    function changeChosen(obj) {
        $(obj).css('color','#006400').css('font-weight','bold');
    }
