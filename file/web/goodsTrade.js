
    var currentPage = 1;
    var file;
	$(document).ready(function() {

       if(!ifShareUser()){
           showBtn();
       }

        fetchData(currentPage);

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

        $("#addBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate('add');
        });

        $(document).on('click', '#viewBtn', function() {
            openMask();
            $.ajax({
                url: tradeGoodsHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewGoodsName").val(obj.data.goodsName);
                    var tradeType = obj.data.tradeType;
                    $("#viewTadeType").val(tradeType);
                    $("#viewNumber").val(obj.data.number);
                    $("#viewUnit").val(obj.data.unit);
                    $("#viewUnitPrice").val(obj.data.unitPrice);
                    $("#viewSumPrice").val(obj.data.sumPrice);
                    $("#viewGoodsType").val(obj.data.goodsType);
                    if(tradeType == 0){
                        $("#viewSupplierUuidDiv").show();
                        $("#viewSupplierUuid").val(obj.data.supplierUuid);
                    }else{
                        $("#viewSupplierUuidDiv").hide();
                    }

                    $("#viewTradeDate").val(obj.data.tradeDate);
                    $("#viewPaid").val(obj.data.paid);
                    $("#viewRemark").val(obj.data.remark);
                    $("#createTimeStr").val(obj.data.createTimeStr);
                    $("#updateTimeStr").val(obj.data.updateTimeStr);
                    var imgBase64 = obj.data.compressImgUrl;
                    if (imgBase64 != null && imgBase64 != '') {
                       showPreview('view', imgBase64);
                        $("#imgViewDiv").show();
                    } else {
                        $("#viewShowImg").empty();
                        $("#imgViewDiv").hide();
                    }
                }
            });
        });

        $(document).on('click', '#editBtn', function() {
            openMask();
            $.ajax({
                url: tradeGoodsHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#updateDiv").show();
                    $("#updateId").val(obj.data.id);
                    $("#updateGoodsUuid").val(obj.data.goodsUuid);
                    var tradeType = obj.data.tradeType;
                    $("#updateTradeType").val(tradeType);
                    $("#updateNumber").val(obj.data.number);
                    $("#updateUnit").val(obj.data.unit);
                    $("#updateUnitPrice").val(obj.data.unitPrice);
                    $("#updateSumPrice").val(obj.data.sumPrice);
                    $("#updateGoodsType").val(obj.data.goodsType);
                    if(tradeType == 0){
                        $("#updateSupplierUuidDiv").show();
                        $("#updateSupplierUuid").val(obj.data.supplierUuid);
                    }else{
                        $("#updateSupplierUuidDiv").hide();
                    }
                    $("#updateTradeDate").val(obj.data.tradeDate);
                    $("#updatePaid").val(obj.data.paid);
                    $("#updateRemark").val(obj.data.remark);
                    var imgBase64 = obj.data.compressImgUrl;
                    if (imgBase64 != null && imgBase64 != '') {
                        showPreviewAndDelete("update", imgBase64);
                    } else {
                        $("#updateShowImg").empty();
                    }
                }
            });
        });

        $("#updateBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate('update');
        });

        $(document).on('click', "#deleteBtn", function() {
           event.preventDefault();
           var id = $(this).val();
           customConfirm("您确定删除吗 !",
                function() {
                    $.ajax({
                        url: tradeGoodsHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code != 1) {
                                openAlert(obj.message);
                                return;
                            }
                            fetchData(currentPage);
                        }
                    });
                },
                function() {return;}
            )
        });

        $("form").submit(function(event) {
            event.preventDefault();
        });

        $(document).on('click', "#copyBtn", function() {
            event.preventDefault();
            $.ajax({
                url: tradeGoodsHost + "/copy/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    currentPage = 1;
                    fetchData(currentPage);
                }
            });
        });

        $("#tradeType").on("change",function () {
             var tradeType = $(this).val();
             if (tradeType == 0){
                $("#supplierUuidDiv").show();
             } else {
                $("#supplierUuidDiv").hide();
                $("#supplierUuid").val("");
             }
        });

        $("#addTradeType").on("change",function () {
             var tradeType = $(this).val();
             if (tradeType == 0){
                $("#addSupplierUuidDiv").show();
                $("#addPaid").val("0");
             } else {
                $("#addSupplierUuidDiv").hide();
                $("#addPaid").val("1");
             }
        });

        $("#updateTradeType").on("change",function () {
             var tradeType = $(this).val();
             if (tradeType == 0){
                $("#updateSupplierUuidDiv").show();
             } else {
                $("#updateSupplierUuidDiv").hide();
             }
        });

         getSupplierSelect();
         getUnit ();
         getSupplierType ();
         getTradeType ();
         getGoodsSelect ();
    });

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        $.ajax({
            url: tradeGoodsHost + "/list",
            method: 'GET',
            data: $("#search").serialize() + "&pageNo="+currentPage+ "&pageSize="+pageSize,
            success: function(obj) {
                loadingGifFadeOut();
                if (obj.code == NO_DATA.CODE && currentPage > 1) {
                    currentPage = currentPage - 1;
                    fetchData(currentPage);
                    return;
                }
                getSearchSum(tradeGoodsHost + "/get/sum");
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
                    let tradeGoods = list[i];
                    var id = tradeGoods['id'];
                    var goodsName = tradeGoods['goodsName'];
                    var goodsTypeValue = tradeGoods['goodsTypeValue'] == null ? '' : tradeGoods['goodsTypeValue'];
                    var tradeTypeValue = tradeGoods['tradeTypeValue'] == null ? '' : tradeGoods['tradeTypeValue'];
                    var numberStr = tradeGoods['numberStr'] == null ? '' : tradeGoods['numberStr'];
//                    var unitValue = tradeGoods['unitValue'] == null ? '' : tradeGoods['unitValue'];
                    var unitPrice = tradeGoods['unitPrice'] == null ? '' : tradeGoods['unitPrice'];
                    var sumPrice = tradeGoods['sumPrice'] == null ? '' : tradeGoods['sumPrice'];
                    var tradeDate = tradeGoods['tradeDate'] == null ? '' : tradeGoods['tradeDate'];
                    var supplierUuid = tradeGoods['supplierUuid'];
                    var supplierName = tradeGoods['supplierName'] == null ? '' : tradeGoods['supplierName'];
                    if(supplierName != ''){
                        supplierName = "<a href='javascript:void(0)' title='点击查看供应商信息' onclick='getSupplierDetail(\""+supplierUuid+"\")'>"+supplierName+"</a>";
                    }

                    var remark = tradeGoods['remark'] == null ? '' : tradeGoods['remark'];
                    var hasImg = tradeGoods['hasImg'];
                    if (hasImg == 1) {
                        hasImg = "<a href='javascript:void(0)' title='点击预览图片' onclick='previewImg(\""+id+"\")'>预览</a>"
                               + "&nbsp;&nbsp;"
                               + "<a href='javascript:void(0)' title='点击下载原图' onclick='downloadImg(\""+id+"\")'>下载</a>";
                    } else {
                        hasImg = '';
                    }
//                        var createTimeStr = tradeGoods['createTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+goodsName+"</td>"
                                   + "<td>"+tradeTypeValue+"</td>"
                                   + "<td>"+numberStr+"</td>"
//                                   + "<td>"+unitValue+"</td>"
                                   + "<td>"+unitPrice+"</td>"
                                   + "<td>"+sumPrice+"</td>"
                                   + "<td>"+tradeDate+"</td>"
                                   + "<td>"+supplierName+"</td>"
                                   + "<td>"+remark+"</td>"
                                   + "<td>"+hasImg+"</td>"
//                                       + "<td>"+createTimeStr+"</td>"
                                   + "<td><button id='viewBtn' style='margin-right: 4px' value='"+id+"'>详细</button>"
                                   + "<button id='editBtn' style='margin-right: 4px' value='"+id+"'>修改</button>"
                                   + "<button id='copyBtn' style='margin-right: 4px' value='"+id+"'>复制</button>"
                                   + "<button id='deleteBtn' style='margin-right: 4px' value='"+id+"'>删除</button>"
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

    function addOrUpdate(prefix){
		var idPrefix = '#' + prefix;
        var goodsUuid = $(idPrefix + "GoodsUuid").val();
        if(goodsUuid == null || goodsUuid == '' || goodsUuid.length > 32){
             openAlert(GOODS_MUST_CHOOSE);
             return;
        }

        var files = new FormData();
        files.append('file', file);
        files.append('goodsUuid', goodsUuid);
        var tradeType = $(idPrefix + "TradeType").val();
        files.append('tradeType', tradeType);
        var number = $(idPrefix + "Number").val();
        if(number != null && number != ""){
            if(!checkPositive3(number)){
                openAlert(MSG_NUMBER_3);
                return;
            }
            files.append('number', number);
            var unit = $(idPrefix + "Unit").val();
            if(unit == null || unit == ""){
                 openAlert(MSG_UNIT_MUST_CHOOSE);
                 return;
            }
            if(ifUnitIsInteger(unit)){
                 if(!checkPositiveInteger(number)){
                     openAlert(MSG_UNIT_MUST_INTEGER);
                     return;
                 }
            }
            files.append('unit', unit);
        }
        var unitPrice = $(idPrefix + "UnitPrice").val();
        if(unitPrice !='' && !checkPositive3(unitPrice)){
            openAlert(MSG_UNIT_PRICE);
            return;
        }
        files.append('unitPrice', unitPrice);
        var sumPrice = $(idPrefix + "SumPrice").val();
        if(!checkPositive2(sumPrice)){
         openAlert(MSG_SUM_PRICE);
            return;
        }
        files.append('sumPrice', sumPrice);
        var supplierUuid = $(idPrefix + "SupplierUuid").val();
        if(tradeType == 0){
            if(supplierUuid == null || supplierUuid == ""){
                openAlert(MSG_SUPPLIER_MUST_CHOOSE);
                return;
            }
        } else {
            supplierUuid = "";
        }
        files.append('supplierUuid', supplierUuid);
        var tradeDate = $(idPrefix + "TradeDate").val();
        if(tradeDate == null || tradeDate == ""){
            openAlert(MSG_DATE_MUST_CHOOSE);
            return;
        }
        files.append('tradeDate', tradeDate);
        files.append('paid', $(idPrefix + "Paid").val());
        var remark = $(idPrefix + "Remark").val();
        if(remark != '' && remark.length > 1024){
            openAlert(MSG_REMARK_1024);
            return;
        }
        files.append('remark', remark);

        var imgUrl = $(idPrefix + "ImgPreview").attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
        var url = tradeGoodsHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = tradeGoodsHost + "/add";
        }
        $(idPrefix + "Btn").attr('disabled',"disabled");
        $.ajax({
            url: url,
            type: 'POST',
            data: files,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(obj) {
                $(idPrefix + "Btn").removeAttr('disabled');
                if (obj.code == GOODS_TRADE_OUT_OF_LIMIT.CODE) {
                    openAlert(GOODS_TRADE_OUT_OF_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert("修改失败 !");
                    return;
                }
                if (prefix == 'add') {
                    currentPage = 1;
                    closeAddDialog();
                } else {
                    closeUpdateDialog();
                }
                fetchData(currentPage);
            }
        });
    }

    function getSupplierSelect () {
        $.ajax({
            url: supplierHost + "/get/select",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,object){
                    $("#supplierUuid,#addSupplierUuid,#updateSupplierUuid,#viewSupplierUuid").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
                });
            }
        });
    }

    function getUnit () {
        $.ajax({
            url: commonHost + "/unit/select",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                var jsonArrayStr = JSON.stringify(arr);
                toCache(INIT.UNIT, jsonArrayStr);
                $.each(arr,function(index, object){
                    $("#addUnit,#updateUnit,#viewUnit").append("<option value='" +object.unit+ "'>"+object.unitValue+"</option>");
                });
            }
        });
    }

    function ifUnitIsInteger(unit) {
        var unitArray = getUnits();
        var result = false;
        $.each(unitArray, function(index, object){
            if(unit == object.unit && object.isInteger == 1){
               result = true;
               return false;
            }
        });
        return result;
    }

    function getUnits() {
         var unitArrayStr = getCache(INIT.UNIT);
         if (unitArrayStr == null || unitArrayStr == undefined) {
            return;
         }
         var unitArray = JSON.parse(unitArrayStr);
         return unitArray;
    }

    function getTradeType () {
        $.ajax({
            url: tradeGoodsHost + "/type/trade",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,object){
                    $("#tradeType,#addTradeType,#updateTradeType,#viewTradeType").append("<option value='" +object.key+ "'>"+object.value+"</option>");
                });
            }
        });
    }

    function getSupplierType () {
        $.ajax({
            url: supplierHost + "/supplier/type",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,value){
                    $("#viewSupplierType").append("<option value='" +index+ "'>"+value+"</option>");
                });
            }
        });
    }



    function closeSupplierViewDialog(){
        closeMask();
        $("#viewSupplierDiv").hide();
    }

    function exportExcel(){
       exportExcelFile(tradeGoodsHost + '/download?'+ $("#search").serialize(), '进货/销售-明细.xlsx');
    }

    function previewImg(id){
        previewImgFromBase64(tradeGoodsHost + "/get/"+id);
    }

    function downloadImg(id){
        downloadImgFromBase64(tradeGoodsHost + "/get/img/"+id);
    }

    function getSupplierDetail(supplierUuid){
          openMask();
          $.ajax({
              url: supplierHost + "/get/supplier/"+supplierUuid,
              method: 'GET',
              success: function(obj) {
                  if (obj.code != 1) {
                      openAlert(obj.message);
                      return;
                  }
                  $("#viewSupplierDiv").show();
                  $("#viewSupplierName").val(obj.data.name);
                  $("#viewSupplierType").val(obj.data.supplierType);
//                  $("#viewServiceType").val(obj.data.serviceType);
                  $("#viewService").val(obj.data.service);
                  $("#viewMobile").val(obj.data.mobile);
                  $("#viewOtherContact").val(obj.data.otherContact);
                  $("#viewEmail").val(obj.data.email);
                  $("#viewAddress").val(obj.data.address);
                  $("#viewSupplierRemark").val(obj.data.remark);
                  $("#supplierCreateTimeStr").val(obj.data.createTimeStr);
                  $("#supplierUpdateTimeStr").val(obj.data.updateTimeStr);
              }
          });
    }

    function getGoodsSelect () {
        $.ajax({
            url: goodsHost + "/get/select",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,object){
                    $("#goodsUuid,#addGoodsUuid,#updateGoodsUuid").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
                });
            }
        });
    }

    function openAddGoodsTradeDialog(){
        openMask();
        $("#addDiv").show();
        $("#addTradeDate").val(getCurrentDate());
        $("#addNumber").focus();
    }