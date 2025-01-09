
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            if(headerType != "finance"){
                return;
            }
            openScroll = false;
            var id = getCache('id');
            if(id != null){
                $("#headerName").html("账务(查看)");
            } else {
                $("#headerName").html("账务(新增)");
                showFinanceElements();
                allowEdit();
                showUploadArea();
                $('#updateTradeDate').val(getCurrentDate());
                getTransactionType();
            }
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            if(headerType != "finance"){
                return;
            }
            var id = getCache('id');
            if(id != null){
                getFinanceDetail(id);
            } else {
                $("#updateAmount").focus();
            }
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            if(headerType != "finance"){
                return;
            }
            event.preventDefault();
            addOrUpdateFinance(this);
        });

        $("#allowEdit").on('click', function(event) {
            if(headerType != "finance"){
                return;
            }
            allowEdit();
            $("#headerName").html("账务(编辑)");
            showUploadArea();
            $(".deleteIcon").show();
            $(".getImg").hide();
            $("#updateAmount").focus();
        });

         $("#updateFlowType").on("change",function () {
             var flowType = $('#updateFlowType').val();
             getPayOrIncomeSelectUpdate(flowType);
         });
    });

    function showFinanceElements(){
        $("#updateAmountDiv, #updateFlowTypeDiv, #updateTransactionTypeDiv, #updateTradeDateDiv, #updateRemarkDiv").show();
    }

    function addOrUpdateFinance(object){
        var files = new FormData();
        files.append('file', file);
//        var title = $('#updateTitle').val();
//        if(title == '' || title.length > 32){
//            openAlert(MSG_NAME_32);
//            return;
//        }
//        files.append('title', title);
        var amount = $('#updateAmount').val();
        if(amount == ''){
            openAlert(MSG_AMOUNT_CAN_NOT_BE_NULL);
            return;
        }
        if(!checkPositive2(amount)){
            openAlert(MSG_AMOUNT_2);
            return;
        }
        files.append('amount', amount);
        var flowType = $('#updateFlowType').val();
        files.append('flowType', flowType);
        var transactionType = $('#updateTransactionType').val();
        if(transactionType == null || transactionType == ""){
            openAlert(MSG_FLOW_TYPE_MUST_CHOOSE);
            return;
        }
        files.append('transactionType', transactionType);
        var tradeDate = $("#updateTradeDate").val();
        if(tradeDate == null || tradeDate == ""){
            openAlert(MSG_DATE_MUST_CHOOSE);
            return;
        }
        files.append('tradeDate', tradeDate);
        var remark = $('#updateRemark').val();
        if(remark.length > 1024){
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
        var url = financeHost + "/update/"+id;
        if (id == undefined || id == null || id == "") {
            url = financeHost + "/add";
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
                if (obj.code == FINANCE_OUT_OF_LIMIT.CODE) {
                    openAlert(FINANCE_OUT_OF_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    return;
                }
                toCache(LIST.HEADER_TYPE, "finance");
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();
            }
        });
    }

    function getFinanceDetail(id){
        showLoadingAndOverlay();
        $.ajax({
            url: financeHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                hideLoadingAndOverlay();
                showFinanceElements();
                $("#updateId").val(obj.data.id);
                $("#updateTitle").val(obj.data.title);
                $("#updateAmount").val(obj.data.amountValue);
                var flowType = obj.data.flowType;
                $("#updateFlowType").val(flowType).selectmenu("refresh");
                var transactionType = obj.data.transactionType;
                var arr = getTransactionTypeSelect(flowType);
                if(arr == null){
                    return;
                }
                $("#updateTransactionType").empty();
                $.each(arr, function(index, object){
                    $("#updateTransactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
                });
                $("#updateTransactionType").val(transactionType).selectmenu("refresh");
                var remark = obj.data.remark
                $("#updateRemark").val(remark);
                resizeTextArea('updateRemark');

                $("#updateTradeDate").val(obj.data.tradeDate);
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

    function getPayOrIncomeSelectUpdate(flowType){
        $("#updateTransactionType").empty().selectmenu('refresh');
        var arr = getTransactionTypeSelect(flowType);
        if(arr == null){
            openAlert("请先添加收/支类型 !");
            $("#updateTransactionType").append("<option value='' selected>收/支类型(全部)</option>").selectmenu('refresh');
            return;
        }
        $.each(arr, function(index,object){
             $("#updateTransactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
             if(index == 0){
                 $('#updateTransactionType').val(object.uuid).attr('selected', true).selectmenu('refresh');
             }
        });
    }

    function getTransactionType() {
        $("#updateTransactionType").empty();
        var flowType = $('#updateFlowType').val();
        var arr = getTransactionTypeSelect(flowType);
        if(arr == null){
            openAlert("请先添加收/支类型 !");
            $("#updateTransactionType").append("<option value='' selected>收/支类型(全部)</option>").selectmenu('refresh');
            return;
        }
        $.each(arr, function(index,object){
           $("#updateTransactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
           if(index == 0){
               $('#updateTransactionType').val(object.uuid).attr('selected', true).selectmenu('refresh');
           }
        });
    }