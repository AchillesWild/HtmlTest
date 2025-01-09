
    let currentPage = 1;
    var file;
    $(document).ready(function() {

       if(!ifShareUser()){
           showBtn();
       }

       getTransactionType();

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

        $(document).on('click', '#viewBtn', function() {
            openMask();
            $.ajax({
                url: financeHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    $("#viewDiv").show();
                    $("#createTimeStr").val(obj.data.createTimeStr);
                    $("#updateTimeStr").val(obj.data.updateTimeStr);
//                    $("#viewTitle").val(obj.data.title);
                    $("#viewAmount").val(obj.data.amountValue);
                    var imgBase64 = obj.data.compressImgUrl;
                    if (imgBase64 != null && imgBase64 != '') {
                        showPreview('view', imgBase64);
                        $("#imgViewDiv").show();
                    } else {
                        $("#viewShowImg").empty();
                        $("#imgViewDiv").hide();
                    }

                    var flowType = obj.data.flowType;
                    $("#viewFlowType").val(flowType);
                    var transactionType = obj.data.transactionType;
                    $.ajax({
                        url: transactionTypeHost + "/get/select?&flowType="+flowType,
                        method: 'GET',
                        success: function(obj) {
                           $("#viewTransactionType").empty();
                           $.each(obj.data, function(index, object){
                              $("#viewTransactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
                           });
                           $("#viewTransactionType").val(transactionType);
                        }
                    });
                    $("#viewRemark").val(obj.data.remark);
                    $("#viewTradeDate").val(obj.data.tradeDate);
                }
            });
        });

        $(document).on('click', '#editBtn', function() {

            openMask();
            $.ajax({
                url: financeHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    $("#updateDiv").show();
                    $("#updateId").val(obj.data.id);
//                    $("#updateTitle").val(obj.data.title);
                    $("#updateAmount").val(obj.data.amountValue);
                    var imgBase64 = obj.data.compressImgUrl;
                    if (imgBase64 != null && imgBase64 != '') {
                        showPreviewAndDelete("update", imgBase64);
                    } else {
                        $("#updateShowImg").empty();
                    }

                    var flowType = obj.data.flowType;
                    $("#updateFlowType").val(flowType);
                    var transactionType = obj.data.transactionType;
                    $.ajax({
                        url: transactionTypeHost + "/get/select?flowType="+flowType,
                        method: 'GET',
                        success: function(obj) {
                           $("#updateTransactionType").empty();
                           $.each(obj.data, function(index, object){
                              $("#updateTransactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
                           });
                           $("#updateTransactionType").val(transactionType);
                        }
                    });
                    $("#updateRemark").val(obj.data.remark);
                    $("#updateTradeDate").val(obj.data.tradeDate);
                }
            });
        });

        $("#addBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate('add');
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
                        url: financeHost + "/delete/"+id,
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

        $(document).on('click', "#copyBtn", function() {
            event.preventDefault();
            $.ajax({
                url: financeHost + "/copy/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    currentPage =  1;
                    fetchData(currentPage);
                }
            });
        });

        $("form").submit(function(event) {
            event.preventDefault();
        });

        $("#flowType").on("change",function () {
            getPayOrIncomeSelect();
        });

        $("#addFlowType").on("change",function () {
            getAddPayOrIncomeSelect();
        });

        $("#updateFlowType").on("change",function () {
            getUpdatePayOrIncomeSelect();
        });
    });

    function addOrUpdate(prefix){
        var files = new FormData();
        var idPrefix = '#' + prefix;
        files.append('file', file);
        var imgUrl = $(idPrefix + 'ImgPreview').attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
//        var title = $(idPrefix + 'Title').val();
//        if(title == '' || title.length > 32){
//            openAlert(MSG_NAME_32);
//            return;
//        }
//        files.append('title', title);
        var amount = $(idPrefix + 'Amount').val();
        if(!checkPositive2(amount)){
            openAlert(MSG_AMOUNT_2);
            return;
        }
        files.append('amount', amount);
        var flowType = $(idPrefix + 'FlowType').val();
        files.append('flowType', flowType);
        var transactionType = $(idPrefix + 'TransactionType').val();
        if(transactionType == null || transactionType == ""){
            openAlert(MSG_FLOW_TYPE_MUST_CHOOSE);
            return;
        }
        files.append('transactionType', transactionType);
        files.append('tradeDate', $(idPrefix + 'TradeDate').val());
        var remark = $(idPrefix + 'Remark').val();
        if(remark.length > 1024){
            openAlert(MSG_REMARK_1024);
            return;
        }
        files.append('remark', remark);
        var url = financeHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = financeHost + "/add";
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
                if (obj.code == FINANCE_OUT_OF_LIMIT.CODE) {
                    openAlert(FINANCE_OUT_OF_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert(obj.message);
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

    function getAddPayOrIncomeSelect(){
        var flowType = $('#addFlowType').val();

        $.ajax({
            url: transactionTypeHost + "/get/select?flowType="+flowType,
            method: 'GET',
            success: function(obj) {
                $("#addTransactionType").empty();
               if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                    return;
               }
              var arr = obj.data;
              $.each(arr,function(index,object){
                 $("#addTransactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
              });
            }
        });
    }

    function getUpdatePayOrIncomeSelect(){
      var flowType = $('#updateFlowType').val();

        $.ajax({
            url: transactionTypeHost + "/get/select?flowType="+flowType,
            method: 'GET',
            success: function(obj) {
               $("#updateTransactionType").empty();
               if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                    return;
               }
              var arr = obj.data;
              $.each(arr,function(index,object){
                 $("#updateTransactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
              });
            }
        });
    }

    function getDefaultFlowOrPayOrIncomeSelect(){
      $('#flowType').val(null);
      $("#transactionType").empty();
    }

    function getPayOrIncomeSelect(){
        var flowType = $('#flowType').val();
        if(flowType == ''){
            $("#transactionType").empty();
            return;
        }
        $("#transactionType").empty();
        $.ajax({
            url: transactionTypeHost + "/get/select?flowType="+flowType,
            method: 'GET',
            success: function(obj) {
              if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                    return;
              }
              var arr = obj.data;
              $.each(arr,function(index,object){
                 if(index == 0){
                    $("#transactionType").append("<option style='font-weight:bold' value=''></option>");
                 }
                 $("#transactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
              });
            }
        });
    }

    function fetchData(currentPage) {
        var params = $("#search").serialize() + "&pageNo="+currentPage+ "&pageSize="+pageSize;
        $.ajax({
            url: financeHost + "/list",
            method: 'GET',
            data: params,
            success: function(obj) {
                loadingGifFadeOut();
                if (obj.code == NO_DATA.CODE && currentPage > 1) {
                    currentPage = currentPage - 1;
                    fetchData(currentPage);
                    return;
                }
                getSearchSum(financeHost + "/get/sum");
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
                    let finance = list[i];
                    var id = finance['id'];
//                    var title = finance['title'];
                    var amount = finance['amountValue'];
                    var hasImg = finance['hasImg'];
                    if (hasImg == 1) {
                        hasImg = "<a href='javascript:void(0)' title='点击预览图片' onclick='previewImg(\""+id+"\")'>预览</a>"
                               + "&nbsp;&nbsp;"
                               + "<a href='javascript:void(0)' title='点击下载原图' onclick='downloadImg(\""+id+"\")'>下载</a>";
                    } else {
                        hasImg = '';
                    }
                    var flowType = finance['flowTypeValue'];
                        var transactionTypeValue = finance['transactionTypeValue'] == null ? '' : finance['transactionTypeValue'];
                    var remark = finance['remark'] == null ? '' : finance['remark'];
                    var tradeDate = finance['tradeDate'] == null ? '' : finance['tradeDate'];
                    var bgColor;
                    if (i % 2 == 0) {
                         bgColor = '#DCDCDC';
                    } else {
                         bgColor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgColor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+amount+"</td>"
                                   + "<td>"+tradeDate+"</td>"
                                   + "<td>"+flowType+"</td>"
                                   + "<td>"+transactionTypeValue+"</td>"
                                   + "<td>"+hasImg+"</td>"
                                   + "<td>"+remark+"</td>"
                                   + "<td><button id='viewBtn' style='margin-right: 4px' value='"+id+"'>详细</button>"
                                   + "<button id='editBtn' style='margin-right: 4px' value='"+id+"'>编辑</button>"
                                   + "<button id='deleteBtn' style='margin-right: 4px' value='"+id+"'>删除</button>"
                                   + "<button id='copyBtn' style='margin-right: 4px' value='"+id+"'>复制</button>"
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

    function getTransactionType () {
        if($("#addTransactionType").children().length > 0){
            return;
        }

        $.ajax({
            url: transactionTypeHost + "/get/select?flowType="+$('#addFlowType').val(),
            method: 'GET',
            success: function(obj) {
               if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                    return;
               }
               var arr = obj.data;
               $.each(arr,function(index,object){
                   $("#addTransactionType").append("<option value='" +object.uuid+ "'>"+object.name+"</option>");
               });
            }
        });
    }

    function previewImg(id){
        previewImgFromBase64(financeHost + "/get/"+id);
    }

    function downloadImg(id){
        downloadImgFromBase64(financeHost + "/get/img/"+id);
    }

    function exportExcel(){
        exportExcelFile(financeHost + '/download?'+ $("#search").serialize(), '账务-明细.xlsx');
    }

    function openAddFinanceDialog(){
        openMask();
        $("#addDiv").show();
        $("#addTradeDate").val(getCurrentDate());
        $("#addAmount").focus()
    }