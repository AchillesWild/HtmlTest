
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

        $(document).on('click', '#editBtn', function() {
            openMask();
            $.ajax({
                url: productHost + "/get/"+$(this).val(),
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
                    $("#updateUnit").val(obj.data.unit);
                    $("#updateDescription").val(obj.data.description);
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
                        url: productHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code == HAS_RELATED_DATA) {
                                openAlert(PRODUCT_HAS_RELATED_DATA);
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

        getUnit ();
    });

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        $.ajax({
            url: productHost + "/list",
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
                    let product = list[i];
                    var id = product['id'];
                    var name = product['name'];
                    var code = product['code'];
                    var sort = product['sort'];
                    var unitValue = product['unitValue'];
                    var hasImg = product['hasImg'];
                    if (hasImg == 1) {
                        hasImg = "<a href='javascript:void(0)' title='点击预览图片' onclick='previewImg(\""+id+"\")'>预览</a>"
                               + "&nbsp;&nbsp;"
                               + "<a href='javascript:void(0)' title='点击下载原图' onclick='downloadImg(\""+id+"\")'>下载</a>";
                    } else {
                        hasImg = '';
                    }
                    var description = product['description'];
                    var createTimeStr = product['createTimeStr'];
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
                                   + "<td>"+unitValue+"</td>"
                                   + "<td>"+sort+"</td>"
                                   + "<td>"+hasImg+"</td>"
                                   + "<td>"+description+"</td>"
                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td>"
                                       + "<button id='viewBtn' style='margin-right: 4px' value='"+id+"'>详细</button>"
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

    $(document).on('click', '#viewBtn', function() {
        openMask();
        $.ajax({
            url: productHost + "/get/"+$(this).val(),
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
                $("#viewUnit").val(obj.data.unitValue);
                $("#viewDescription").val(obj.data.description);
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

    function addOrUpdate(prefix){
         var idPrefix = '#' + prefix;
         var name = $(idPrefix + "Name").val();
         if(name == '' || name.length > 32){
             openAlert(MSG_NAME_32);
             return;
         }

         var files = new FormData();
         files.append('file', file);
         files.append('name', name);
         var code = $(idPrefix + "Code").val();
         if(code.length > 32){
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
         files.append('unit', $(idPrefix + "Unit").val());
         var description = $(idPrefix + "Description").val();
         if(description.length > 1024){
             openAlert(MSG_DESCRIPTION_1024);
             return;
         }
         files.append('description', description);
         var imgUrl = $(idPrefix + "ImgPreview").attr('src');
         var hasImg = "0";
         if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
             hasImg = "1";
         }
         files.append('hasImg', hasImg);
        var url = productHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = productHost + "/add";
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
                     openAlert("失败 !");
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
       exportExcelFile(productHost + '/download?'+ $("#search").serialize(), '计量物信息.xlsx');
    }

    function previewImg(id){
        previewImgFromBase64(productHost + "/get/"+id);
    }

    function downloadImg(id){
        downloadImgFromBase64(productHost + "/get/img/"+id);
    }

    function getUnit () {
        $.ajax({
            url: commonHost + "/unit/select",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index, object){
                    $("#addUnit,#updateUnit").append("<option value='" +object.unit+ "'>"+object.unitValue+"</option>");
                });
            }
        });
    }
