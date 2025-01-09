    var currentPage = 1;
    var totalPage;
    var minId = null;
    var loading = false;
    var openScroll = true;
    var prePosition = null;
    $(document).ready(function() {

        ifToLoginByLocalToken();
        getList();

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

        $("#keyWords").on("keydown", function(event) {
            if (event.keyCode === 13) {
                emptyList();
                getList();
            }
        });

        $("#keyWords").blur(function() {
            emptyList();
            getList();
        });

        $("#toListPage").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor("note"));
            toCache(LIST.HEADER_TYPE, "note");
            location.href = "list.html";
        });

        $("#self").on('click', function(event) {
             $(this).addClass("active").css("background-color", getBackgroundColor("product"));
            self();
        });

        $("#cleanRecycle").on('click', function(event) {
           customConfirm("您确认清空回收站吗 ?",
                function() {
                    $.ajax({
                        url: noteHost + "/recycle/clean",
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code != 1) {
                                openAlert("失败 !");
                                return;
                            }
                            emptyList();
                            $("#cleanRecycle").hide();
                        }
                    });
                },
                function() {return;}
            )
        });
    });

    function emptyList(){
        $("#list ul").empty();
        currentPage = 1;
        totalPage = null;;
        minId = null;
        prePosition = null;
    }

    function getParams(){
        var params = $("#search").serialize() + "&pageNo=1&pageSize=" + pageSize;
        if(minId != null){
            params += "&preMinId=" + minId;
        }
        return params;
    }

    function getList() {
        $.mobile.loading("show");
        $.ajax({
            url: noteHost + "/recycle/list",
            method: 'GET',
            data: getParams(),
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
                    let object = list[i];
                    var row = getOneRow(object);
                    appendRow(row);
                }
            },
            complete: function() {
                loading = false;
                $.mobile.loading("hide");
                showBottomNoMessage();
                  if($("#list ul").children().length == 0){
                    $("#cleanRecycle").hide();
                  } else {
                    $("#cleanRecycle").show();
                  }
            }
        });
    }

     function appendRow(row){
         if($("#list ul").children().length == 0){
             $("#list ul").append(row);
         } else {
             $('#list ul li:last-child').after(row);
         }
     }

    function getOneRow(object){
        var id = object['id'];
        var title = object['title'];
        var typeValue = object['typeValue'];
        var content = object['content'] == null ? '' : object['content'];
        var createTimeStr = object['createTimeStr'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:#CFCFCF;border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+title+"</h6>"
                       + "<p>"+content+"</p>"
                       + "<p style='font-weight:bold'>"+typeValue+"</p>"
                       + "<div class='row'>"
                                + "<div class='col-left'>"
                                    + "<p class='time'>"+createTimeStr+"</p>"
                                + "</div> "
                                + "<div class='col-right'>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-recycle ui-btn-icon-notext'  onclick=recycleOne("+id+") style='background-color: #CFCFCF;'></a>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext' id='delete_"+id+"' onclick=deleteOne("+id+") style='background-color: #CFCFCF;'>删除</a>"
                                + "</div> "
                       + "</div> "
                + "</li>";
        return row;
    }

    function recycleOne(id){
       customConfirm("您确认还原吗 !",
                function() {
                    $.ajax({
                        url: noteHost + "/recycle/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code != 1) {
                                openAlert("失败 !");
                                return;
                            }
                            removeCache("noteTotal");
                            var childNum = $('a#delete_'+id).closest('ul').children().length;
                            $('a#delete_'+id).closest('li').remove();
                            if(childNum == 1){
                                getList();
                            }
                        }
                    });
                },
                function() {return;}
        )
    }

    function deleteOne(id){
       customConfirm("您确定彻底删除吗 !",
                function() {
                    $.ajax({
                        url: noteHost + "/recycle/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code != 1) {
                                openAlert("删除失败 !");
                                return;
                            }
                            removeCache("noteTotal");
                            var childNum = $('a#delete_'+id).closest('ul').children().length;
                            $('a#delete_'+id).closest('li').remove();
                            if(childNum == 1){
                                getList();
                            }
                        }
                    });
                },
                function() {return;}
        )
    }