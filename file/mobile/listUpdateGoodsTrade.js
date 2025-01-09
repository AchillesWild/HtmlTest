
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            if(headerType != "goods"){
                return;
            }
            openScroll = false;
            var id = getCache('id');
            getTheGoodsUpdate();
            getTheGoodsTradeTypeUpdate();
            getTheSupplierUpdate();
            getTheUnits();

            //--------------------------------------------------------------

            $("#updateGoodsUuidSearch").on("keydown", function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    checkInputGoodsAndSetUpdate();
                    $(this).blur();
                }
            });

            $('#updateGoodsUuidSearch').on('blur', function() {
                setTimeout(function() {
                    checkInputGoodsAndSetUpdate();
                }, 3);
            });

            function checkInputGoodsAndSetUpdate(){
                $("#updateGoodsUuidSelect").hide();
                var searchTerm = $("#updateGoodsUuidSearch").val().toLowerCase();
                if(searchTerm != ""){
                    var exist = false;
                    $('#updateGoodsUuidSelect .option').each(function() {
                        var itemText = $(this).text().toLowerCase();
                        if(searchTerm == itemText){
                            exist = true;
                            $(this).css("background", searchSelectChosenBackgroundColor);
                            var value = $(this).attr("value");
                            $('#updateGoodsUuid').val(value);
                        }
                    });
                    if(!exist){
                        $('#updateGoodsUuidSearch, #updateGoodsUuid').val("");
                        $('#updateGoodsUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                    }
                } else {
                    $("#updateGoodsUuid").val("");
                }
            }

            $('#updateGoodsUuidSearch').on('click', function() {
                $('#updateGoodsUuidSelect, #updateGoodsUuidSelect .option').show();
                $('#updateSupplierUuidSelect').hide();
            }).on('#updateGoodsUuidSearch input', function() {
                var searchTerm = $(this).val().toLowerCase();
                var exist = false;
                $('#updateGoodsUuidSelect .option').each(function() {
                    var itemText = $(this).text().toLowerCase();
                    var includes = itemText.includes(searchTerm);
                    if(searchTerm != "" && includes){
                        exist = true;
                    }
                    $(this).toggle(includes);
                });
                if(!exist){
                    $('#updateGoodsUuid').val("");
                    $('#updateGoodsUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                    setTimeout(function() {
                         $('#updateGoodsUuidSearch').val("");
                    }, 500);
                }
            });

            $('#updateGoodsUuidSelect .option').on('click', function() {
                $('#updateGoodsUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                $(this).css("background", searchSelectChosenBackgroundColor);
                $('#updateGoodsUuidSearch').val($(this).text()).change();
                $('#updateGoodsUuidSelect').fadeOut(400);
                var value = $(this).attr("value");
                $('#updateGoodsUuid').val(value)

            });

            //--------------------------------------------------------------

            $("#updateSupplierUuidSearch").on("keydown", function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    checkInputSupplierAndSetUpdate();
                    $(this).blur();
                }
            });

            $('#updateSupplierUuidSearch').on('blur', function() {
                setTimeout(function() {
                    checkInputSupplierAndSetUpdate();
                }, 3);
            });

            function checkInputSupplierAndSetUpdate(){
                $("#updateSupplierUuidSelect").hide();
                var searchTerm = $("#updateSupplierUuidSearch").val().toLowerCase();
                if(searchTerm != ""){
                    var exist = false;
                    $('#updateSupplierUuidSelect .option').each(function() {
                        var itemText = $(this).text().toLowerCase();
                        if(searchTerm == itemText){
                            exist = true;
                            $(this).css("background", searchSelectChosenBackgroundColor);
                            var value = $(this).attr("value");
                            $('#updateSupplierUuid').val(value);
                            return;
                        }
                    });
                    if(!exist){
                        $('#updateSupplierUuidSearch, #updateSupplierUuid').val("");
                        $('#updateSupplierUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                    }
                } else {
                    $("#updateSupplierUuid").val("");
                }
            }

            $('#updateSupplierUuidSearch').on('click', function() {
                $('#updateSupplierUuidSelect, #updateSupplierUuidSelect .option').show();
                $('#updateGoodsUuidSelect').hide();
            }).on('#updateSupplierUuidSearch input', function() {
                var searchTerm = $(this).val().toLowerCase();
                var exist = false;
                $('#updateSupplierUuidSelect .option').each(function() {
                    var itemText = $(this).text().toLowerCase();
                    var includes = itemText.includes(searchTerm);
                    if(searchTerm != "" && includes){
                        exist = true;
                    }
                    $(this).toggle(includes);
                });
                if(!exist){
                    $('#updateSupplierUuid').val("");
                    $('#updateSupplierUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                    setTimeout(function() {
                         $('#updateSupplierUuidSearch').val("");
                    }, 500);
                }
            });

            $('#updateSupplierUuidSelect .option').on('click', function() {
                $('#updateSupplierUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                $(this).css("background", searchSelectChosenBackgroundColor);
                $('#updateSupplierUuidSearch').val($(this).text()).change();
                $('#updateSupplierUuidSelect').fadeOut(400);
                var value = $(this).attr("value");
                $('#updateSupplierUuid').val(value)
            });

            //--------------------------------------------------------------

            if(id != null){
                $("#headerName").html("买/卖(查看)");
            } else {
                $("#headerName").html("买/卖(新增)");
                $('#updateGoodsTradeDate').val(getCurrentDate());
                showGoodsTradeElements();
                allowEdit();
                showUploadArea();
            }
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            if(headerType != "goods"){
                return;
            }
            var id = getCache('id');
            if(id != null){
                getGoodsTradeDetail(id);
            }
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            if(headerType != "goods"){
                return;
            }
            event.preventDefault();
            addOrUpdateGoodsTrade(this);
        });

        $("#allowEdit").on('click', function(event) {
            if(headerType != "goods"){
                return;
            }
            allowEdit();
            $("#headerName").html("买/卖(编辑)");
            showUploadArea();
            $(".deleteIcon").show();
            $(".getImg").hide();
        });

        $("#updateTradeType").on("change",function () {
             $('#updateSupplierUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
             $("#updateSupplierUuid, #updateSupplierUuidSearch").val("");
            if($(this).val() == 1){
                $("#updateSupplierUuidDiv, #updateSupplierUuidSelect").hide();
                $("#updatePaid").val("1").selectmenu("refresh");
            } else {
                $("#updateSupplierUuidDiv").show();
                $("#updatePaid").val("0").selectmenu("refresh");
            }
        });


    });

    function showGoodsTradeElements(){
        $("#updateGoodsUuidDiv, #updateTradeTypeDiv, #updateGoodsNumberDiv, #updateGoodsUnitDiv, #updateUnitPriceDiv, #updateSumPriceDiv, #updateGoodsTradeDateDiv, #updatePaidDiv, #updateRemarkDiv").show();
    }

  function getGoodsTradeDetail(id){
        showLoadingAndOverlay();
        $.ajax({
            url: tradeGoodsHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                hideLoadingAndOverlay();
                showGoodsTradeElements();
                $("#updateId").val(obj.data.id);
                $("#updateGoodsUuid").val(obj.data.goodsUuid);
                $('#updateGoodsUuidSelect .option[value="'+obj.data.goodsUuid+'"]').css("background", searchSelectChosenBackgroundColor);
                $("#updateGoodsUuidSearch").val(obj.data.goodsName);
                var tradeType = obj.data.tradeType;
                $("#updateTradeType").val(tradeType).selectmenu("refresh");
                $("#updateGoodsNumber").val(obj.data.number);
                $("#updateGoodsUnit").val(obj.data.unit).selectmenu("refresh");
                $("#updateUnitPrice").val(obj.data.unitPrice);
                $("#updateSumPrice").val(obj.data.sumPrice);
                if(tradeType == 0){
                    $("#updateSupplierUuidDiv").show();
                    $("#updateSupplierUuid").val(obj.data.supplierUuid);
                    $('#updateSupplierUuidSelect .option[value="'+obj.data.supplierUuid+'"]').css("background", searchSelectChosenBackgroundColor);
                    $("#updateSupplierUuidSearch").val(obj.data.supplierName);
                } else {
                    $("#updateSupplierUuidDiv").hide();
                }
                $("#updateGoodsTradeDate").val(obj.data.tradeDate);
                $("#updatePaid").val(obj.data.paid).selectmenu("refresh");
                $("#updateRemark").val(obj.data.remark);
                resizeTextArea('updateRemark');
                var imgBase64 = obj.data.compressImgUrl;
                if (imgBase64 != null && imgBase64 != '') {
                    $("#imagePreview").attr("src", imgBase64);
                    $(".getImg").show();
                    $(".deleteIcon").hide();
                    $("#imagePreviewDiv").show();
                } else {
                    $("#viewShowImg").empty();
                    $("#imagePreviewDiv").hide();
                }
                disabledAll();
                if(ifShareUser()){
                    $("#allowEdit").hide()
                }
            }
        });
    }

    function addOrUpdateGoodsTrade(object){
        var goodsUuid = $("#updateGoodsUuid").val();
        if(goodsUuid == null || goodsUuid == '' || goodsUuid.length > 32){
             openAlert(GOODS_MUST_CHOOSE);
             return;
        }

        var files = new FormData();
        files.append('file', file);
        files.append('goodsUuid', goodsUuid);
        var tradeType = $("#updateTradeType").val();
        files.append('tradeType', tradeType);
        var number = $("#updateGoodsNumber").val();
        if(number != null && number != ""){
            if(!checkPositive3(number)){
                openAlert(MSG_NUMBER_3);
                return;
            }
            files.append('number', number);
            var unit = $("#updateGoodsUnit").val();
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
        var unitPrice = $("#updateUnitPrice").val();
        if(unitPrice !='' && !checkPositive3(unitPrice)){
            openAlert(MSG_UNIT_PRICE);
            return;
        }
        files.append('unitPrice', unitPrice);
        var sumPrice = $("#updateSumPrice").val();
        if(!checkPositive2(sumPrice)){
            openAlert(MSG_SUM_PRICE);
            return;
        }
        files.append('sumPrice', sumPrice);
        var supplierUuid = $("#updateSupplierUuid").val();
        if(tradeType == 0){
            if(supplierUuid == null || supplierUuid == ""){
                openAlert(MSG_SUPPLIER_MUST_CHOOSE);
                return;
            }
        } else {
            supplierUuid = "";
        }
        files.append('supplierUuid', supplierUuid);
        var tradeDate = $("#updateGoodsTradeDate").val();
        if(tradeDate == null || tradeDate == ""){
            openAlert(MSG_DATE_MUST_CHOOSE);
            return;
        }
        files.append('tradeDate', tradeDate);
        files.append('paid', $("#updatePaid").val());
        var remark = $("#updateRemark").val();
        if(remark != '' && remark.length > 1024){
            openAlert(MSG_REMARK_1024);
            return;
        }
        files.append('remark', remark);
        var imgUrl = $("#imagePreview").attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
        var id = $("#updateId").val();
        var url = tradeGoodsHost + "/update/"+id;
        if (id == undefined || id == null || id == "") {
            url = tradeGoodsHost + "/add";
        }
        showLoadingAndOverlay();
        $.ajax({
            url: url,
            type: 'POST',
            data: files,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code == GOODS_TRADE_OUT_OF_LIMIT.CODE) {
                    openAlert(GOODS_TRADE_OUT_OF_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                toCache(LIST.HEADER_TYPE, "goods");
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();
            }
        });
    }

    function getTheGoodsUpdate() {
        $("#updateGoodsUuidSelect").empty();
        var goodsArray = getTheGoodsSelect();
        if(goodsArray == null){
            openAlert("请先定义商品 !");
            return;
        }
        $.each(goodsArray, function(index, object){
           $("#updateGoodsUuidSelect").append("<div class='option' value='" +object.uuid+ "'>"+object.name+"</option>");
        });
    }

    function getTheGoodsTradeTypeUpdate() {
        $("#updateTradeType").empty();
        var goodsTradeTypeArray = getGoodsTradeType();
        $.each(goodsTradeTypeArray, function(index, object){
            $("#updateTradeType").append("<option value='" +object.key+ "'>"+object.value+"</option>");
            if(index == 0){
               $('#updateTradeType').val(object.key).attr('selected', true).selectmenu('refresh');
            }
        });
    }

    function getTheSupplierUpdate() {
        $("#updateSupplierUuidSelect").empty();
         var arr = getTheSupplierSelect();
         if(arr == null){
             return;
         }
         $.each(arr, function(index, object){
           $("#updateSupplierUuidSelect").append("<div class='option' value='" +object.uuid+ "'>"+object.name+"</option>");
         });
    }

    function getTheUnits() {
        $("#updateGoodsUnit").empty();
        var unitArray = getUnits();
        $.each(unitArray, function(index, object){
            if (index == 0) {
                $("#updateGoodsUnit").append("<option value=''>单位(全部)</option>").selectmenu('refresh');
            }
            $("#updateGoodsUnit").append("<option value='" +object.unit+ "'>"+object.unitValue+"</option>");
        });
    }