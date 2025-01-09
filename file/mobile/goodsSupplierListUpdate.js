
    $(document).ready(function() {

        $(document).on('pagebeforeshow', '#getOrUpdate', function() {
            ifToLoginByLocalToken();
            $("#back").show();
            openScroll = false;
            getUpdateTheGoodsSupplierType();
            var id = getCache('id');
            if(id != null){
                $("#headerName").html("供应商(查看)");
                getDetail(id);
                disabledAll();
               if(ifShareUser()){
                    $("#allowEdit").hide()
               }
            } else {
                $("#headerName").html("供应商(新增)");
                allowEdit();
            }
        });

        $("#addOrUpdateBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdateSupplier();
        });

        $(document).on('pageshow', '#getOrUpdate', function() {
            var id = getCache('id');
            if(id == null){
                $("#updateName").focus();
            }
        });

        $("#allowEdit").on('click', function(event) {
            allowEdit();
            $("#updateName").focus();
            $("#headerName").html("供应商(编辑)");
        });

    });

    function getDetail(id){
        $.ajax({
            url: supplierHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                 $("#updateId").val(obj.data.id);
                 $("#updateName").val(obj.data.name);
                 $("#updateSort").val(obj.data.sort);
                 $("#updateSupplierType").val(obj.data.supplierType).selectmenu("refresh");
                 $("#updateService").val(obj.data.service);
                 $("#updateMobile").val(obj.data.mobile);
                 $("#updateOtherContact").val(obj.data.otherContact);
                 $("#updateEmail").val(obj.data.email);
                 $("#updateAddress").val(obj.data.address);
                 $("#updateRemark").val(obj.data.remark);
            }
        });
    }

    function addOrUpdateSupplier(){
        var name = $("#updateName").val();
        if(name == '' || name.length > 32){
            openAlert(MSG_NAME_32);
            return;
        }
        var service = $("#updateService").val();
        if(service != '' && service.length > 512){
            openAlert(MSG_PRODUCT_512);
            return;
        }
        var mobile = $("#updateMobile").val();
        if(mobile != '' && mobile.length > 64){
            openAlert(MSG_CONTACT_64);
            return;
        }
        var otherContact = $("#updateOtherContact").val();
        if(otherContact != '' && otherContact.length > 128){
            openAlert(MSG_OTHER_CONTACT_128);
            return;
        }
        var email = $("#updateEmail").val();
        if(email != '' && email.length > 128){
            openAlert(MSG_EMAIL);
            return;
        }
        var address = $("#updateAddress").val();
        if(address != '' && address.length > 128){
            openAlert(MSG_ADDRESS);
            return;
        }
        var remark = $("#updateRemark").val();
        if(remark != '' && remark.length > 64){
            openAlert(MSG_REMARK_64);
            return;
        }
        var sort = $("#updateSort").val();
        if(sort != '' && !checkPositiveAndZero(sort)){
             openAlert(MSG_ORDER_CHECK);
             return;
        }
        let supplier = {
                    "name": name,
            "supplierType": $("#updateSupplierType").val(),
                    "sort": sort,
                 "service": service,
                  "mobile": mobile,
            "otherContact": otherContact,
                   "email": email,
                 "address": address,
                  "remark": remark
                 };
        var id = $("#updateId").val();
        var url = supplierHost + "/update/"+id;
        if (id == undefined || id == null || id == "") {
            url = supplierHost + "/add";
        }
        showLoadingAndOverlay();
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(supplier),
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
                removeSupplierCache();
                if (id == null || id == "") {
                    id = obj.data.id;
                    toCache('id', id);
                }
                toCache('justUpdated', 1);
                $("#back").click();
            }
        });
    }

     function getUpdateTheGoodsSupplierType() {
        if($('#updateSupplierType').children().length > 0){
            return;
        }
        var goodsSupplierTypeArray = getGoodsSupplierType();
        $.each(goodsSupplierTypeArray, function(index, value){
            $("#updateSupplierType").append("<option value='" +index+ "'>"+value+"</option>");
               if(index == 0){
                   $('#updateSupplierType').val(index).attr('selected', true).selectmenu('refresh');
               }
        });
     }
