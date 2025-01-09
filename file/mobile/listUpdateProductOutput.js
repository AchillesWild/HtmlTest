
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            if(headerType != "product"){
                return;
            }
            openScroll = false;
            var id = getCache('id');

             //--------------------------------------------------------------

            $("#updateProductUuidSearch").on("keydown", function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    checkInputProductAndSetUpdate();
                    $(this).blur();
                }
            });

            $('#updateProductUuidSearch').on('blur', function() {
                setTimeout(function() {
                    checkInputProductAndSetUpdate();
                    var productUuid = $('#updateProductUuid').val();
                    changeProduct(productUuid);
                }, 3);
            });

            function checkInputProductAndSetUpdate(){
                $("#updateProductUuidSelect").hide();
                var searchTerm = $("#updateProductUuidSearch").val().toLowerCase();
                if(searchTerm != ""){
                    var exist = false;
                    $('#updateProductUuidSelect .option').each(function() {
                        var itemText = $(this).text().toLowerCase();
                        if(searchTerm == itemText){
                            exist = true;
                            $(this).css("background", searchSelectChosenBackgroundColor);
                            var value = $(this).attr("value");
                            $('#updateProductUuid').val(value);
                            return;
                        }
                    });
                    if(!exist){
                        $('#updateProductUuidSearch, #updateProductUuid').val("");
                        $('#updateProductUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                    }
                } else {
                    $("#updateProductUuid").val("");
                }
            }

             $('#updateProductUuidSearch').on('click', function() {
                 $('#updateProductUuidSelect, #updateProductUuidSelect .option').show();
             }).on('#updateProductUuidSearch input', function() {
                 var searchTerm = $(this).val().toLowerCase();
                 var exist = false;
                 $('#updateProductUuidSelect .option').each(function() {
                     var itemText = $(this).text().toLowerCase();
                     var includes = itemText.includes(searchTerm);
                     if(searchTerm != "" && includes){
                         exist = true;
                     }
                     $(this).toggle(includes);
                 });
                 if(!exist){
                     $('#updateProductUuid').val("");
                     $('#updateProductUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
                    setTimeout(function() {
                         $('#updateProductUuidSearch').val("");
                    }, 500);
                 }
             });

            if(id != null){
                $("#headerName").html("计量(查看)");
            } else {
                getProductSelectUpdate();
                $("#headerName").html("计量(新增)");
                showProductOutputElements();
                allowEdit();
                changeProduct($("#updateProductUuid").val());
                $('#updateProductionDate').val(getCurrentDate());
            }
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            if(headerType != "product"){
                return;
            }
            var id = getCache('id');
            if(id != null){
                getProductOutDetail(id);
            }
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            if(headerType != "product"){
                return;
            }
            event.preventDefault();
            addOrUpdateProductOutput(this);
        });

        $("#allowEdit").on('click', function(event) {
            if(headerType != "product"){
                return;
            }
            allowEdit();
            $("#headerName").html("计量(编辑)");
        });
    });

    function showProductOutputElements(){
        $("#updateProductUuidDiv, #updateUnitDiv, #updateNumberDiv, #updateProductionDateDiv, #updateRemarkDiv").show();
    }

    function changeProduct(productUuid){
         $('#updateUnit').empty().selectmenu('refresh');
        if(productUuid == null || productUuid == "" || productUuid == undefined){
            return;
        }
        var arr = getTheProductSelect();
        if(arr == null){
            return;
        }
        $.each(arr, function(index, object){
             if(productUuid == object.uuid){
                 $("#updateUnit").append("<option value='" +object.isInteger+ "'>"+object.unitValue+"</option>").selectmenu('refresh');
                 return;
             }
        });
    }

    function getProductOutDetail(id){
        showLoadingAndOverlay();
        $.ajax({
            url: outputHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                hideLoadingAndOverlay();
                showProductOutputElements();
                $("#updateId").val(obj.data.id);
                $("#updateProductUuid").empty();

                var arr = getTheProductSelect();
                if(arr == null){
                    return;
                }
                $("#updateProductUuidSelect").empty();
                $.each(arr, function(index, object){
                     $("#updateProductUuidSelect").append("<div class='option' value='" +object.uuid+ "'>"+object.name+"</option>");
                });
                bindClickOption();
                $("#updateProductUuid").val(obj.data.productUuid);
                $("#updateProductUuidSearch").val(obj.data.productName);
                $('#updateProductUuidSelect .option[value="'+obj.data.productUuid+'"]').css("background", searchSelectChosenBackgroundColor);

                $("#updateUnit").empty().append("<option value='" +obj.data.isInteger+ "'>"+obj.data.unitValue+"</option>").selectmenu("refresh");
                $("#updateNumber").val(obj.data.number);
                $("#updateProductionDate").val(obj.data.productionDate);
                $("#updateRemark").val(obj.data.remark);
                resizeTextArea('updateRemark');
                disabledAll();
                if(ifShareUser()){
                    $("#allowEdit").hide()
                }
            }
        });
    }

    function addOrUpdateProductOutput(object){
        var productUuid = $("#updateProductUuid").val();
        if(productUuid == null || productUuid == ""){
             openAlert(MSG_PRODUCT_MUST_CHOOSE);
             return;
        }
        var number = $("#updateNumber").val();
        if(number == null || number == ""){
             openAlert(MSG_NUMBER_CAN_NOT_BE_NULL);
             return;
        }
        var isInteger = $("#updateUnit").val();
        if (isInteger == 1) {
             if(!checkPositive(number)){
                 openAlert(MSG_UNIT_MUST_INTEGER);
                 return;
             }
        } else {
         if(!checkPositive3(number)){
             openAlert(MSG_NUMBER_3);
             return;
         }
        }
        var productionDate = $("#updateProductionDate").val();
        if(productionDate == null || productionDate == ""){
            openAlert(MSG_DATE_MUST_CHOOSE);
            return;
        }
        var remark = $("#updateRemark").val();
        if(remark != '' && remark.length > 1024){
            openAlert(MSG_REMARK_1024);
            return;
        }
        let output = {
                "productUuid": productUuid,
                     "number": number,
             "productionDate": productionDate,
                     "remark": remark
                 };

        var id = $("#updateId").val();
        var url = outputHost + "/update/"+id;
        if (id == undefined || id == null || id == "") {
            url = outputHost + "/add";
        }
        showLoadingAndOverlay();
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(output),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                hideLoadingAndOverlay();
                if (obj.code == PRODUCT_OUTPUT_OUT_OF_LIMIT.CODE) {
                    openAlert(PRODUCT_OUTPUT_OUT_OF_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                toCache(LIST.HEADER_TYPE, "product");
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();
            }
        });
    }

    function getProductSelectUpdate(){
        $("#updateProductUuidSelect").empty();
        var arr = getTheProductSelect();
        if(arr == null){
            $('#updateProductUuid').val("");
            $("#updateProductUuidSearch").val("");
            $('#updateUnit').val("").attr('selected', true).selectmenu('refresh');
            openAlert("请先定义计量物 !");
            return;
        }
        $.each(arr, function(index,object){
            $("#updateProductUuidSelect").append("<div class='option' value='" +object.uuid+ "'>"+object.name+"</option>");
        });

        bindClickOption();
    }

    function bindClickOption(){
         $('#updateProductUuidSelect .option').on('click', function() {
             $('#updateProductUuidSelect .option').css("background", searchSelectDefaultBackgroundColor);
             $(this).css("background", searchSelectChosenBackgroundColor);
             $('#updateProductUuidSearch').val($(this).text()).change();
             $('#updateProductUuidSelect').fadeOut(400);
             var value = $(this).attr("value");
             $('#updateProductUuid').val(value)
             changeProduct(value);
         });
    }