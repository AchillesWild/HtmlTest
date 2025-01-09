    var currentPage = 1;
    var totalPage;
    var minId = null;
    var loading = false;
    var openScroll = true;
    var prePosition = null;
    var operate;

    $(document).ready(function() {

        ifToLoginByLocalToken();
        if(ifShareUser()){
            hideAddBtn();
            $("#self").text("退出");
        }

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

        $("#search").submit(function(event) {
            event.preventDefault();
            emptyList();
            getList();;
        });

        $("#toListPage").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor("product"));
            toCache(LIST.HEADER_TYPE, "product");
            location.href = "list.html";
        });

        $("#productOutputMonthList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor("product"));
            location.href = "productOutputMonthList.html";
        });

        $("#self").on('click', function(event) {
             $(this).addClass("active").css("background-color", getBackgroundColor("product"));
             if(ifShareUser()){
                logout();
             } else {
                self();
             }
        });

        $(document).on("click", "#detail", function() {
            var id = $(this).data('id');
            toCache('id', id);
        });

        $(document).on("pagebeforeshow", "#dataListPage", function() {
            hideUploadArea();
            openScroll = true;
            var id = getCache('id');
            if(id != null){
                 var justUpdated = getCache('justUpdated');
                 if(justUpdated == 1){
                    removeCache("justUpdated");
                    updateOrRemove(id);
                 }
                 removeCache("id");
            }
            removeImg();
            $('.updateForm')[0].reset();
        });
    });

     $(document).on("pagecontainershow", function(event, ui) {
        if (ui.toPage.attr("id") == "dataListPage" && operate == "add") {
             operate = null;
             toTop();
        }
     });

     function updateOrRemove(id){
        var params = $("#search").serialize() + "&pageNo=1&pageSize=1&id=" + id;
         $.ajax({
             url: productHost + "/list",
             method: 'GET',
             data: params,
             async: false,
             success: function(obj) {
                 var $oldRow = $("#li_"+id+"");
                 var length = $oldRow.length; //add or update
                 if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                    if(length == 1){
                        $oldRow.remove();
                    } else {
                        location.href = "productList.html";
                    }
                    return;
                 }
                 var list = obj.data.list;
                 let object = list[0];
                 var row = getOneRow(object)
                 if(length == 1){
                     $oldRow.after(row);
                     $oldRow.remove();
                 } else {
                     operate = "add";
                     $("#list ul").prepend(row);
                 }
             }
         });
     }

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
            url: productHost + "/list",
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
                if(ifShareUser()){
                    hideUpdateBtn();
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

    function getOneRow(object){
        var id = object['id'];
        var name = object['name'];
        var code = object['code'] == null ? "" : object['code'];
        if(code != ""){
            code = "<p>"+code+"</p>";
        }
        var unitValue = object['unitValue'];
        var createTimeStr = object['createTimeStr'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:#B4EEB4;border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+name+"</h6>"
                       + code
                       + "<p>"+unitValue+"</p>"
                       + "<div class='row'>"
                                + "<div class='col-left'>"
                                    + "<p class='time'>"+createTimeStr+"</p>"
                                + "</div> "
                                + "<div class='col-right'>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-eye ui-btn-icon-notext' id='detail' href='#getOrUpdate' data-id='"+id+"' style='background-color: #7FFFD4;'></a>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext' id='delete_"+id+"' onclick=deleteOne("+id+") style='background-color: #F4A460;'>删除</a>"
                                + "</div> "
                       + "</div> "
                + "</li>";
        return row;
    }

    function appendRow(row){
        if($("#list ul").children().length == 0){
            $("#list ul").append(row);
        } else {
            $('#list ul li:last-child').after(row);
        }
    }

    function deleteOne(id){
       customConfirm("您确定删除吗 !",
                function() {
                    $.ajax({
                        url: productHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code == HAS_RELATED_DATA) {
                                openAlert(PRODUCT_HAS_RELATED_DATA);
                                return;
                            }
                            if (obj.code != 1) {
                                openAlert("删除失败 !");
                                return;
                            }
                            removeProductCache();
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