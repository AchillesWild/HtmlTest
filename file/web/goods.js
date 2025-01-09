
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
                url: goodsHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewName").val(obj.data.name);
                    $("#viewCode").val(obj.data.code);
                    $("#viewSort").val(obj.data.sort);
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
                url: goodsHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#updateDiv").show();
                    $("#updateId").val(obj.data.id);
                    $("#updateName").val(obj.data.name);
                    $("#updateCode").val(obj.data.code);
                    $("#updateSort").val(obj.data.sort);
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
                        url: goodsHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code == HAS_RELATED_DATA) {
                                openAlert(GOODS_HAS_RELATED_DATA);
                                return;
                            }
                            if (obj.code != 1) {
                                openAlert("删除失败!");
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

    });

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        $.ajax({
            url: goodsHost + "/list",
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
                    let goods = list[i];
                    var id = goods['id'];
                    var name = goods['name'];
                    var code = goods['code'] == null ? "" : goods['code'];
                    var sort = goods['sort'];
                    var hasImg = goods['hasImg'];
                    if (hasImg == 1) {
                        hasImg = "<a href='javascript:void(0)' title='点击预览图片' onclick='previewImg(\""+id+"\")'>预览</a>"
                               + "&nbsp;&nbsp;"
                               + "<a href='javascript:void(0)' title='点击下载原图' onclick='downloadImg(\""+id+"\")'>下载</a>";
                    } else {
                        hasImg = '';
                    }
//                    var createTimeStr = goods['createTimeStr'];
                    var updateTimeStr = goods['updateTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+name+"</td>"
                                   + "<td>"+code+"</td>"
                                   + "<td>"+sort+"</td>"
                                   + "<td>"+hasImg+"</td>"
//                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td>"+updateTimeStr+"</td>"
                                   + "<td>"
                                       + "<button id='viewBtn' style='margin-right: 4px' value='"+id+"'>查看</button>"
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

    function addOrUpdate(prefix){
         var idPrefix = '#' + prefix;
         var name = $(idPrefix + "Name").val();
         if(name == ''){
             openAlert(MSG_NAME_CAN_NOT_BE_NULL);
             return;
         }
         if(name.length > 32){
             openAlert(MSG_NAME_32);
             return;
         }
         var files = new FormData();
         files.append('file', file);
         files.append('name', name);
         var code = $(idPrefix + "Code").val();
         if(code != '' && code.length > 32){
             openAlert(MSG_CODE_32);
             return;
         }
         files.append('code', code);
         var sort = $(idPrefix + "Sort").val();
         if(sort != '' && !checkPositiveAndZero(sort)){
             openAlert(MSG_ORDER_CHECK);
             return;
         }
         files.append('sort', sort);
         var remark = $(idPrefix + "Remark").val();
         if(remark != '' && remark.length > 128){
             openAlert(MSG_REMARK_128);
             return;
         }
         files.append('remark', remark);
         var imgUrl = $(idPrefix + "ImgPreview").attr('src');
         var hasImg = "0";
         if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
             hasImg = "1";
         }
         files.append('hasImg', hasImg);
        var url = goodsHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = goodsHost + "/add";
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
                if (obj.code == HAS_RELATED_DATA) {
                    openAlert(MSG_PRODUCT_HAS_RELATED_DATA_CAN_NOT_UPDATE_UNIT);
                    return;
                }
                if (obj.code == NAME_HAS_EXISTED.CODE) {
                     openAlert(NAME_HAS_EXISTED.MSG);
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

    function closeSupplierViewDialog(){
        closeMask();
        $("#viewSupplierDiv").hide();
    }

    function exportExcel(){
       exportExcelFile(goodsHost + '/download?'+ $("#search").serialize(), '商品信息.xlsx');
    }

    function previewImg(id){
        previewImgFromBase64(goodsHost + "/get/"+id);
    }

    function downloadImg(id){
        downloadImgFromBase64(goodsHost + "/get/img/"+id);
    }
