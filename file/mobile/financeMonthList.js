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
        toSumRecent2MonthFinance();
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
            if (event.keyCode === 13) { // keyCode为13表示按下Enter键
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
            $(this).addClass("active").css("background-color", getBackgroundColor("finance"));
            toCache(LIST.HEADER_TYPE, "finance");
            location.href = "list.html";
        });

         $("#financeTransactionList").on('click', function(event) {
             $(this).addClass("active").css("background-color", getBackgroundColor("finance"));
             location.href = "financeTransactionList.html";
         });

        $("#close").on('click', function(event) {
            openScroll = true;
            $("#viewClassifiedDiv").hide();
            $("#gridDiv").empty();
            $("#dataListPage").show();
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
        totalPage = null;
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
        hideBottomNoMessage();
        $.mobile.loading("show");
        $.ajax({
            url: financeMonthHost + "/list",
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
                    let finance = list[i];
                    var row = getOneRow(finance);
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

    function getOneRow(finance){
        var id = finance['id'];
        var tradeMonth = finance['tradeMonth'];
        var incomeAmountValue = finance['incomeAmountValue'];
        var incomeIcon = "";
        if(incomeAmountValue != 0){
             incomeIcon = "<div class='col-right'>"
                                + "<a class='ui-btn ui-corner-all ui-icon-grid ui-btn-icon-notext' onclick='getClassified(\""+tradeMonth+"\",1)'> style='background-color: #7FFFD4;'></a>"
                          + "</div> ";
         }
        incomeAmountValue = "收入 : " + incomeAmountValue + "元";
        var payAmountValue = finance['payAmountValue'];
        var payIcon = "";
        if(payAmountValue != 0){
             payIcon = "<div class='col-right'>"
                            + "<a class='ui-btn ui-corner-all ui-icon-grid ui-btn-icon-notext' onclick='getClassified(\""+tradeMonth+"\",0)'> style='background-color: #7FFFD4;'></a>"
                        + "</div> ";
         }
        payAmountValue = "支出 : " + payAmountValue + "元";
        var marginValue = "差额 : " + finance['marginValue'] + "元";
        var updateTimeStr = finance['updateTimeStr'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:#EEEED1;border-radius: 0.5em;padding: 0.5em;'>"
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

     function updateOrRemove(id, tradeMonth){
         $.ajax({
             url: financeMonthHost + "/get/month",
          method: 'GET',
            data: "tradeMonth="+tradeMonth,
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

    function toSum(id, tradeMonth){
        var params = "tradeMonth="+tradeMonth;
        $.mobile.loading("show");
        $.ajax({
            url: financeMonthHost + "/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
                getSum();
                if (obj.code != 1) {
                    return;
                }
                updateOrRemove(id, tradeMonth);
            }
        });
    }

     function getClassifiedSum(flowType) {
        $("#close").show();
        openScroll = false;
        var params = $("#search").serialize();
        $.mobile.loading("show");
        $.ajax({
            url: financeMonthHost + "/classified/list/sum",
            method: 'GET',
            data: params + "&flowType="+flowType,
            success: function(obj) {
                $.mobile.loading("hide");
                getSum ();
                var flowTypeValue;
                if(flowType == 0){
                    flowTypeValue = '(支出)';
                } else {
                    flowTypeValue = '(收入)';
                }

                desc = getDescByTradeMonth() + flowTypeValue;
                showSum(obj,desc);
            }
        });
     }

    function getClassified(tradeMonth, flowType) {
        $("#close").show();
        openScroll = false;
         var params = $("#search").serialize();
         $.mobile.loading("show");
         $.ajax({
            url: financeMonthHost + "/classified/list?tradeMonth="+tradeMonth+"&flowType="+flowType,
             method: 'GET',
             success: function(obj) {
                 $.mobile.loading("hide");
                 if (obj.code == NO_DATA.CODE) {
                    return;
                 }
                 var flowTypeValue;
                 if(flowType == 0){
                     flowTypeValue = '(支出)';
                 } else {
                     flowTypeValue = '(收入)';
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
        $("#dataListPage").hide();
        $("#viewClassifiedDiv").show();
        var data = obj.data.typeValueList;
        var sumAmountValue = obj.data.sumAmountValue;
        $("#popupHeader").html(desc);
        $("#gridDiv").empty();
        $.each(data, function(index, object){
            var row;
            if(index == 0){
                row = "<div class='ui-grid-b' style='display: flex;white-space: nowrap;'>"
                          + "<div class='ui-block-a' style='width: 35%;flex-grow: 1;white-space: nowrap;'><div class='ui-bar' style='color:green;font-weight:bold;'>交易类型</div></div>"
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