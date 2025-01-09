
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
                url: transactionTypeHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewName").val(obj.data.name);
                    $("#viewSort").val(obj.data.sort);
                    $("#viewFlowType").val(obj.data.flowTypeValue);
                }
            });
        });


        $(document).on('click', '#editBtn', function() {
             openMask();
             $.ajax({
                 url: transactionTypeHost + "/get/"+$(this).val(),
                 method: 'GET',
                 success: function(obj) {
                     if (obj.code != 1) {
                         openAlert(obj.message);
                         return;
                     }
                     $("#updateDiv").show();
                     $("#updateId").val(obj.data.id);
                     $("#updateName").val(obj.data.name);
                     $("#updateSort").val(obj.data.sort);
                     $("#updateFlowType").val(obj.data.flowType);
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
                        url: transactionTypeHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code == HAS_RELATED_DATA) {
                                openAlert(TRANSACTION_TYPE_HAS_RELATED_DATA);
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
    });

    function addOrUpdate(prefix){
		var idPrefix = '#' + prefix;
        var name = $(idPrefix + "Name").val();
        if(name == '' || name.length > 16){
            openAlert(MSG_PAY_OR_INCOME_NAME_CHECK);
            return;
        }
        var sort = $(idPrefix + "Sort").val();
        if(!checkPositiveAndZero(sort)){
            openAlert(MSG_ORDER_CHECK);
            return;
        }

        let transactionTypeObj = {
                    "name": name,
                    "sort": sort,
                "flowType": $(idPrefix + "FlowType").val()
                 };
         var url = transactionTypeHost + "/update/"+$("#updateId").val();
         if (prefix == 'add') {
             url = transactionTypeHost + "/add";
         }
        $(idPrefix + "Btn").attr('disabled',"disabled");
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(transactionTypeObj),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                $(idPrefix + "Btn").removeAttr('disabled');
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

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        $.ajax({
            url: transactionTypeHost + "/list",
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
                    let transactionTypeObj = list[i];
                    var id = transactionTypeObj['id'];
                    var name = transactionTypeObj['name'];
                    var sort = transactionTypeObj['sort'];
                    var flowType = transactionTypeObj['flowTypeValue'];
                    var updateTimeStr = transactionTypeObj['updateTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+name+"</td>"
                                   + "<td>"+flowType+"</td>"
                                   + "<td>"+sort+"</td>"
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