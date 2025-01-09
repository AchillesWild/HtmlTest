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
                url: userHost + "/notice/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    loadingGifFadeOut();
                    if (obj.code != 1) {
                        alert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewContent").val(obj.data.content);
                    $("#viewUuid").val(obj.data.uuid);
                    $("#viewStartTime").val(obj.data.startTime);
                    $("#viewEndTime").val(obj.data.endTime);
                    $("#viewRepeated").val(obj.data.repeatedValue);
                    $("#viewEnable").val(obj.data.enableValue);
                    $("#createTimeStr").val(obj.data.createTimeStr);
                    $("#updateTimeStr").val(obj.data.updateTimeStr);
                }
            });
        });

        $(document).on('click', "#enableBtn", function() {
            $('#authForm')[0].reset();
            $("#id").val($(this).val());
            $("#authDiv").show();
            $("#authCode").focus();
            openMask();
        });

        $('#authBtn').click(function() {
            event.preventDefault();
            var authCode = $('#authCode').val();
            if(authCode == ''){
                alert("请输入授权码 !");
                return;
            }
            var id = $("#id").val();
            $.ajax({
                 url: userHost + "/notice/enable/"+id,
                method: 'POST',
                beforeSend: function(xhr) {
                    addHeaderToken(xhr);
                    xhr.setRequestHeader('authCode', authCode);
                },
                success: function(obj) {
                    if (obj.code == AUTH_CODE_WRONG.CODE) {
                        alert(AUTH_CODE_WRONG.MSG);
                        return;
                    }
                    if (obj.code != 1) {
                        alert("失败 !");
                        return;
                    }
                    closeAuth();
                    fetchData(currentPage);
                }
            });
        });

         $(document).on('click', "#disableBtn", function() {
             event.preventDefault();
             $.ajax({
                 url: userHost + "/notice/disable/"+$(this).val(),
                 method: 'POST',
                 success: function(obj) {
                     if (obj.code != 1) {
                         alert("修改失败!");
                         return;
                     }
                     fetchData(currentPage);
                 }
             });
         });

        $("#addBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate('add');
        });

        $(document).on('click', "#deleteBtn", function() {
            if (!confirm("您确定删除吗 !")) {
                return;
            }
            event.preventDefault();
            $.ajax({
                 url: userHost + "/notice/delete/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert("删除失败 !");
                        return;
                    }
                    fetchData(currentPage);
                }
            });
        });

         getRepeated();
    });

    function closeAuth(){
        closeMask();
        $("#authDiv").hide();
        $('#authForm')[0].reset();
    }

    function openAddDialog(){
        openMask();
        $("#addDiv").show();
    }

    function closeAddDialog(){
        closeMask();
        $("#addDiv").hide();
        $('#addForm')[0].reset();
    }

    function addOrUpdate(prefix){
		var idPrefix = '#' + prefix;
        var content = $(idPrefix + "Content").val();
        if(content == '' || content.length > 4096){
            alert('内容长度不能超过64个字符!');
            return;
        }
        var startTime = $(idPrefix + "StartTime").val();
        if(startTime == '' || startTime.length > 19){
            alert('开始时间长度不能超过19个字符!');
            return;
        }
        var endTime = $(idPrefix + "EndTime").val();
        if(endTime == '' || endTime.length > 19){
            alert('结束时间长度不能超过19个字符!');
            return;
        }

        let supplier = {
              "content": content,
            "startTime": startTime,
              "endTime": endTime,
             "repeated": $(idPrefix + "Repeated").val()
                 };
        $(idPrefix + "Btn").attr('disabled',"disabled");
        $.ajax({
            url: userHost + "/notice/add",
            method: 'POST',
            data: JSON.stringify(supplier),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                $(idPrefix + "Btn").removeAttr('disabled');
                if (obj.code != 1) {
                    alert("新增失败 !");
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
        $.ajax({
            url: userHost + "/notice/list",
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
                    var content = user['content'];
                    var startTime = user['startTime'] == null ? '' : user['startTime'];
                    var endTime = user['endTime'] == null ? '' : user['endTime'];
                    var repeatedValue = user['repeatedValue'] == null ? '' : user['repeatedValue'];
//                    var createTimeStr = user['createTimeStr'] == null ? '' : user['createTimeStr'];
                    var enable = user['enable'];
                    var enableValue = user['enableValue'];
                    var enableColor = '';
                    var enableBtn = '';
                    var disableBtn = '';
                    if (enable == 0) {
                        enableColor = 'grey';
                        enableBtn = "<button id='enableBtn' style='margin-right: 4px' value='"+id+"'>开启</button>";
                    } else if (enable == 1){
                        enableColor = 'green';
                        disableBtn = "<button id='disableBtn' style='margin-right: 4px' value='"+id+"'>关闭</button>";
                    }

                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }

                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#8FBC8F'>"+num+"</td>"
                                   + "<td>"+content+"</td>"
                                   + "<td>"+startTime+"</td>"
                                   + "<td>"+endTime+"</td>"
                                   + "<td>"+repeatedValue+"</td>"
                                   + "<td bgcolor='"+enableColor+"'>"+enableValue+"</td>"
//                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td><button id='viewBtn' style='margin-right: 4px' value='"+id+"'>详细</button>"
                                   + "<button id='deleteBtn' style='margin-right: 4px' value='"+id+"'>删除</button>"
                                   + enableBtn
                                   + disableBtn
                                   + "</td>"
                           + "</tr>";
                    $("#tableBody").append(row);
                }
              $("#pagination").append(getPageLink(currentPage, totalPage));
            }
        });
    }

    function getRepeated() {
        $.ajax({
            url: userHost + "/notice/select/repeat",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr, function(index, value){
                    $("#addRepeated").append("<option value='" +index+ "'>"+value+"</option>");
                });
            }
        });
    }