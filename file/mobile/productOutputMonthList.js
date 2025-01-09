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
            $("#self").text("退出");
        }
        getProductSelect();
        toSumRecent2MonthProductOutput();
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

        $("#productUuid").on("change",function () {
            emptyList();
            getList();
        });

        $("#monthStart, #monthEnd").on("change",function () {
            emptyList();
            getList();
        });

        $("#search").submit(function(event) {
            event.preventDefault();
            emptyList();
            getList();
        });

        $("#toListPage").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor("product"));
            toCache(LIST.HEADER_TYPE, "product");
            location.href = "list.html";
        });

         $("#productList").on('click', function(event) {
             $(this).addClass("active").css("background-color", getBackgroundColor("product"));
             location.href = "productList.html";
         });

        $("#close").on('click', function(event) {
            $("#viewClassifiedDiv").hide();
            $("#gridDiv").empty();
            $("#main").show();
        });

         $("#self").on('click', function(event) {
              $(this).addClass("active").css("background-color", getBackgroundColor("product"));
              if(ifShareUser()){
                 logout();
              } else {
                 self();
              }
         });

    });

    function emptyList(){
        $("#list ul").empty();
        currentPage = 1;
        totalPage = null;;
        minId = null;
        prePosition = null;
    }

    function toTop(){
        $('html, body').animate({scrollTop: 0}, 'fast');
    }

    function getParams(){
        var params = $("#search").serialize() + "&pageNo=1&pageSize=" + pageSize;
        if(minId != null){
            params += "&preMinId=" + minId;
        }
        return params;
    }

    function getList() {
        $("#bottom-message").hide();
        $.mobile.loading("show");
        var productUuid = $("#productUuid").val();
        if(productUuid == null || productUuid == ''){
            $("#sum").hide();
        } else {
            $("#sum").show();
            getSum();
        }
        $.ajax({
            url: outputMonthHost + "/list",
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
                    let productOutputMonth = list[i];
                    var row = getOneRow(productOutputMonth);
                    if($("#list ul").children().length == 0){
                        $("#list ul").append(row);
                    } else {
                        $('#list ul li:last-child').after(row);
                    }
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

    function getOneRow(productOutputMonth){
        var id = productOutputMonth['id'];
        var productUuid = productOutputMonth['productUuid'];
        var productName = productOutputMonth['productName'];
        var productCode = productOutputMonth['productCode'] == null ? "" : productOutputMonth['productCode'];
        if(productCode != ''){
            productCode = "(" + productCode + ")";
        }
        var month = productOutputMonth['month'];
        var number = productOutputMonth['number'];
        var unitValue = productOutputMonth['unitValue'];
        var updateTimeStr = productOutputMonth['updateTimeStr'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:#B4EEB4;border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+month+"</h6>"
                       + "<p>"+productName+productCode+"</p>"
                       + "<div class='row'>"
                                 + "<div class='col-left'>"
                                     + "<p>"+number + unitValue+"</p>"
                                 + "</div> "
                       + "</div> "
                       + "<div class='row'>"
                            + "<div class='col-left'>"
                                + "<p class='time'>汇总时间 : "+updateTimeStr+"</p>"
                            + "</div> "
                            + "<div class='col-right'>"
                                + "<a class='ui-btn ui-corner-all ui-icon-refresh ui-btn-icon-notext' onclick='toSum(\""+id+"\",\""+month+"\",\""+productUuid+"\")' style='color:blue'>重新汇总</a>"
                            + "</div> "
                       + "</div> "
                + "</li>";
        return row;
    }

     function updateOrRemove(id, month, productUuid){
         $.ajax({
             url: outputMonthHost + "/get/month",
          method: 'GET',
            data: "month="+month+ "&productUuid="+productUuid,
         success: function(obj) {
             $.mobile.loading("hide");
             var $oldRow = $("#li_"+id+"");
             var length = $oldRow.length; //add or update
             var row;
             if (obj.code == 1) {
                 let object = obj.data;
                 row = getOneRow(object)
                 if(length == 1){
                     $oldRow.after(row);
                     $oldRow.remove();
                 }
             } else {
                 if(length == 1){
                     $oldRow.remove();
                 }
             }
           }
         });
     }

    function toSum(id, month, productUuid){
        var params = "productUuid="+productUuid+ "&month="+month;
        $.mobile.loading("show");
        $.ajax({
            url: outputMonthHost + "/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
//                getSum();
                if (obj.code != 1) {
                    return;
                }
                updateOrRemove(id, month, productUuid);
            }
        });
    }

     function getSum() {
        var params = $("#search").serialize();
        $.ajax({
            url: financeMonthHost + "/get/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
                var sumIncomeAmountValue = obj.data.sumIncomeAmountValue;
                if (sumIncomeAmountValue != 0) {
                    sumIncomeAmountValue = "<a href='javascript:void(0)' title='点击查看详细' onclick='getClassifiedSum(1)'>"+sumIncomeAmountValue+"</a>";
                }
                $("#sumIncomeAmountValue").html(sumIncomeAmountValue);
                var sumPayAmountValue = obj.data.sumPayAmountValue;
                if (sumPayAmountValue != 0) {
                    sumPayAmountValue = "<a href='javascript:void(0)' title='点击查看详细' onclick='getClassifiedSum(0)'>"+sumPayAmountValue+"</a>";
                }
                $("#sumPayAmountValue").html(sumPayAmountValue);

                $("#sumMarginValue").html(obj.data.sumMarginValue);
            }
        });
     }


    function getProductSelect(){
        $("#productUuid").empty().selectmenu('refresh');
        var arr = getTheProductSelect();
        if(arr == null){
            return;
        }
        $.each(arr, function(index, object){
            if(index == 0){
                $("#productUuid").append("<option value='' selected></option>");
            }
            $("#productUuid").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
        });
    }

      function getSum() {
         var params = $("#search").serialize();
         $.ajax({
             url: outputMonthHost + "/get/sum",
             method: 'GET',
             data: params,
             success: function(obj) {
                 $("#sumNumber").html(obj.data.sumNumber + obj.data.unitValue);
             }
         });
      }
