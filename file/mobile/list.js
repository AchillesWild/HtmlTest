    var currentPage = 1;
    var totalPage;
    var minId = null;
    var loading = false;
    var sharePage = '1';
    var openScroll = true;
    var operate;
    var prePosition = null;
    var file;
    $(document).ready(function() {

        ifToLoginByLocalToken();

        if(ifShareUser()){
            hideAddBtn();
            $("[id^='self']").text("退出");
        }

        var sharePagesArray = getSharePagesArray();
        var href = "share.html";
        if(ifShareUser()){
            //$("#mission, #note").hide();
            var shareHeaderType;
            if(!ifShare('1')){
                $("#mission").hide();
            } else {
                shareHeaderType = "mission";
            }
            if(!ifShare('2')){
                $("#note").hide();
            } else {
                shareHeaderType = "note";
            }
            if(!ifShare('3')){
                $("#finance").hide();
            } else {
                shareHeaderType = "finance";
            }
            if(!ifShare('4')){
                $("#product").hide();
            } else {
                shareHeaderType = "product";
            }
            if(!ifShare('5')){
                $("#goods").hide();
            } else {
                shareHeaderType = "goods";
            }
            if(headerType == null){
                headerType = shareHeaderType;
            }
        } else {
            if(headerType == null || headerType == undefined){
                var homePage = getHomePage();
                if (homePage == 1) {
                      headerType = "mission";
                } else if (homePage == 2) {
                     headerType = "note";
                } else if (homePage == 3) {
                     headerType = "finance";
                } else if (homePage == 4) {
                     headerType = "product";
                } else if (homePage == 5) {
                     headerType = "goods";
                }
            }
        }

        initList(headerType);

        $(".nav-item").click(function() {
            headerType = $(this).attr('id');
            initList(headerType);
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
                  ajaxList();
            }
        });

        $("#scrollTopBtn").on('click', function() {
            toTop();
        });

        $("#noteRecycleList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
            location.href = "noteRecycleList.html";
        });

        $("#financeTransactionList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
            location.href = "financeTransactionList.html";
        });

        $("#financeMonthList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
            location.href = "financeMonthList.html";
        });

        $("#productList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
            location.href = "productList.html";
        });

        $("#productOutputMonthList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
            location.href = "productOutputMonthList.html";
        });

        $("#goodsList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
            location.href = "goodsList.html";
        });

        $("#goodsSupplierList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
            location.href = "goodsSupplierList.html";
        });

        $("#goodsTradeMonthList").on('click', function(event) {
            $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
            location.href = "goodsTradeMonthList.html";
        });

        $("#self").on('click', function(event) {
             $(this).addClass("active").css("background-color", getBackgroundColor(headerType));
             if(ifShareUser()){
                logout();
             } else {
                self();
             }
        });

        $("#keyWords").on("keydown", function(event) {
            if (event.keyCode === 13) { // keyCode为13表示按下Enter键
                emptyList();
                ajaxList();
            }
        });

        $("#goodsUuidSearch").on("keydown", function(event) {
            if (event.which === 13) {
                event.preventDefault();
                checkInputGoodsAndSet();
                $(this).blur();
            }
        });

        function checkInputGoodsAndSet(){
            $("#goodsUuidSelect").hide();
            var searchTerm = $("#goodsUuidSearch").val().toLowerCase();
            if(searchTerm != ""){
                var exist = false;
                $('#goodsUuidSelect .option').each(function() {
                    var itemText = $(this).text().toLowerCase();
                    if(searchTerm == itemText){
                        exist = true;
                        $(this).css("background", searchSelectChosenBackgroundColor);
                        var value = $(this).attr("value");
                        $('#goodsUuid').val(value);
                    }
                });
                if(!exist){
                    $('#goodsUuidSearch, #goodsUuid').val("");
                    $('#goodsUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                }
            } else {
                $("#goodsUuid").val("");
            }
        }

        $('#goodsUuidSearch').on('blur', function() {
            setTimeout(function() {
                checkInputGoodsAndSet();
                emptyList();
                ajaxList();
            }, 3);
        });

        $('#supplierUuidSearch').on('blur', function() {
             setTimeout(function() {
                checkInputSupplierAndSet();
                emptyList();
                ajaxList();
             }, 3);
        });

        function checkInputSupplierAndSet(){
            $("#supplierUuidSelect").hide();
            var searchTerm = $("#supplierUuidSearch").val().toLowerCase();
            if(searchTerm != ""){
                var exist = false;
                $('#supplierUuidSelect .option').each(function() {
                    var itemText = $(this).text().toLowerCase();
                    if(searchTerm == itemText){
                        exist = true;
                        $(this).css("background", searchSelectChosenBackgroundColor);
                        var value = $(this).attr("value");
                        $('#supplierUuid').val(value);
                    }
                });
                if(!exist){
                    $('#supplierUuidSearch, #supplierUuid').val("");
                    $('#supplierUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                }
            } else {
                $("#supplierUuid").val("");
            }
        }

        $("#supplierUuidSearch").on("keydown", function(event) {
            if (event.keyCode === 13) {
                checkInputSupplierAndSet();
                $(this).blur();
            }
        });

        $('#goodsUuidSearch').on('click', function() {
            $('#goodsUuidSelect, #goodsUuidSelect .option').show();
            $('#supplierUuidSelect').hide();
        }).on('#goodsUuidSearch input', function() {
            var searchTerm = $(this).val().toLowerCase();
            var exist = false;
            $('#goodsUuidSelect .option').each(function() {
                var itemText = $(this).text().toLowerCase();
                var includes = itemText.includes(searchTerm);
                if(searchTerm != "" && includes){
                    exist = true;
                }
                $(this).toggle(includes);
            });
            if(!exist){
                $('#goodsUuid').val("");
                $('#goodsUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                 setTimeout(function() {
                     $('#goodsUuidSearch').val("");
                 }, 500);
            }
        });

        $('#supplierUuidSearch').on('click', function() {
            $('#supplierUuidSelect, #supplierUuidSelect .option').show();
            $('#goodsUuidSelect').hide();
        }).on('#supplierUuidSearch input', function() {
            var searchTerm = $(this).val().toLowerCase();
            var exist = false;
            $('#supplierUuidSelect .option').each(function() {
                var itemText = $(this).text().toLowerCase();
                var includes = itemText.includes(searchTerm);
                if(searchTerm != "" && includes){
                    exist = true;
                }
                $(this).toggle(includes);
            });
            if(!exist){
                $('#supplierUuid').val("");
                $('#supplierUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                 setTimeout(function() {
                     $('#supplierUuidSearch').val("");
                 }, 500);
            }
        });

        $("#keyWords").blur(function() {
            emptyList();
            ajaxList();
        });

        $("#transactionType, #type, #pace").on("change",function () {
            emptyList();
            ajaxList();
        });

         $("#flowType").on("change",function () {
            var flowType = $("#flowType").val();
            getPayOrIncomeSelect(flowType);
            emptyList();
            ajaxList();
         });

        $("#productUuidSearch").on("keydown", function(event) {
            if (event.which === 13) {
                event.preventDefault();
                checkInputProductAndSet();
                $(this).blur();
            }
        });

        $('#productUuidSearch').on('blur', function() {
            setTimeout(function() {
                checkInputProductAndSet();
                emptyList();
                ajaxList();
            }, 3);
        });

        function checkInputProductAndSet(){
            $("#productUuidSelect").hide();
            var searchTerm = $("#productUuidSearch").val().toLowerCase();
            if(searchTerm != ""){
                var exist = false;
                $('#productUuidSelect .option').each(function() {
                    var itemText = $(this).text().toLowerCase();
                    if(searchTerm == itemText){
                        exist = true;
                        $(this).css("background", searchSelectChosenBackgroundColor);
                        var value = $(this).attr("value");
                        $('#productUuid').val(value);
                    }
                });
                if(!exist){
                    $('#productUuidSearch, #productUuid').val("");
                    $('#productUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                }
            } else {
                $("#productUuid").val("");
            }
        }

        $('#productUuidSearch').on('click', function() {
            $('#productUuidSelect, #productUuidSelect .option').show();
        }).on('#productUuidSearch input', function() {
            var searchTerm = $(this).val().toLowerCase();
            var exist = false;
            $('#productUuidSelect .option').each(function() {
                var itemText = $(this).text().toLowerCase();
                var includes = itemText.includes(searchTerm);
                if(searchTerm != "" && includes){
                    exist = true;
                }
                $(this).toggle(includes);

            });
            if(!exist){
                $('#productUuid').val("");
                $('#productUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                 setTimeout(function() {
                     $('#productUuidSearch').val("");
                 }, 500);
            }
        });

        $(document).on('click', function(event) {
//            if(headerType != "goods"){
//                return;
//            }
            if (!$(event.target).closest('.searchSelectDiv').length) {
                $('.searchSelect').hide();
//                if($('#goodsUuid').val() == ""){
//                    $('#goodsUuidSearch').val("");
//                }
//                if( $('#supplierUuid').val() == "" ){
//                    $('#supplierUuidSearch').val("");
//                }
            }
        });

         $("#dateStart, #dateEnd").on("change",function () {
             emptyList();
             ajaxList();
         });

         $("#tradeType").on("change",function () {
             $('#supplierUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
             $("#supplierUuid, #supplierUuidSearch").val("");
            if($(this).val() == '0') {
                $("#supplierUuidDiv").show();
                bindGoodsClickOption();
            } else {
                $("#supplierUuidDiv, #supplierUuidSelect").hide();
            }
             emptyList();
             ajaxList();
         });

        $("#search").submit(function(event) {
            event.preventDefault();
            emptyList();
            ajaxList();
        });

        $(document).on('click', "#initBtn", function() {
            event.preventDefault();
            var id = $(this).attr('value');
            $.ajax({
                url: missionHost + "/update/pace/initial/"+id,
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert("失败!");
                        return;
                    }
                    updateOrRemove(id);
                }
            });
        });

        $(document).on('click', "#doneBtn", function() {
            event.preventDefault();
            var id = $(this).attr('value');
            $.ajax({
                url: missionHost + "/update/pace/done/"+id,
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert("失败!");
                        return;
                    }
                    updateOrRemove(id);
                }
            });
        });

        $(document).on("click", "#detail", function() {
            var id = $(this).data('id');
            toCache('id', id);
        });

        $(document).on("pagebeforeshow", "#dataListPage", function() {
            openScroll = true;
            $(".searchSelect").hide();
            hideUploadArea();
            $("#headerName").html("");
            var id = getCache('id');
            if(id != null){
                 var justUpdated = getCache('justUpdated');
                 if(justUpdated == 1){
                    removeCache("justUpdated");
                    updateOrRemove(id);
                 }
                 removeCache("id");
                 deleteCountCache();
            }
            removeImg();

            $('.updateForm')[0].reset();
            $("#addOrUpdateBtn, #allowEdit, #copyContentDiv").hide();
            $("#updateTitleDiv, #updateTypeDiv, #updatePaceDiv, #updateContentDiv, #updateRemarkDiv").hide();
            $("#updateAmountDiv, #updateFlowTypeDiv, #updateTransactionTypeDiv, #updateTradeDateDiv").hide();
            $("#updateProductUuidDiv, #updateUnitDiv, #updateNumberDiv, #updateProductionDateDiv").hide();
            $("#updateGoodsUuidDiv, #updateTradeTypeDiv, #updateSupplierUuidDiv, #updateGoodsNumberDiv, #updateGoodsUnitDiv, #updateUnitPriceDiv, #updateSumPriceDiv, #updateGoodsTradeDateDiv, #updatePaidDiv").hide();
        });

        $("#postImage").change(async function(){
           $(".getImg").hide();
           $("#imagePreview").attr("src", URL.createObjectURL($(this)[0].files[0]));
           file = await compressImg($(this)[0].files[0], 1000, 1000);
            $("#imagePreviewDiv").show();
        });

        $(".getImg").on('click', function(event) {
            event.preventDefault();
            var id = getCache('id');
            getBigImg(getIndexHost(headerType) + "/get/img/"+id);
        });

        $("#imagePreview").on("load", function () {  //just take care of add case
           var id = getCache('id');
           if(id == null){
               $(".deleteIcon").show();
           }
        });

        $(document).on('click', '#confirmNotice', function() {
            readNotice();
        });

//        if(!ifShareUser()){
            getNotice();
//        }

         $(document).on('click', '#copyContentBtn', function(event) {
            event.preventDefault();
            var tempTextarea = document.createElement('textarea');
            var val = document.getElementById('updateContent').value;
            if(val == null || val == '') {
                return;
            }
            tempTextarea.value = val // 设置内容
            document.body.appendChild(tempTextarea); // 添加到 DOM
            tempTextarea.select();
            document.execCommand('copy'); // 执行复制
            document.body.removeChild(tempTextarea);
            openAlert("已复制 !");
         });
    });

    function bindSupplierClickOption(){
        $('#supplierUuidSelect .option').on('click', function() {
            $('#supplierUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
            $(this).css("background", searchSelectChosenBackgroundColor);
            $('#supplierUuidSearch').val($(this).text()).change();
            $('#supplierUuidSelect').fadeOut(50);
            var value = $(this).attr("value");
            $('#supplierUuid').val(value)
        });
    }

     function bindGoodsClickOption(){
         $('#goodsUuidSelect .option').on('click', function() {
             $('#goodsUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
             $(this).css("background", searchSelectChosenBackgroundColor);
             $('#goodsUuidSearch').val($(this).text()).change();
             $('#goodsUuidSelect').fadeOut(50);
             var value = $(this).attr("value");
             $('#goodsUuid').val(value)

             if($("#tradeType").val() == '0'){
                 $("#supplierUuidDiv").show();
             }else {
                 $("#supplierUuidDiv").hide();
                 $("#supplierUuid, #supplierUuidSearch").val("");
             }
         });
     }

     $(document).on("pagecontainershow", function(event, ui) {
        if (ui.toPage.attr("id") === "dataListPage" && operate == "add") {
             operate = null;
             toTop();
        }
     });

    function getWhichExistParams(id){
        var params;
        if(headerType == "mission"){
           params = getMissionSearchParams();
        } else if(headerType == "note"){
           params = getNoteSearchParams();
        } else if(headerType == "finance"){
           params = getFinanceSearchParams();
        } else if(headerType == "product"){
           params = getProductOutputSearchParams();
        } else if(headerType == "goods"){
           params = getGoodsSearchParams();
        }
        params = params + "&pageNo=1&pageSize=1";
        params += "&id=" + id;
        return params;
    }

    function updateOrRemove(id){
        var params = getWhichExistParams(id);
        $.ajax({
            url: getIndexHost(headerType) + "/list",
            method: 'GET',
            data: params,
            async: false,
            success: function(obj) {
                var $oldRow = $("#li_"+id+"");
                var length = $oldRow.length; //add or update
                if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                    if(length == 1){
                        $oldRow.remove();
                        if($("#list ul").children().length == 0){
                            ajaxList();
                        }
                    } else {
                        location.href = "list.html";
                    }
                    return;
                }
                var list = obj.data.list;
                let object = list[0];
                var row;
                if(headerType == "mission"){
                   row = getOneMissionRow(object);
                } else if(headerType == "note"){
                   row = getOneNoteRow(object);
                } else if(headerType == "finance"){
                   row = getOneFinanceRow(object);
                } else if(headerType == "product"){
                   row = getOneProductOutRow(object);
                } else if(headerType == "goods"){
                   row = getOneGoodsTradeRow(object);
                }
                if(length == 1){
                    $oldRow.after(row);
                    $oldRow.remove();
                } else {
                    operate = "add";
                    $("#list ul").prepend(row);
                }
                toSum();
            }
        });
    }

    function initList(headerType){
       $(".nav-item").removeClass("active").css("background-color", "");
       $("#" + headerType).addClass("active").css("background-color", getBackgroundColor(headerType));
       toCache(LIST.HEADER_TYPE, headerType);
       emptyList();
       $('#search')[0].reset();
       $(".footer-nav-item").hide();
       $("[data-role='fieldcontain']").children().hide();
       $("#self").show();
       hideBottomNoMessage(); // firstly in no data label, then to data label; will see bottom Briefly
       $('.option').css("background", searchSelectDefaultBackgroundColor);
       $("#sumAmountDiv").hide();
       if (headerType == "mission") {
          $("#keyWords").attr("placeholder", "标题/内容");
          getPaceIndex();
          $("#keyWordsDiv, #paceDiv").show();
          fetchDataMission();
          toCacheMissionTotal();
       } else if (headerType == "note"){
           $("#keyWords").attr("placeholder", "标题/内容");
           getNoteTypeIndex();
           $("#keyWordsDiv, #typeDiv").show();
           fetchDataNote();
           toCacheNoteTotal();
           if(!ifShareUser()){
               $("#noteRecycleList").show();
           }
       } else if (headerType == "finance"){
           $("#updateTitleDiv").hide();
           $("#keyWords").attr("placeholder", "备注");
           $("#transactionType").empty().append("<option value='' selected>收/支类型(全部)</option>");
           $("#sumIncomeAmountName").html("总收入(元)");
           $("#sumPayAmountName").html("总支出(元)");
           $("#sumMarginName").html("差额(元)");
           $("#sumIncomeAmountValue, #sumPayAmountValue, #sumMarginValue").html("");
           $("#flowTypeDiv, #keyWordsDiv, #dayRangeDiv, #financeTransactionList, #financeMonthList, #sumAmountDiv").show();
           fetchDataFinance();
           toCacheFinanceTotal();
       } else if (headerType == "product"){
           getProductSelect();
           $("#productUuidDiv, #dayRangeDiv, #sum, #productList, #productOutputMonthList").show();
           toCacheProductOutputTotal();
           fetchProductOutput();
       } else if (headerType == "goods"){
           getTheGoods();
           getTheGoodsTradeType();
           getTheSupplier();
           $("#sumIncomeAmountName").html("销售总额(元)");
           $("#sumPayAmountName").html("进货总额(元)");
           $("#sumMarginName").html("毛利(元)");
           $("#sumIncomeAmountValue, #sumPayAmountValue, #sumMarginValue").html("");
           $("#goodsUuidDiv, #tradeTypeDiv, #dayRangeDiv, #goodsList, #goodsSupplierList, #goodsTradeMonthList, #sumAmountDiv").show();
           fetchGoodsTrade();
           toCacheTradeGoodsTotal();
       }
    }

    function ajaxList(){
        hideBottomNoMessage();
       if (headerType == "mission") {
          fetchDataMission();
       } else if (headerType == "note"){
           fetchDataNote();
       } else if (headerType == "finance"){
           fetchDataFinance();
       } else if (headerType == "product"){
           fetchProductOutput();
       } else if (headerType == "goods"){
           fetchGoodsTrade();
       }
    }

    function getIndexHost(headerType){
        var indexHost;
        if (headerType == "mission") {
           indexHost = missionHost;
        } else if (headerType == "note"){
           indexHost = noteHost;
        } else if (headerType == "finance"){
           indexHost = financeHost;
        } else if (headerType == "product"){
           indexHost = outputHost;
        } else if (headerType == "goods"){
           indexHost = tradeGoodsHost;
        }
        return indexHost;
    }

    function emptyList(){
        $("#list ul").empty();
        currentPage = 1;
        totalPage = null;
        minId = null;
        prePosition = null;
    }

    function getTheParams(params){
        params = params + "&pageNo=1&pageSize=" + pageSize;
        if(minId != null){
            params += "&preMinId=" + minId;
        }
        return params;
    }

    function getGoodsSearchParams(){
        var tradeType = $("#tradeType").val();
        var params = "tradeType=" + tradeType+ "&tradeDateStart=" + $("#dateStart").val() + "&tradeDateEnd=" + $("#dateEnd").val();
        if(tradeType == 0){
            var supplierUuid = $("#supplierUuid").val();
            if(supplierUuid != null && supplierUuid != 'null'  && supplierUuid != ''){
                params += "&supplierUuid=" + supplierUuid;
            }
        }
        var goodsUuid = $("#goodsUuid").val();
        if(goodsUuid != null && goodsUuid != 'null'  && goodsUuid != ''){
            params += "&goodsUuid=" + goodsUuid;
        }
        return params;
    }

    function fetchGoodsTrade() {
        var params = getGoodsSearchParams();
        params = getTheParams(params);
        $.mobile.loading("show");
        $.ajax({
            url: tradeGoodsHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                if(headerType != "goods"){
                    return;
                }
                toSum();
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
                    let tradeGoods = list[i];
                    var row = getOneGoodsTradeRow(tradeGoods);
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

    function getOneGoodsTradeRow(tradeGoods){
        var id = tradeGoods['id'];
        var goodsName = tradeGoods['goodsName'];
        var number = tradeGoods['number'] == null ? '' : tradeGoods['number'];
        if(number != ""){
            var unitValue = tradeGoods['unitValue'] == null ? '' : tradeGoods['unitValue'];
            number = "<p>总量 : "+number+unitValue+"</p>";
        }

        var sumPrice = tradeGoods['sumPrice'] == null ? '' : tradeGoods['sumPrice'];
        var tradeType = tradeGoods['tradeType'] == null ? '' : tradeGoods['tradeType'];
        var tradeTypeValue = tradeGoods['tradeTypeValue'] == null ? '' : tradeGoods['tradeTypeValue'];
        var supplierName = tradeGoods['supplierName'] == null ? '' : tradeGoods['supplierName'];
        if(supplierName != ''){
            supplierName = "<p>供应商 : " + supplierName + "</p>";
        }
        var unitPrice = tradeGoods['unitPrice'] == null ? '' : tradeGoods['unitPrice'];
        if(unitPrice != ''){
            unitPrice = "<p>单价 : "+unitPrice+"元</p>";
        }
        var tradeDate = tradeGoods['tradeDate'] == null ? '' : tradeGoods['tradeDate'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:"+getBackgroundColor(headerType)+";border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+goodsName+"("+tradeTypeValue+")</h6>"
                       + unitPrice
                       + number
                       + "<p>总价 : "+sumPrice+"元</p>"
                       + supplierName
                       + "<div class='row'>"
                                + "<div class='col-left'>"
                                    + "<p class='time'>"+tradeDate+"</p>"
                                + "</div> "
                                + "<div class='col-right'>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-eye ui-btn-icon-notext' id='detail' href='#getOrUpdate' data-id='"+id+"' style='background-color: #7FFFD4;'></a>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext' id='delete_"+id+"' onclick=deleteOne("+id+") style='background-color: #F4A460;'>删除</a>"
                                + "</div> "
                       + "</div> "
                + "</li>";
        return row;
    }

    function getProductOutputSearchParams(){
        var params = "productionDateStart=" + $("#dateStart").val() + "&productionDateEnd=" + $("#dateEnd").val();
        var productUuid = $("#productUuid").val();
        if(productUuid != null && productUuid != 'null'  && productUuid != ''){
            params += "&productUuid=" + productUuid;
        }
        return params;
    }

    function fetchProductOutput() {
        var params = getProductOutputSearchParams();
        var productUuid = $("#productUuid").val();
        if(productUuid != null && productUuid != 'null'  && productUuid != ''){
            $("#sum").show();
            toSum();
        } else {
            $("#sum").hide();
        }
       params = getTheParams(params);
       $.mobile.loading("show");
        $.ajax({
            url: outputHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                if(headerType != "product"){
                    return;
                }
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
                    var row = getOneProductOutRow(object);
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

    function getOneProductOutRow(object){
        var id = object['id'];
        var productName = object['productName'];
        var productCode = object['productCode'] ;
        if(productCode != null && productCode != ""){
            productName = productName + "(" + productCode + ")";
        }
        var number = object['number'];
        var unitValue = object['unitValue'];
        var productionDate = object['productionDate'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:"+getBackgroundColor(headerType)+";border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+productName+"</h6>"
                       + "<p>"+number+unitValue+"</p>"
                       + "<div class='row'>"
                                + "<div class='col-left'>"
                                    + "<p class='time'>"+productionDate+"</p>"
                                + "</div> "
                                + "<div class='col-right'>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-eye ui-btn-icon-notext' id='detail' href='#getOrUpdate' data-id='"+id+"' style='background-color: #7FFFD4;'></a>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext' id='delete_"+id+"' onclick=deleteOne("+id+") style='background-color: #F4A460;'>删除</a>"
                                + "</div> "
                       + "</div> "
                + "</li>";
        return row;
    }

    function getNoteSearchParams(){
        var params = "keyWords=" + $("#keyWords").val() ;
        var type = $("#type").val();
        if(type != null && type != 'null'  && type != ''){
            params += "&type=" + type;
        }
        return params;
    }

    function fetchDataNote() {
        var params = getNoteSearchParams();
        params = getTheParams(params);
        $.mobile.loading("show");
        $.ajax({
            url: noteHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                if(headerType != "note"){
                    return;
                }
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
                    var row = getOneNoteRow(object);
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

    function getOneNoteRow(object){
        var id = object['id'];
        var title = object['title'];
        var typeValue = object['typeValue'];
        var content = object['content'] == null ? '' : object['content'];
        var createTimeStr = object['createTimeStr'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:"+getBackgroundColor(headerType)+";border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+title+"</h6>"
                       + "<p>"+content+"</p>"
                       + "<p style='font-weight:bold'>"+typeValue+"</p>"
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

    function getProductSelect(){
        $("#productUuidSelect").empty();
        var arr = getTheProductSelect();
        if(arr == null){
//            alert("请先定义计量物 !");
            return;
        }
        $.each(arr, function(index, object){
           $("#productUuidSelect").append("<div class='option' value='" +object.uuid+ "'>"+object.name+"</option>");
        });

        $('#productUuidSelect .option').on('click', function() {
             $('#productUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
             $(this).css("background", searchSelectChosenBackgroundColor);
             $('#productUuidSearch').val($(this).text()).change();
             $('#productUuidSelect').fadeOut(40);
             var value = $(this).attr("value");
             $('#productUuid').val(value);
        });
    }

    function getPayOrIncomeSelect(flowType){
        $("#transactionType").empty().selectmenu('refresh');
        if(flowType == null || flowType == ""){
            $("#transactionTypeDiv").hide();
//            $("#transactionType").append("<option value='' selected>收/支类型(全部)</option>").selectmenu('refresh');
            return;
        }
        $("#transactionTypeDiv").show();
        if(flowType == 0){
           $("#transactionType").append("<option value='' selected>支出类型(全部)</option>").selectmenu('refresh');
        } else {
           $("#transactionType").append("<option value='' selected>收入类型(全部)</option>").selectmenu('refresh');
        }
        var arr = getTransactionTypeSelect(flowType);
        if(arr == null){
            return;
        }
        $.each(arr, function(index, object){
             $("#transactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
        });
    }

    function getPaceIndex(){
        $("#pace").empty().selectmenu('refresh');
        var missionPaceMap = getMissionPace();
        $.each(missionPaceMap, function(index, value){
             if(index == 0){
                  $("#pace").append("<option value='' selected>进度(全部)</option>");
             }
            $("#pace").append("<option value='" +index+ "'>"+value+"</option>");
        });
    }

    function getNoteTypeIndex(){
        $("#type").empty().selectmenu('refresh');
        var noteTypeMap = getNoteType();
        $.each(noteTypeMap, function(index, value){
            if(index == 0){
                $("#type").append("<option value='' selected>分类(全部)</option>");
            }
            $("#type").append("<option value='" +index+ "'>"+value+"</option>");
        });
    }

    function getTheGoods() {
        $("#goodsUuidSelect").empty();
//        if($("#goodsUuidSelect").children().length > 0){
//            return;
//        }
        var goodsArray = getTheGoodsSelect();
        if(goodsArray == null){
//            openAlert("请先定义商品 !");
            return;
        }
        $.each(goodsArray, function(index, object){
           $("#goodsUuidSelect").append("<div class='option' value='" +object.uuid+ "'>"+object.name+"</option>");
        });

        bindGoodsClickOption();
    }

    function getTheGoodsTradeType() {
        $("#tradeType").empty().selectmenu('refresh');
        var goodsTradeTypeArray = getGoodsTradeType();
        $.each(goodsTradeTypeArray, function(index, object){
            if(index == 0){
                $("#tradeType").append("<option value='' selected>交易类型(全部)</option>");
            }
            $("#tradeType").append("<option value='" +object.key+ "'>"+object.value+"</option>");
        });
    }

    function getTheSupplier() {
          $("#supplierUuidSelect").empty();
//         if($("#supplierUuidSelect").children().length > 0){
//            return;
//         }
         var arr = getTheSupplierSelect();
         if(arr == null){
             return;
         }
         $.each(arr, function(index, object){
           $("#supplierUuidSelect").append("<div class='option' value='" +object.uuid+ "'>"+object.name+"</option>");
         });

         bindSupplierClickOption();
    }

    function getFinanceSearchParams(){
        var params = "keyWords=" + $("#keyWords").val() + "&tradeDateStart=" + $("#dateStart").val() + "&tradeDateEnd=" + $("#dateEnd").val();
        var flowType = $("#flowType").val();
        if(flowType != null && flowType != 'null'  && flowType != ''){
            params += "&flowType=" + flowType;
        }
        var transactionType = $("#transactionType").val();
        if(transactionType != null && transactionType != 'null'  && transactionType != ''){
            params += "&transactionType=" + transactionType;
        }
        return params;
    }

    function fetchDataFinance() {
        var params = getFinanceSearchParams();
        params = getTheParams(params);
        $.mobile.loading("show");
        $.ajax({
            url: financeHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                if(headerType != "finance"){
                    return;
                }
                toSum();
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
                    var row = getOneFinanceRow(object);
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

    function getOneFinanceRow(object){
        var id = object['id'];
        var flowTypeValue = object['flowTypeValue'];
        var amount = object['amountValue'];
        var transactionTypeValue = object['transactionTypeValue'];
        var type = transactionTypeValue + "(" + flowTypeValue + ")";
        var remark = object['remark'];
        var remarkElement = "";
        if(remark != null && remark != ''){
            remarkElement = "<p style='font-size:0.6em'>"+remark+"</p>";
        }
        var tradeDate = object['tradeDate'] == null ? '' : object['tradeDate'];
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:"+getBackgroundColor(headerType)+";border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+amount+"元</h6>"
                       + "<p style='font-weight:bold'>"+type+"</p>"
                       + remarkElement
                       + "<div class='row'>"
                                + "<div class='col-left'>"
                                    + "<p class='time'>"+tradeDate+"</p>"
                                + "</div> "
                                + "<div class='col-right'>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-eye ui-btn-icon-notext' id='detail' href='#getOrUpdate' data-id='"+id+"' style='background-color: #7FFFD4;'></a>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext' id='delete_"+id+"' onclick=deleteOne("+id+") style='background-color: #F4A460;'>删除</a>"
                                + "</div> "
                       + "</div> "
                + "</li>";
        return row;
    }

    function getMissionSearchParams(){
        var params = "keyWords=" + $("#keyWords").val();
        var pace = $("#pace").val();
        if(pace != null && pace != 'null'  && pace != ''){
            params += "&pace=" + pace;
        }
        return params;
    }

    function fetchDataMission() {
        var params = getMissionSearchParams();
        params = getTheParams(params);
        $.mobile.loading("show");
        $.ajax({
            url: missionHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                if(headerType != "mission"){
                    return;
                }
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
                    let mission = list[i];
                    var li = getOneMissionRow(mission);
                    appendRow(li);
                }
                if(ifShareUser()){
                    hideUpdateBtn();
                    $("#initBtn, #doneBtn").hide();
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

    function getOneMissionRow(mission){
        var id = mission['id'];
        var title = mission['title'];
        var content = mission['content'] == null ? '' : mission['content'];
        var createTimeStr = mission['createTimeStr'];
        var pace = mission['pace'];
        var paceValue = mission['paceValue'];
        var backgroundColor = getBackgroundColor(headerType);
        var paceDiv;
        if (pace == 0) {
            backgroundColor = '#CDC5BF';
            paceDiv = "<a class='detail-button' id='doneBtn' value='"+id+"' style='margin-right:9em' style='color:red'>关闭</a>";
        } else if (pace == 1){
            backgroundColor = '#FDF5E6';
            paceDiv = "<a class='detail-button' id='doneBtn' value='"+id+"' style='margin-right:9em' style='color:red'>关闭</a>";
        } else {
            paceDiv = "<a class='detail-button' id='initBtn' value='"+id+"' style='margin-right:9em'>开启</a>";
        }
        var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:"+backgroundColor+";border-radius: 0.5em;padding: 0.5em;'>"
                       + "<h6>"+title+"</h6>"
                       + "<p>"+content+"</p>"
                       + "<div class='row'>"
                            + "<div class='col-left'>"
                                + "<p style='font-weight:bold' id='paceValue_"+id+"'>"+paceValue+"</p>"
                            + "</div> "
                            + "<div class='col-right'>"
                            + paceDiv
                            + "</div> "
                       + "</div> "
                       + "<div class='row'>"
                                + "<div class='col-left'>"
                                    + "<p class='time'>"+createTimeStr+"</p>"
                                + "</div> "
                                + "<div class='col-right'>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-eye ui-btn-icon-notext' id='detail' href='#getOrUpdate' data-id='"+id+"' style='background-color: #7FFFD4;'></a>"
                                    + "<a class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext' id='delete_"+id+"' onclick=deleteOne("+id+") style='background-color: #F4A460;'></a>"
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
                    showLoadingAndOverlay();
                    $.ajax({
                        url: getIndexHost(headerType) + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            hideLoadingAndOverlay();
                            if (obj.code != 1) {
                                alert("失败 !");
                                return;
                            }
                            deleteCountCache();
                            var childNum = $("#list ul").children().length;
                            $('a#delete_'+id).closest('li').remove();
                            if(childNum == 1){
                                ajaxList();
                            } else {
                                toSum();
                            }
                        }
                    });
                },
                function() {return;}
        )
    }

    function toSum(){
        if(headerType == "finance"){
            getFinanceSum();
        } else if (headerType == "product"){
            var productUuid = $("#productUuid").val();
            if(productUuid != null && productUuid != 'null'  && productUuid != ''){
                getProductSum();
            }
        } else if (headerType == "goods"){
            getGoodsSum();
        }
    }

    function deleteCountCache(){
        if(headerType == "mission"){
           removeCache("missionTotal");
        } else if(headerType == "note"){
           removeCache("noteTotal");
        } else if(headerType == "finance"){
           removeCache("financeTotal");
        } else if(headerType == "product"){
           removeCache("productOutputTotal");
        } else if(headerType == "goods"){
           removeCache("tradeGoodsTotal");
        }
    }

    function getProductSum() {
         var params = getProductOutputSearchParams();
         $.ajax({
             url: outputHost + "/get/sum",
             method: 'GET',
             data: params,
             success: function(obj) {
                 $("#sumNumber").html(obj.data.sumNumber + obj.data.unitValue);
             }
         });
    }

     function getFinanceSum(){
        var params = getFinanceSearchParams();
        $.ajax({
            url: financeHost + "/get/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
                if(headerType != "finance"){
                    return;
                }
                var sumIncomeAmountValue = obj.data.sumIncomeAmountValue;
                $("#sumIncomeAmountValue").html(sumIncomeAmountValue);
                var sumPayAmountValue = obj.data.sumPayAmountValue;
                $("#sumPayAmountValue").html(sumPayAmountValue);
                $("#sumMarginValue").html(obj.data.sumMarginValue);
            }
        });
     }

     function getGoodsSum(){
        var params = getGoodsSearchParams();
        $.ajax({
            url: tradeGoodsHost + "/get/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
                if(headerType != "goods"){
                    return;
                }
                $("#sumIncomeAmountValue").html(obj.data.sumIncomeAmountValue);
                $("#sumPayAmountValue").html(obj.data.sumPayAmountValue);
                $("#sumMarginValue").html(obj.data.sumMarginValue);
            }
        });
     }

    function getNotice(){
        $.ajax({
            url: userNoticeHost + "/get/one",
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    return;
                }
                var id = obj.data.id;
                $("#noticeId").val(id);
//                var token = getToken();
//                var key = token + "_" + id;
//                var haveDone = getCache(key);
//                if(haveDone != null){
//                    return;
//                }
//                toCache(key, "1");
                var content = obj.data.content;
                $("#alertNoticeMessage").html(content);
                if(obj.data.repeated == 1){
                    $('.checkbox-container').show();
                } else {
                    $('.checkbox-container').hide();
                }
                $('#alertNotice').show();
                showOverlay();
            }
        });
    }

    function readNotice(){
        var closeRepeat;
        if ($('#readCheckbox').is(':checked')) {
            closeRepeat = 1;
        } else {
            closeRepeat = 0;
        }
        let notice = {
                    "noticeId": $("#noticeId").val(),
                 "closeRepeat": closeRepeat
                 };

        $.ajax({
            url: userNoticeHost + "/read/one",
            method: 'POST',
            data: JSON.stringify(notice),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                $('#alertNotice').hide();
                hideOverlay();
            }
        });
    }

