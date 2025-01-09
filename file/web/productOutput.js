
    var currentPage = 1;
    var file;
	$(document).ready(function() {

	    if(!ifShareUser()){
    	   showBtn();
       }

        getProductSelect();

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
                url: outputHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewProductUuid").val(obj.data.productName);
                    $("#viewNumber").val(obj.data.number);
                    $("#viewUnit").val(obj.data.unitValue);
                    $("#viewProductionDate").val(obj.data.productionDate);
                    $("#viewRemark").val(obj.data.remark);
                }
            });
        });

        $(document).on('click', '#editBtn', function() {
            openMask();
            $("#updateUnit").empty();
            $.ajax({
                url: outputHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#updateDiv").show();
                    $("#updateId").val(obj.data.id);
                    $("#updateProductUuid").empty();
                    $.ajax({
                        url: productHost + "/get/select",
                        method: 'GET',
                        success: function(productObj) {
                           var arr = productObj.data;
                           if (arr == undefined || arr.length == 0) {
                                return;
                           }
                           $.each(arr, function(index,object){
                                var option = "<option value='" +object.uuid+ "'>"+object.name+"</option>";
                                $("#updateProductUuid").append(option);
//                                if (index == 0) {
//                                    $("#updateUnit").append("<option value='" +object.isInteger+ "'>"+object.unitValue+"</option>");
//                                }
                           });
                           $("#updateProductUuid").val(obj.data.productUuid);
                        }
                    });

                    $("#updateUnit").val(obj.data.unit);
                    $("#updateUnit").append("<option value='" +obj.data.isInteger+ "'>"+obj.data.unitValue+"</option>");
                    $("#updateNumber").val(obj.data.number);
                    $("#updateProductionDate").val(obj.data.productionDate);
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
                        url: outputHost + "/delete/"+id,
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
                url: outputHost + "/copy/"+$(this).val(),
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

        $("#addProductUuid").on("change",function () {
           changeAddProductUuid($(this).val());
        });
;
        $("#updateProductUuid").on("change",function () {
            changeUpdateProductUuid($(this).val());
        });

    });

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        var productUuid = $("#productUuid").val();
        if(productUuid == null || productUuid == ""){
            $("#sum").hide();
        } else {
            $("#sum").show();
            getSum();
        }
        $.ajax({
            url: outputHost + "/list",
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
                    let output = list[i];
                    var id = output['id'];
                    var productUuid = output['productUuid'];
                    var productName = output['productName'];
                    productName = "<a href='javascript:void(0)' title='点击查看商品' onclick='getProductDetail(\""+productUuid+"\")'>"+productName+"</a>";
                    var numberStr = output['numberStr'] == null ? "" : output['numberStr'];
//                    var unitValue = output['unitValue'];
                    var productionDate = output['productionDate'];
                    var remark = output['remark'] == null ? '' : output['remark'];
//                    var createTimeStr = output['createTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+productName+"</td>"
                                   + "<td>"+numberStr+"</td>"
//                                   + "<td>"+unitValue+"</td>"
                                   + "<td>"+productionDate+"</td>"
                                   + "<td>"+remark+"</td>"
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
        var productUuid = $(idPrefix + "ProductUuid").val();
        if(productUuid == null){
             openAlert(MSG_PRODUCT_MUST_CHOOSE);
             return;
        }
        var number = $(idPrefix + "Number").val();
        var isInteger = $(idPrefix + "Unit").val();
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
        var productionDate = $(idPrefix + "ProductionDate").val();
        if(productionDate == null || productionDate == ""){
            openAlert(MSG_DATE_MUST_CHOOSE);
            return;
        }
        var remark = $(idPrefix + "Remark").val();
        if(remark != '' && remark.length > 1024){
            openAlert(MSG_REMARK_1024);
            return;
        }
        let output = {
                "productUuid": productUuid,
                     "number": $(idPrefix + "Number").val(),
             "productionDate": $(idPrefix + "ProductionDate").val(),
                     "remark": remark
                 };
        var url = outputHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = outputHost + "/add";
        }
        $(idPrefix + "Btn").attr('disabled',"disabled");
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(output),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                $(idPrefix + "Btn").removeAttr('disabled');
                if (obj.code == PRODUCT_OUTPUT_OUT_OF_LIMIT.CODE) {
                    openAlert(PRODUCT_OUTPUT_OUT_OF_LIMIT.MSG);
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

    function exportExcel(){
       exportExcelFile(outputHost + '/download?'+ $("#search").serialize(), '计量-明细.xlsx');
    }

    function getProductSelect() {
        if($("#productUuid").children().length > 1){
            return;
        }
        $.ajax({
            url: productHost + "/get/select",
            method: 'GET',
            success: function(obj) {
               var arr = obj.data;
               $.each(arr,function(index,object){
                   $("#productUuid,#addProductUuid,#updateProductUuid").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
                    if (index == 0) {
                        $("#addUnit,#updateUnit").append("<option value='" +object.isInteger+ "'>"+object.unitValue+"</option>");
                    }
               });
            }
        });
    }

    function changeAddProductUuid(productUuid){
        $("#addUnit").empty();
        $.ajax({
            url: productHost + "/get/unit?uuid="+productUuid,
            method: 'GET',
            success: function(obj) {
               $("#addUnit").append("<option value='" +obj.data.isInteger+ "'>"+obj.data.unitValue+"</option>");
            }
        });
    }

    function changeUpdateProductUuid(productUuid){
        $("#updateUnit").empty();
        $.ajax({
            url: productHost + "/get/unit?uuid="+productUuid,
            method: 'GET',
            success: function(obj) {
               $("#updateUnit").append("<option value='" +obj.data.isInteger+ "'>"+obj.data.unitValue+"</option>");
            }
        });
    }

    function openAddOutputDialog(){
        openMask();
        $("#addProductionDate").val(getCurrentDate());
        $("#addDiv").show();
        $("#addNumber").focus();
    }

    function getProductDetail(uuid){
          openMask();
          $.ajax({
              url: productHost + "/get?uuid="+uuid,
              method: 'GET',
              success: function(obj) {
                  if (obj.code != 1) {
                      openAlert(obj.message);
                      return;
                  }
                  $("#viewProductDiv").show();
                  $("#viewName").val(obj.data.name);
                  $("#viewCode").val(obj.data.code);
                  $("#viewDescription").val(obj.data.description);
                  $("#createTimeStr").val(obj.data.createTimeStr);
                  $("#updateTimeStr").val(obj.data.updateTimeStr);
                  var imgBase64 = obj.data.compressImgUrl;
                  if (imgBase64 != null && imgBase64 != '') {
                        showPreview('view', imgBase64);
                      $("#imgViewDiv").show();
                  } else {
                      $("#showImg").empty();
                      $("#imgViewDiv").hide();
                  }
              }
          });
    }

    function closeProductViewDialog(){
        closeMask();
        $("#viewProductDiv").hide();
    }

     function getSum() {
        var params = $("#search").serialize();
        $.ajax({
            url: outputHost + "/get/sum",
            method: 'GET',
            data: params,
            success: function(obj) {
                $("#sumNumber").html(obj.data.sumNumber);
            }
        });
     }