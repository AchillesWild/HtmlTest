
    let currentPage = 1;

    $(document).ready(function() {

        toSumRecent2 ();

        $("#searchBtn").on('click', function(event) {
            event.preventDefault();
            fetchData(currentPage);
        });

        $("#searchReset").on('click', function(event) {
            $('#search')[0].reset();
            currentPage = 1;
        });

        $(document).on('click', '.page-link', function() {
            let pageNumber = $(this).data('page');
            currentPage = pageNumber;
            fetchData(currentPage);
        });
    });

    function toSum(tradeMonth){
        $(this).attr('disabled',"disabled");
        var params = "tradeMonth="+tradeMonth;
        $.ajax({
            url: financeMonthHost + "/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
                if (obj.code != 1) {
                    alert(obj.message);
                    return;
                }
                fetchData(currentPage);
            }
        });
    }

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        var params = $("#search").serialize() + "&pageNo="+currentPage+ "&pageSize="+pageSize;
        $.ajax({
            url: financeMonthHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                loadingGifFadeOut();
                getSum ();
                $("#tableBody").empty();
                $("#pagination").empty();
                if (obj.code != 1 || obj.data.count == 0) {
                    return;
                }
                var count = obj.data.count;
                var total = obj.data.total;
                var totalPage = total % pageSize == 0 ? (total / pageSize) : (Math.floor(total / pageSize) + 1);
                var list = obj.data.list;
                var num = (currentPage - 1) * pageSize;
                for (let i = 0; i < count; i++) {
                    num++;
                    let finance = list[i];
                    var id = finance['id'];
                    var tradeMonth = finance['tradeMonth'];
                    var incomeAmountValue = finance['incomeAmountValue'];
                    if (incomeAmountValue != 0) {
                        incomeAmountValue = "<a href='javascript:void(0)' title='点击查看详细' onclick='getClassified(\""+tradeMonth+"\",1)'>"+incomeAmountValue+"</a>";
                    }
                    var payAmountValue = finance['payAmountValue'];
                    if (payAmountValue != 0) {
                        payAmountValue = "<a href='javascript:void(0)' title='点击查看详细' onclick='getClassified(\""+tradeMonth+"\",0)'>"+payAmountValue+"</a>";
                    }
                    var marginValue = finance['marginValue'];
                    var updateTimeStr = finance['updateTimeStr'];
                    var bgColor;
                    if (i % 2 == 0) {
                         bgColor = '#DCDCDC';
                    } else {
                         bgColor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgColor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+tradeMonth+"</td>"
                                   + "<td>"+incomeAmountValue+"</td>"
                                   + "<td>"+payAmountValue+"</td>"
                                   + "<td>"+marginValue+"</td>"
                                   + "<td>"+updateTimeStr+"</td>"
                                   + "<td><button onclick='toSum(\""+tradeMonth+"\")' style='margin-right: 4px'>重新汇总</button>"
                                   + "<button onclick='exportMonthDetail(\""+tradeMonth+"\")' style='margin-right: 4px'>导出明细Excel</button>"
                                   + "</td>"
                           + "</tr>";
                    $("#tableBody").append(row);
                }
                $("#pagination").append(getPageLink(currentPage, totalPage));
                if(ifShareUser()){
                    hideUpdateBtn();
                }
            }
        });
    }

    function toSumRecent6 () {
        $(this).attr('disabled',"disabled");
        $.ajax({
            url: financeMonthHost + "/sum/recent/6",
            method: 'GET',
            success: function(obj) {
                $("#toSumRecent").removeAttr('disabled');
                if (obj.code != 1) {
                    alert(obj.message);
                    return;
                }
                fetchData(currentPage);
            }
        });
    }

    function toSumRecent2 () {
        $.ajax({
            url: financeMonthHost + "/sum/recent/2",
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    alert(obj.message);
                    return;
                }
                fetchData(currentPage);
            }
        });
    }

     function getSum () {
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

     function getClassifiedSum(flowType) {
        openMask();
        var params = $("#search").serialize();
        $.ajax({
            url: financeMonthHost + "/classified/list/sum",
            method: 'GET',
            data: params + "&flowType="+flowType,
            success: function(obj) {
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

     function showSum(obj,desc){
        if (obj.code != 1) {
            return;
        }
        $("#viewClassifiedDiv").show();
        var data = obj.data.typeValueList;
        var sumAmountValue = obj.data.sumAmountValue;
        var top = 2;
        $("#viewClassifiedDiv").append("<label style='position: absolute;left: 1%; top:1%;color:#800000;font-weight:bold;font-size:18px'>"+desc+"</label>");
        $.each(data, function(index,value){
           top += 4;
           $("#viewClassifiedDiv").append("<label style='font-weight:bold;position: absolute;left: 20%; top: "+top+"%;'>"+value['typeValue']+"</label><label style='font-weight:bold;position: absolute;left: 35%; top: "+top+"%;'>:</label><label style='font-weight:bold;position: absolute;left: 40%; top: "+top+"%;'>"+value['amountValue']+"元</label><label style='font-weight:bold;position: absolute;left: 60%; top: "+top+"%;'>"+value['percent']+"%</label><br/>");
           if(index == data.length-1){
                top += 6;
                $("#viewClassifiedDiv").append("<label style='color:green;font-weight:bold;font-size:20px;position: absolute;left: 20%; top: "+top+"%;'>总计</label><label style='font-weight:bold;position: absolute;left: 35%; top: "+top+"%;'>:</label><label style='color:green;font-weight:bold;font-size:20px;position: absolute;left: 40%; top: "+top+"%;'>"+sumAmountValue+"元</label><br/>");
                $("#viewClassifiedDiv").append("<button style='position: absolute;left: 90%; top: 5%;' onclick = 'closeViewDialog()'>关闭</button>");
            }
        });
     }

     function getClassified(tradeMonth,flowType) {
        openMask();
        $.ajax({
            url: financeMonthHost + "/classified/list?tradeMonth="+tradeMonth+"&flowType="+flowType,
            method: 'GET',
            success: function(obj) {
                var flowTypeValue;
                 if(flowType == 0){
                     flowTypeValue = '(支出)';
                 } else {
                     flowTypeValue = '(收入)';
                 }
                var desc = tradeMonth + flowTypeValue;
                showSum(obj,desc);
            }
        });
     }

    function closeViewDialog(){
        $("#viewClassifiedDiv").empty().hide();
        closeMask();
    }

    function exportExcel(){
        var desc = getDescByTradeMonth();
        exportExcelFile(financeMonthHost + '/download?'+ $("#search").serialize(), desc + '账务(月度).xlsx');
    }

    function exportMonthDetail(tradeMonth){
        exportExcelFile(financeMonthHost + '/download/detail?tradeMonth='+tradeMonth, tradeMonth + '账务(明细).xlsx');
    }