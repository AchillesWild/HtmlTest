
    let currentPage = 1;
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
                 url: supplierHost + "/get/"+$(this).val(),
                 method: 'GET',
                 success: function(obj) {
                     if (obj.code != 1) {
                         openAlert(obj.message);
                         return;
                     }
                     $("#viewDiv").show();
                     $("#viewName").val(obj.data.name);
                     $("#viewSupplierType").val(obj.data.supplierType);
                     $("#viewSort").val(obj.data.sort);
                     $("#viewService").val(obj.data.service);
                     $("#viewMobile").val(obj.data.mobile);
                     $("#viewOtherContact").val(obj.data.otherContact);
                     $("#viewEmail").val(obj.data.email);
                     $("#viewAddress").val(obj.data.address);
                     $("#viewRemark").val(obj.data.remark);
                     $("#createTimeStr").val(obj.data.createTimeStr);
                     $("#updateTimeStr").val(obj.data.updateTimeStr);
                 }
             });
        });

        $(document).on('click', '#editBtn', function() {
             openMask();
             $.ajax({
                 url: supplierHost + "/get/"+$(this).val(),
                 method: 'GET',
                 success: function(obj) {
                     if (obj.code != 1) {
                         openAlert(obj.message);
                         return;
                     }
                     $("#updateDiv").show();
                     $("#updateId").val(obj.data.id);
                     $("#updateName").val(obj.data.name);
                     $("#updateSupplierType").val(obj.data.supplierType);
                     $("#updateSort").val(obj.data.sort);
                     $("#updateService").val(obj.data.service);
                     $("#updateMobile").val(obj.data.mobile);
                     $("#updateOtherContact").val(obj.data.otherContact);
                     $("#updateEmail").val(obj.data.email);
                     $("#updateAddress").val(obj.data.address);
                     $("#updateRemark").val(obj.data.remark);
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
                        url: supplierHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code == HAS_RELATED_DATA) {
                                openAlert(SUPPLIER_HAS_RELATED_DATA);
                                return;
                            }
                            if (obj.code != 1) {
                                openAlert("删除失败 !");
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

        getSupplierType ();
    });

    function addOrUpdate(prefix){
		var idPrefix = '#' + prefix;
        var name = $(idPrefix + "Name").val();
        if(name == '' || name.length > 32){
            openAlert(MSG_NAME_32);
            return;
        }
        var service = $(idPrefix + "Service").val();
        if(service != '' && service.length > 512){
            openAlert(MSG_PRODUCT_512);
            return;
        }
        var mobile = $(idPrefix + "Mobile").val();
        if(mobile != '' && mobile.length > 64){
            openAlert(MSG_CONTACT_64);
            return;
        }
        var otherContact = $(idPrefix + "OtherContact").val();
        if(otherContact != '' && otherContact.length > 128){
            openAlert(MSG_OTHER_CONTACT_128);
            return;
        }
        var email = $(idPrefix + "Email").val();
        if(email != '' && email.length > 128){
            openAlert(MSG_EMAIL);
            return;
        }
        var address = $(idPrefix + "Address").val();
        if(address != '' && address.length > 128){
            openAlert(MSG_ADDRESS);
            return;
        }
        var remark = $(idPrefix + "Remark").val();
        if(remark != '' && remark.length > 64){
            openAlert(MSG_REMARK_64);
            return;
        }
         var sort = $(idPrefix + "Sort").val();
         if(sort != '' && !checkPositiveAndZero(sort)){
             openAlert(MSG_ORDER_CHECK);
             return;
         }
        let supplier = {
                    "name": name,
            "supplierType": $(idPrefix + "SupplierType").val(),
                    "sort": sort,
                 "service": service,
                  "mobile": mobile,
            "otherContact": otherContact,
                   "email": email,
                 "address": address,
                  "remark": remark
                 };
        var url = supplierHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = supplierHost + "/add";
        }
        $(idPrefix + "Btn").attr('disabled',"disabled");
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(supplier),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                $(idPrefix + "Btn").removeAttr('disabled');
                if (obj.code == NAME_HAS_EXISTED.CODE) {
                     openAlert(NAME_HAS_EXISTED.MSG);
                     return;
                }
                if (obj.code != 1) {
                    openAlert("新增失败 !");
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

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        $.ajax({
            url: supplierHost + "/list",
            method: 'GET',
            data: $("#search").serialize() + "&pageNo="+currentPage+ "&pageSize="+pageSize,
            success: function(obj) {
                loadingGifFadeOut();
                if (obj.code == NO_DATA.CODE && currentPage > 1) {
                    currentPage = currentPage - 1;
                    fetchData(currentPage);
                    return;
                }
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
                    let supplier = list[i];
                    var id = supplier['id'];
                    var name = supplier['name'];
                    var supplierTypeValue = supplier['supplierTypeValue'];
                    var sort = supplier['sort'];
                    var service = supplier['service'] == null ? '' : supplier['service'];
                    var address = supplier['address'] == null ? '' : supplier['address'];
                    var mobile = supplier['mobile'] == null ? '' : supplier['mobile'];
                    var remark = supplier['remark'] == null ? '' : supplier['remark'];
//                    var createTimeStr = supplier['createTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+name+"</td>"
                                   + "<td>"+supplierTypeValue+"</td>"
                                   + "<td>"+sort+"</td>"
                                   + "<td>"+service+"</td>"
                                   + "<td>"+address+"</td>"
                                   + "<td>"+remark+"</td>"
//                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td><button id='viewBtn' style='margin-right: 4px' value='"+id+"'>详细</button>"
                                   + "<button id='editBtn' style='margin-right: 4px' value='"+id+"'>修改</button>"
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

    function getSupplierType () {
        $.ajax({
            url: supplierHost + "/supplier/type",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,value){
                    $("#supplierType,#addSupplierType,#updateSupplierType,#viewSupplierType").append("<option value='" +index+ "'>"+value+"</option>");
                });
            }
        });
    }

    function exportExcel(){
        exportExcelFile(supplierHost + '/download?'+ $("#search").serialize(), '供应商信息.xlsx');
    }