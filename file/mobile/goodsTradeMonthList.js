    var currentPage = 1;
    var totalPage;
    var minId = null;
    var loading = false;
    var openScroll = true;
    var prePosition = null;
    $(document).ready(function() {

        ifToLoginByLocalToken();
        if(ifShareUser()){
            $("#self").text("退出");
        }
        toSumRecent2MonthGoodsTrade();
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


        $("#tradeMonthStart, #tradeMonthEnd").on("keydown", function(event) {
            if (event.keyCode === 13) {
                emptyList();
                getList();
            }
        });

        $("#tradeMonthStart, #tradeMonthEnd").on("change",function () {
            emptyList();
            getList();
        });

        $("#search").submit(function(event) {
            event.preventDefault();
            emptyList();
            getList();;
        });

        $("#toListPage").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor("goods"));
            toCache(LIST.HEADER_TYPE, "goods");
            location.href = "list.html";
        });

        $("#goodsList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor("goods"));
            location.href = "goodsList.html";
        });

        $("#goodsSupplierList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor("goods"));
            location.href = "goodsSupplierList.html";
        });

        $("#close").on('click', function(event) {
            $("#viewClassifiedDiv").hide();
            $("#gridDiv").empty();
            $("#main").show();
        });

        $("#self").on('click', function(event) {
             $(this).addClass("active").css("background-color", getBackgroundColor("goods"));
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
        $.ajax({
            url: tradeMonthGoodsHost + "/list",
            method: 'GET',
            data: getParams(),
            success: function(obj) {
                getSum();
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

    function getOneRow(object){
        var id = object['id'];
        var tradeMonth = object['month'];
        var incomeAmountValue = object['incomeAmountValue'];
        var incomeIcon = "";
        if(incomeAmountValue != 0){
             incomeIcon = "<div class='col-right'>"
                                + "<a class='ui-btn ui-corner-all ui-icon-grid ui-btn-icon-notext' onclick='getClassified(\""+tradeMonth+"\",1)'> style='background-color: #7FFFD4;'></a>"
                          + "</div> ";
         }
        incomeAmountValue = "销售 : " + incomeAmountValue + "元";
        var payAmountValue = object['payAmountValue'];
        var payIcon = "";
        if(payAmountValue != 0){
             payIcon = "<div class='col-right'>"
                            + "<a class='ui-btn ui-corner-all ui-icon-grid ui-btn-icon-notext' onclick='getClassified(\""+tradeMonth+"\",0)'> style='background-color: #7FFFD4;'></a>"
                        + "</div> ";
         }
        payAmountValue = "进货 : " + payAmountValue + "元";
        var marginValue = "毛利 : " + object['marginValue'] + "元";
        var updateTimeStr = object['updateTimeStr'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:#B4CDCD;border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+tradeMonth+"</h6>"
                        + "<div class='row'>"
                                 + "<div class='col-left'>"
                                     + "<p>"+incomeAmountValue+"</p>"
                                 + "</div> "
                                 + incomeIcon
                        + "</div> "
                        + "<div class='row'>"
                                 + "<div class='col-left'>"
                                     + "<p>"+payAmountValue+"</p>"
                                 + "</div> "
                                 + payIcon
                        + "</div> "
                       + "<p>"+marginValue+"</p>"
                       + "<div class='row'>"
                            + "<div class='col-left'>"
                                + "<p class='time'>汇总时间 : "+updateTimeStr+"</p>"
                            + "</div> "
                            + "<div class='col-right'>"
                                + "<a class='ui-btn ui-corner-all ui-icon-refresh ui-btn-icon-notext' onclick='toSum(\""+id+"\",\""+tradeMonth+"\")' style='color:blue'>重新汇总</a>"
                            + "</div> "
                       + "</div> "
                + "</li>";
        return row;
    }

     function updateOrRemove(id, month){
         $.ajax({
             url: tradeMonthGoodsHost + "/get/month",
          method: 'GET',
            data: "month="+month,
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

    function toSum(id, month){
        var params = "month="+month;
        $.mobile.loading("show");
        $.ajax({
            url: tradeMonthGoodsHost + "/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
                getSum();
                if (obj.code != 1) {
                    return;
                }
                updateOrRemove(id, month);
            }
        });
    }

     function getClassifiedSum(flowType) {
        var params = $("#search").serialize();
        $.mobile.loading("show");
        $.ajax({
            url: tradeMonthGoodsHost + "/classified/list/sum",
            method: 'GET',
            data: params + "&flowType="+flowType,
            success: function(obj) {
                $.mobile.loading("hide");
                getSum ();
                var flowTypeValue;
                if(flowType == 0){
                    flowTypeValue = '(进货)';
                } else {
                    flowTypeValue = '(销售)';
                }

                desc = getDescByTradeMonth() + flowTypeValue;
                showSum(obj,desc);
            }
        });
     }

    function getClassified(tradeMonth, flowType) {
         var params = $("#search").serialize();
         $.mobile.loading("show");
         $.ajax({
              url: tradeMonthGoodsHost + "/classified/list?month="+tradeMonth+"&flowType="+flowType,
           method: 'GET',
          success: function(obj) {
                 $.mobile.loading("hide");
                 if (obj.code == NO_DATA.CODE) {
                    return;
                 }
                 var flowTypeValue;
                 if(flowType == 0){
                     flowTypeValue = '(进货)';
                 } else {
                     flowTypeValue = '(销售)';
                 }

                 desc = tradeMonth + flowTypeValue;
                 showSum(obj, desc);
             }
         });
    }

     function showSum(obj, desc){
        if (obj.code != 1) {
            return;
        }
        $("#main").hide();
        $("#viewClassifiedDiv").show();
        var data = obj.data.typeValueList;
        var sumAmountValue = obj.data.sumAmountValue;
        $("#popupHeader").html(desc);
        $("#gridDiv").empty();
        $.each(data, function(index, object){
            var row;
            if(index == 0){
                row = "<div class='ui-grid-b' style='display: flex;white-space: nowrap;'>"
                          + "<div class='ui-block-a' style='width: 35%;flex-grow: 1;white-space: nowrap;'><div class='ui-bar' style='color:green;font-weight:bold;'>商品</div></div>"
                          + "<div class='ui-block-a' style='width: 37%;flex-grow: 1;white-space: nowrap;'><div class='ui-bar' style='color:green;font-weight:bold;'>金额(元)</div></div>"
                          + "<div class='ui-block-a' style='width: 28%;flex-grow: 1;white-space: nowrap;'><div class='ui-bar' style='color:green;font-weight:bold;'>占比(%)</div></div>"
                     + "</div>";
                $("#gridDiv").append(row);
            }

            row = "<div class='ui-grid-b' style='display: flex'>"
                      + "<div class='ui-block-a' style='width: 35%;flex-grow: 1;'><div class='ui-bar'>"+object['typeValue']+"</div></div>"
                      + "<div class='ui-block-a' style='width: 37%;flex-grow: 1;'><div class='ui-bar'>"+object['amountValue']+"</div></div>"
                      + "<div class='ui-block-a' style='width: 28%;flex-grow: 1;'><div class='ui-bar'>"+object['percent']+"</div></div>"
                 + "</div>";
            $("#gridDiv").append(row);
            if(index == data.length-1){
                 row = "<div class='ui-grid-b' style='display: flex'>"
                               + "<div class='ui-block-a' style='width: 35%;flex-grow: 1;'><div class='ui-bar' style='color:#B22222;font-weight:bold;'>总计</div></div>"
                               + "<div class='ui-block-a' style='width: 65%;flex-grow: 1;'><div class='ui-bar' style='color:#B22222;font-weight:bold;'>"+sumAmountValue+"</div></div>"
                     + "</div>";
                $("#gridDiv").append(row);
            }
        });
     }

     function getDescByTradeMonth(){
        var desc = '全部';
        var tradeMonthStart = $('#tradeMonthStart').val();
        var tradeMonthEnd = $('#tradeMonthEnd').val();
        if (tradeMonthStart != '') {
            if (tradeMonthEnd != '') {
                desc = tradeMonthStart + '~' + tradeMonthEnd;
                if (tradeMonthStart == tradeMonthEnd) {
                    desc = tradeMonthStart;
                }
            } else {
                desc = tradeMonthStart + '至今';
            }
        } else {
            if (tradeMonthEnd != '') {
                desc = tradeMonthEnd + "之前";
            }
        }
        return desc;
     }

     function getSum() {
        var params = $("#search").serialize();
        $.ajax({
            url: tradeMonthGoodsHost + "/get/sum",
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