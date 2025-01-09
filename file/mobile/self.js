
    $(document).ready(function() {

        ifToLoginByLocalToken();
        var lastLoginDate = timestampToDate(getLastLoginDate());
        if(lastLoginDate != ""){
            $("#lastLoginDate").html("上次登录时间 : " + lastLoginDate);
        }
        var nickName = getNickName();
        $("#helloNickName").html(nickName);
        var avatar = DEFAULT_IMG_BASE64;
        if(ifShareUser()){
            $("#avatar").attr("src", avatar);
        } else {
            var myAvatar = getAvatar();
            if(myAvatar != null){
                avatar = myAvatar;
            }
            $("#avatar").attr("src", avatar);

        }

        $("#myShareUser").on('click', function(event) {
            location.href = "shareUserList.html";
        });

        $("#logout").on('click', function(event) {
            logout();
        });

        $("#avatar").on('click', function(event) {
            location.href = "setting.html";
        });

        $("#avatar").on('click', function(event) {
            location.href = "setting.html";
        });

        $("#toSharePage").on('click', function(event) {
           $(this).addClass("active").css("background-color", commonFootBackgroundColor);
           location.href = "shareAreaList.html";
        });

        $("#toListPage").on('click', function(event) {
            $(this).addClass("active").css("background-color", commonFootBackgroundColor);
            toListPage();
        });

        getMissionCount();
        getNoteCount();
        getFinanceCount();
        getProductOutputCount();
        getTradeGoodsCount();
        getShareUserCount();
    });

    function getTradeGoodsCount(){
         var total = getCache("tradeGoodsTotal");
         if(total != null){
             $("#goods").text(total + "笔");
             return;
         }
         $.ajax({
             url: tradeGoodsHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("tradeGoodsTotal", total);
                    $("#goods").text(total + "笔");
                }
             }
         });
    }

    function getProductOutputCount(){
         var total = getCache("productOutputTotal");
         if(total != null){
             $("#product").text(total + "笔");
              return;
         }
         $.ajax({
             url: outputHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("productOutputTotal", total);
                    $("#product").text(total + "笔");
                }
             }
         });
    }

    function getFinanceCount(){
         var total = getCache("financeTotal");
         if(total != null){
             $("#finance").text(total + "笔");
              return;
         }
         $.ajax({
             url: financeHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("financeTotal", total);
                    $("#finance").text(total + "笔");
                }
             }
         });
    }

    function getNoteCount(){
         var total = getCache("noteTotal");
         if(total != null){
             $("#note").text(total + "篇");
              return;
         }
         $.ajax({
             url: noteHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("noteTotal", total);
                    $("#note").text(total + "篇");
                }
             }
         });
    }

    function getMissionCount(){
         var total = getCache("missionTotal");
         if(total != null){
             $("#mission").text(total + "条");
              return;
         }
         $.ajax({
             url: missionHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("missionTotal", total);
                    $("#mission").text(total + "条");
                }
             }
         });
    }

    function getShareUserCount(){
         var total = getCache("shareUserTotal");
         if(total != null){
             $("#myShareUser").text("我的分享账号(" + total + "个)");
              return;
         }
         $.ajax({
             url: shareUserHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("shareUserTotal", total);
                    $("#myShareUser").text("我的分享账号(" + total + "个)");
                }
             }
         });
    }