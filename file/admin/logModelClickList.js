    var currentPage = 1;
    $(document).ready(function() {

        fetchData(currentPage);

        $("#searchBtn").on('click', function(event) {
            event.preventDefault();
            currentPage = 1;
            fetchData(currentPage);
        });

        $("#searchReset").on('click', function(event) {
            event.preventDefault();
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
            loadingGifToGetFadeIn();
            $.ajax({
                url: logHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    loadingGifFadeOut();
                    if (obj.code != 1) {
                        alert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewId").val(obj.data.id);
                    $("#viewUserName").val(obj.data.userName);
                    $("#viewModelName").val(obj.data.modelName);
                    $("#viewFunctionCode").val(obj.data.functionCode);
                    $("#viewTime").val(obj.data.time);
                    $("#viewTraceId").val(obj.data.traceId);
                    $("#viewUserAgent").val(obj.data.userAgent);
                    $("#viewRemoteHost").val(obj.data.remoteHost);
                    $("#createTimeStr").val(obj.data.createTimeStr);

                }
            });
        });

        getModelSelect();
    });

    function fetchData(currentPage) {
        $.ajax({
            url: logHost + "/list",
            method: 'GET',
            data: $("#search").serialize() + "&pageNo="+currentPage+ "&pageSize="+pageSize,
            success: function(obj) {
                $("#tableBody").empty();
                $("#pagination").empty();
                if (obj.code != 1 || (obj.code == 1 && obj.data.count == 0)) {
                    return;
                }
                var list = obj.data;
                var count = obj.data.count;
                var total = obj.data.total;
                var totalPage = total % pageSize == 0 ? (total / pageSize) : (Math.floor(total / pageSize) + 1);
                var list = obj.data.list;
                var num = (currentPage - 1) * pageSize;
                for (let i = 0; i < count; i++) {
                    num ++;
                    let user = list[i];
                    var id = user['id'];
                    var modelName = user['modelName'];
                    var functionCode = user['functionCode'];
                    var time = user['time'];
                    var userName = user['userName'] == null ? "" : user['userName'];
                    var traceId = user['traceId'];
                    var remoteHost = user['remoteHost'];
                    var createTimeStr = user['createTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#8FBC8F'>"+num+"</td>"
                                   + "<td>"+modelName+"</td>"
                                   + "<td>"+functionCode+"</td>"
                                   + "<td>"+time+"</td>"
                                   + "<td>"+userName+"</td>"
                                   + "<td>"+traceId+"</td>"
                                   + "<td>"+remoteHost+"</td>"
                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td><button id='viewBtn' style='margin-right: 4px' value='"+id+"'>详细</button></td>"
                           + "</tr>";
                    $("#tableBody").append(row);
                }
              $("#pagination").append(getPageLink(currentPage, totalPage));
            }
        });
    }

    function getModelSelect() {
        $.ajax({
            url: logHost + "/select/model",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr, function(index, object){
                    $("#modelCode").append("<option value='" +object.key+ "'>"+object.value+"</option>");
                });
            }
        });
    }
