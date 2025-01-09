    var currentPage = 1;
    var totalPage;
    var minId = null;
    var loading = false;
    var openScroll = true;
    var prePosition = null;
    $(document).ready(function() {

        var userName = getUserName();
        if("admin" == userName || "Achilles" == userName){
            $("#addBtn").show();
        } else {
            $("#addBtn").hide();
        }

        ifToLoginByLocalToken();

        getList();

//		$(document).on("scrollstart", function(){
//			$("#bottom-message").hide();
//		});

        $("#scrollTopBtn").on('click', function() {
            toTop();
        });

        $(document).on("scrollstop", function (event) {
            event.preventDefault();
            if(!openScroll){
                return;
            }
            var position = $(window).scrollTop();
            hideOrShowToTop(position);
            if(currentPage == totalPage){
                showBottomNoMessage();
                return;
            }
            if(prePosition == null){
                prePosition = position;
            } else {
                if(prePosition > position){ // when go back, do nothing
                    return;
                }
                prePosition = position;
            }

            var windowHeight = $(window).height();
            var documentHeight = $(document).height();
            if (!loading && currentPage < totalPage && position + windowHeight >= documentHeight - 400) {
                  currentPage++;
                  loading = true;
                  getList();
            }
        });

        $(document).on("pagebeforeshow", "#dataListPage", function() {
            openScroll = true;
            var id = getCache('id');
            if(id != null){
                 updateOrRemove(id);
                 removeCache("id");
            }
            resetForm();
        });

        $("#toListPage").on('click', function(event) {
            $(this).addClass("active").css("background-color", commonFootBackgroundColor);
            location.href = "list.html";
        });

        $("#self").on('click', function(event) {
            $(this).addClass("active").css("background-color", commonFootBackgroundColor);
            self();
        });
    });

     $(document).on("pagecontainershow", function(event, ui) {
        if (ui.toPage.attr("id") === "dataListPage") {
             toTop();
        }
     });

    function updateOrRemove(id){
        var params = "pageNo=1&pageSize="+pageSize;
        params += "&id=" + id;
        $.ajax({
            url: shareHost + "/list",
            method: 'GET',
            data: params,
            async: false,
            success: function(obj) {
                if (obj.code == 1 && obj.data.count != 0) {
                    var list = obj.data.list;
                    let share = list[0];
                    var row = getOneShareRow(share);
                    $("#list").prepend(row);
                }
            }
        });
    }

    function emptyList(){
        $("#list").empty();
        currentPage = 1;
        totalPage = null;
        minId = null;
        prePosition = null;
    }

    function getList() {
        var pageSize = 5;
        var params = "pageNo=1&pageSize="+pageSize;
        if(minId != null){
            params += "&preMinId=" + minId;
        }
        $.mobile.loading("show");
        $.ajax({
            url: shareHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                if (obj.code != 1 || obj.data.count == 0) {
                    showBottomNoMessage();
                    return;
                }
                var count = obj.data.count;
                var total = obj.data.total;
                minId = obj.data.minId;
                totalPage = total % pageSize == 0 ? (total / pageSize) : (Math.floor(total / pageSize) + 1);
                var list = obj.data.list;
                for (let i = 0; i < count; i++) {
                   let share = list[i];
                   var row = getOneShareRow(share);
                   appendRow(row);
                }
            },
            complete: function() {
                loading = false;
                $.mobile.loading("hide");
                if(currentPage == 1 && totalPage == 1){
                     showBottomNoMessage();
                }
            }
        });
    }

    function getOneShareRow(share){
        var id = share['id'];
        var uuid = share['uuid'];
        var content = share['content'];
        var nickName = share['nickName'];
        var avatarUrl = share['avatarUrl'];
        if(avatarUrl == null || avatarUrl == ""){
            avatarUrl = DEFAULT_IMG_BASE64;
        }
        var imgUrl = share['imgUrl'];
        var createTimeStr = share['createTimeStr'];
        var imgDiv = '';
        var imgUrl = share['imgUrl'];
        if(imgUrl != null){
             imgDiv = "<img src='"+imgUrl+"' class='post-image'>";
        }
        var isAuthor = share['isAuthor'];
        var deleteDiv = '';
        if(isAuthor == 1) {
            nickName = '我';
            deleteDiv = "<div class='deleteIcon' onclick=deleteOne('"+id+"')>❌</div>";
        }

        var row = "<div id='"+id+"' class='post'>"
                      + "<div class='user-info'>"
                         + "<img src='"+avatarUrl+"'>"
                         + "<span>"+nickName+"</span>"
                      + "</div>"
                      + "<div class='content'>"
                           + "<p>"+content+"</p>"
                           + imgDiv
                      + "</div>"
                      + "<div class='time-delete'>"
                           + "<div class='time'>"+createTimeStr+"</div>"
                           + deleteDiv
                      + "</div>"
                  + "</div>";
        return row;
    }

    function appendRow(row){
        if($("#list").children().length == 0){
            $("#list").append(row);
        } else {
            $('.post').last().after(row);
        }
    }

    function deleteOne(id){
       customConfirm("您确定删除吗 !",
                function() {
                    $.ajax({
                        url: shareHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code == 109) {
                                openAlert("该交易类型存在业务数据，无法删除 !");
                                return;
                            }
                            if (obj.code != 1) {
                                openAlert("删除失败 !");
                                return;
                            }
                            var childNum = $("#list").children().length;
                            $('#'+id).remove();
                            if(childNum == 1){
                                getList();
                            }
                        }
                    });
                },
                function() {return;}
        )
    }