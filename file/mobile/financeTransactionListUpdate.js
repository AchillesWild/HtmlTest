
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            $("#back").show();
            openScroll = false;
            var id = getCache('id');
            if(id != null){
                $("#headerName").html("收/支类型(查看)");
                getDetail(id);
                disabledAll();
               if(ifShareUser()){
                    $("#allowEdit").hide()
               }
            } else {
                $("#headerName").html("收/支类型(新增)");
                allowEdit();
            }
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            var id = getCache('id');
            if(id == null){
                $("#updateName").focus();
            }
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate();
        });

        $("#allowEdit").on('click', function(event) {
            allowEdit();
            $("#updateName").focus();
            $("#headerName").html("收/支类型(编辑)");
        });

    });

    function addOrUpdate(){
        var name = $("#updateName").val();
        if(name == '' || name.length > 16){
            openAlert(MSG_PAY_OR_INCOME_NAME_CHECK);
            return;
        }
        var sort = $("#updateSort").val();
        if(sort != null && sort != ''){
            if(!checkPositiveAndZero(sort)){
                openAlert(MSG_ORDER_CHECK);
                return;
            }
        }
        let transactionTypeObj = {
                    "name": name,
                    "sort": sort,
                "flowType": $("#updateFlowType").val()
                 };
        var id = $("#updateId").val();
        var url = transactionTypeHost + "/update/"+id;
        if (id == undefined || id == null || id == "") {
            url = transactionTypeHost + "/add";
        }
        showLoadingAndOverlay();
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(transactionTypeObj),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code == NAME_HAS_EXISTED.CODE) {
                     openAlert(NAME_HAS_EXISTED.MSG);
                     return;
                }
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                removeTransactionTypeCache();
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();

            }
        });
    }

    function getDetail(id){
        $.ajax({
            url: transactionTypeHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                 $("#updateId").val(obj.data.id);
                 $("#updateName").val(obj.data.name);
                 $("#updateSort").val(obj.data.sort);
                 $("#updateFlowType").val(obj.data.flowType).selectmenu("refresh");
            }
        });
    }
