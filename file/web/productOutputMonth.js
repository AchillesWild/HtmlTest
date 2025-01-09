
    let currentPage = 1;

    $(document).ready(function() {

        toSumRecent2 ();

        getProductSelect();

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

    function toSum(month){
        $(this).attr('disabled',"disabled");
        var params = "month="+month;
        $.ajax({
            url: outputMonthHost + "/sum",
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
        var productUuid = $("#productUuid").val();
        if(productUuid == null || productUuid == ''){
            $("#sum").hide();
        } else {
            $("#sum").show();
            getSum();
        }
        var params = $("#search").serialize() + "&pageNo="+currentPage+ "&pageSize="+pageSize;
        $.ajax({
            url: outputMonthHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                loadingGifFadeOut();
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
                    let productOutputMonth = list[i];
                    var id = productOutputMonth['id'];
                    var productUuid = productOutputMonth['productUuid'];
                    var productName = productOutputMonth['productName'];
                    var month = productOutputMonth['month'];
                    var numberStr = productOutputMonth['numberStr'] == null ? "" : productOutputMonth['numberStr'];
//                    var unitValue = productOutputMonth['unitValue'];
                    var updateTimeStr = productOutputMonth['updateTimeStr'];
                    var bgColor;
                    if (i % 2 == 0) {
                         bgColor = '#DCDCDC';
                    } else {
                         bgColor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgColor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+productName+"</td>"
                                   + "<td>"+month+"</td>"
                                   + "<td>"+numberStr+"</td>"
//                                   + "<td>"+unitValue+"</td>"
                                   + "<td>"+updateTimeStr+"</td>"
                                   + "<td><button onclick='toSum(\""+month+"\",\""+productUuid+"\")' style='margin-right: 4px'>重新汇总</button>"
                                       + "<button onclick='exportMonthDetail(\""+month+"\",\""+productUuid+"\",\""+productName+"\")' style='margin-right: 4px'>导出明细Excel</button>"
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

    function toSum(month, productUuid){
        $(this).attr('disabled',"disabled");
        var params = "productUuid="+productUuid+ "&month="+month;
        $.ajax({
            url: outputMonthHost + "/sum",
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

    function toSumRecent6 () {
        $(this).attr('disabled',"disabled");
        $.ajax({
            url: outputMonthHost + "/sum/recent/6",
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
            url: outputMonthHost + "/sum/recent/2",
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

    function closeViewDialog(){
        $("#viewClassifiedDiv").empty();
        $("#viewClassifiedDiv").hide();
        closeMask();
    }

    function getProductSelect() {
        if($("#productUuid").children().length > 0){
            return;
        }

        $.ajax({
            url: productHost + "/get/select",
            method: 'GET',
            success: function(obj) {
               var arr = obj.data;
               if(arr.count == 0){
                    return;
               }
               $.each(arr,function(index,object){
                  if (index == 0) {
                       $("#productUuid").append("<option style='display: none'></option>");
                   }
                   $("#productUuid").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
               });
            }
        });
    }

     function getSum() {
        var params = $("#search").serialize();
        $.ajax({
            url: outputMonthHost + "/get/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
                $("#sumNumber").html(obj.data.sumNumber);
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
        var productName = $('#productUuid option:selected').text();
        if(productName != "") {
            desc = productName + "_" + desc;
        }
        return desc;
     }

    function exportExcel(){
        var desc = getDescByTradeMonth();
        exportExcelFile(outputMonthHost + '/download?'+ $("#search").serialize(), desc + '计量-月度.xlsx');
    }

    function exportMonthDetail(month, productUuid, productName){
        exportExcelFile(outputMonthHost + '/download/detail?month=' + month + "&productUuid="+productUuid, productName + "_" + month + '计量-明细.xlsx');
    }