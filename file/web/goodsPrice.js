
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
                url: goodsPriceListHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewGoodsName").val(obj.data.goodsName);
                    $("#viewNumber").val(obj.data.number);
                    $("#viewUnit").val(obj.data.unit);
                    $("#viewPurchasePrice").val(obj.data.purchasePrice);
                    $("#viewSellingPrice").val(obj.data.sellingPrice);
                    $("#viewSupplierName").val(obj.data.supplierName);
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
                url: goodsPriceListHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert(obj.message);
                        return;
                    }
                    $("#updateDiv").show();
                    $("#updateId").val(obj.data.id);
                    $("#updateGoodsUuid").val(obj.data.goodsUuid);
                    $("#updateNumber").val(obj.data.number);
                    $("#updateUnit").val(obj.data.unit);
                    $("#updatePurchasePrice").val(obj.data.purchasePrice);
                    $("#updateSellingPrice").val(obj.data.sellingPrice);
                    $("#updateSupplierUuid").val(obj.data.supplierUuid);
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
            if (!confirm("您确定删除吗 !")) {
                return;
            }
            event.preventDefault();
            $.ajax({
                url: goodsPriceListHost + "/delete/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert("删除失败!");
                        return;
                    }
                    fetchData(currentPage);
                }
            });
        });

        $("form").submit(function(event) {
            event.preventDefault();
        });

        $(document).on('click', "#copyBtn", function() {
            event.preventDefault();
            $.ajax({
                url: goodsPriceListHost + "/copy/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert(obj.message);
                        return;
                    }
                    currentPage = 1;
                    fetchData(currentPage);
                }
            });
        });
        getSupplierSelect();
        getUnit ();
//        getSupplierType ();
        getGoodsSelect ();
    });

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        $.ajax({
            url: goodsPriceListHost + "/list",
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
                if (obj.code != 1) {
                    return;
                }
                var count = obj.data.count;
                var total = obj.data.total;
                var totalPage = total % pageSize == 0 ? (total / pageSize) : (Math.floor(total / pageSize) + 1);
                var list = obj.data.list;
                var num = (currentPage - 1) * pageSize;
                for (let i = 0; i < count; i++) {
                    num++;
                    let goods = list[i];
                    var id = goods['id'];
                    var goodsName = goods['goodsName'];
                    var unitValue = goods['unitValue'];
                    var purchasePrice = goods['purchasePrice'] == null ? '' : goods['purchasePrice'];;
                    var sellingPrice = goods['sellingPrice'] == null ? '' : goods['sellingPrice'];
                    var margin = goods['margin'];
                    var marginPercent = goods['marginPercent'];
                    var interest = margin + "<label style='font-weight:bold'>/</label>" + marginPercent;
                    var supplierUuid = goods['supplierUuid'];
                    var supplierName = goods['supplierName'];
                    supplierName = "<a href='javascript:void(0)' title='点击查看供应商信息' onclick='getSupplierDetail(\""+supplierUuid+"\")'>"+supplierName+"</a>";
                    var remark = goods['remark'] == null ? '' : goods['remark'];
                    var hasImg = goods['hasImg'];
                    if (hasImg == 1) {
                        hasImg = "<a href='javascript:void(0)' title='点击预览图片' onclick='previewImg(\""+id+"\")'>预览</a>"
                               + "&nbsp;&nbsp;"
                               + "<a href='javascript:void(0)' title='点击下载原图' onclick='downloadImg(\""+id+"\")'>下载</a>";
                    } else {
                        hasImg = '';
                    }
                    var createTimeStr = goods['createTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+goodsName+"</td>"
                                   + "<td>"+unitValue+"</td>"
                                   + "<td>"+purchasePrice+"</td>"
                                   + "<td>"+sellingPrice+"</td>"
                                   + "<td>"+interest+"</td>"
                                   + "<td>"+supplierName+"</td>"
                                   + "<td>"+remark+"</td>"
                                   + "<td>"+hasImg+"</td>"
                                   + "<td>"+createTimeStr+"</td>"
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
             alert('商品必选(如果下拉菜单为空，请先添加商品)!');
             return;
         }
          var supplierUuid = $(idPrefix + "SupplierUuid").val();
          if(supplierUuid == null || supplierUuid == ""){
              alert('请选择供应商,如果无供应商可选,请先维护供应商信息!');
              return;
          }
         var files = new FormData();
         files.append('file', file);
         files.append('goodsUuid', goodsUuid);
          files.append('supplierUuid', supplierUuid);
         files.append('type', $(idPrefix + "Type").val());
         files.append('number', $(idPrefix + "Number").val());
         files.append('unit', $(idPrefix + "Unit").val());
         var purchasePrice = $(idPrefix + "PurchasePrice").val();
         if(!checkPositive3(purchasePrice)){
             alert('进价金额不能为空,且只能为正数(最多3位小数)!');
             return;
         }
         files.append('purchasePrice', purchasePrice);
         var sellingPrice = $(idPrefix + "SellingPrice").val();
         if(!checkPositive3(sellingPrice)){
             alert('售价金额不能为空,且只能为正数(最多3位小数)!');
             return;
         }
         files.append('sellingPrice', sellingPrice);
         var remark = $(idPrefix + "Remark").val();
         if(remark != '' && remark.length > 128){
             alert('备注长度不能超过128个字符!');
             return;
         }
         files.append('remark', remark);

         var imgUrl = $(idPrefix + "ImgPreview").attr('src');
         var hasImg = "0";
         if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
             hasImg = "1";
         }
         files.append('hasImg', hasImg);
        var url = goodsPriceListHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = goodsPriceListHost + "/add";
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
                 if (obj.code != 1) {
                     alert("保存失败 !");
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
                $.each(arr,function(index, object){
                    $("#addUnit,#updateUnit,#viewUnit").append("<option value='" +object.unit+ "'>"+object.unitValue+"</option>");
                });
            }
        });
    }

//    function getSupplierType () {
//        $.ajax({
//            url: supplierHost + "/supplier/type",
//            method: 'GET',
//            success: function(obj) {
//                var arr = obj.data;
//                $.each(arr,function(index,value){
//                    $("#viewSupplierType").append("<option value='" +index+ "'>"+value+"</option>");
//                });
//            }
//        });
//    }

    function closeSupplierViewDialog(){
        closeMask();
        $("#viewSupplierDiv").hide();
    }

    function exportExcel(){
       exportExcelFile(goodsPriceListHost + '/download?'+ $("#search").serialize(), '商品信息.xlsx');
    }

    function previewImg(id){
        previewImgFromBase64(goodsPriceListHost + "/get/"+id);
    }

    function downloadImg(id){
        downloadImgFromBase64(goodsPriceListHost + "/get/img/"+id);
    }

    function getSupplierDetail(supplierUuid){
          openMask();
          $.ajax({
              url: supplierHost + "/get/supplier/"+supplierUuid,
              method: 'GET',
              success: function(obj) {
                  if (obj.code != 1) {
                      alert(obj.message);
                      return;
                  }
                  $("#viewSupplierDiv").show();
                  $("#viewName").val(obj.data.name);
                  $("#viewSupplierTypeValue").val(obj.data.supplierTypeValue);
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
//        if($("#goodsUuid").children().length > 0){
//            return;
//        }
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