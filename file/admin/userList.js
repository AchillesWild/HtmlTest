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

        $(document).on('click', "#freezeBtn", function() {
            setType($(this).val(), "freeze");
        });

        $(document).on('click', "#unfreezeBtn", function() {
            setType($(this).val(), "unfreeze");
        });

        $(document).on('click', "#recoverBtn", function() {
            setType($(this).val(), "recover")
         });

        $(document).on('click', "#resetPassWordBtn", function() {
            setType($(this).val(), "resetPassWord");
        });

        $('#authBtn').click(function() {
            event.preventDefault();
            var authCode = $('#authCode').val();
            if(authCode == ''){
                alert("请输入授权码 !");
                return;
            }
            var url;
            var type = $("#type").val();
            var userUuid = $("#userUuid").val();
            if (type == "freeze") {
                url = userHost + "/freeze/"+userUuid;
            } else if (type == "unfreeze"){
                url = userHost + "/unfreeze/"+userUuid;
            } else if (type == "recover"){
                url = userHost + "/recover/"+userUuid;
            } else if (type == "resetPassWord"){
                url = userHost + "/reset/password/"+userUuid;
            }
            $.ajax({
                url: url,
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
                    if (type == "resetPassWord"){
                        alert("密码重置成功 (请提示用户尽快修改密码) !");
                    }
                    fetchData(currentPage);
                }
            });
        });

        getStatusSelect();
    });

    function setType(userUuid, type) {
        $('#authForm')[0].reset();
        $("#userUuid").val(userUuid);
        $("#type").val(type);
        $("#authDiv").show();
        $("#authCode").focus();
        openMask();
    }

    function fetchData(currentPage) {
        $.ajax({
            url: userHost + "/list",
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
                    var userUuid = user['userUuid'];
                    var name = user['userName'];
                    var nickName = user['nickName'] == null ? '' : user['nickName'];
                    var isShareUser = user['isShareUser'];
                    var parentUserName = user['parentUserName'] == null ? '' : user['parentUserName'];
                    var status = user['status'];
                    var freezeBtn = '';
                    var unfreezeBtn = '';
                    var recoverBtn = '';
                    var statusColor = '';
                    var resetPassWordBtn = "<button id='resetPassWordBtn' style='margin-right: 4px' value='"+userUuid+"'>重置密码</button>";
                    if(status == 1){
                        if(parentUserName == ''){
                            freezeBtn = "<button id='freezeBtn' style='margin-right: 4px' value='"+userUuid+"'>冻结</button>";
                        } else {
                            resetPassWordBtn = '';
                        }
                    } else if(status == 2){
                        statusColor = 'yellow';
                        if(parentUserName == ''){
                            unfreezeBtn = "<button id='unfreezeBtn' style='margin-right: 4px' value='"+userUuid+"'>解冻</button>";
                        } else {
                            resetPassWordBtn = '';
                        }
                    } else if(status == 3){
                         statusColor = 'red';
                        if(parentUserName == ''){
                           recoverBtn = "<button id='recoverBtn' style='margin-right: 4px' value='"+userUuid+"'>恢复</button>";
                        }
                        resetPassWordBtn = "";
                    }
                    var statusValue = user['statusValue'];
                    var loginTimes = user['loginTimes'];
                    var lastLoginDateStr = user['lastLoginDateStr'];
                    var createTimeStr = user['createTimeStr'];
                    var updateTimeStr = user['updateTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }

                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#8FBC8F'>"+num+"</td>"
                                   + "<td>"+name+"</td>"
                                   + "<td>"+nickName+"</td>"
                                   + "<td>"+isShareUser+"</td>"
                                   + "<td>"+parentUserName+"</td>"
                                   + "<td bgcolor='"+statusColor+"'>"+statusValue+"</td>"
                                   + "<td>"+loginTimes+"</td>"
                                   + "<td>"+lastLoginDateStr+"</td>"
                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td>"+updateTimeStr+"</td>"
                                   + "<td>"
                                       + freezeBtn
                                       + unfreezeBtn
                                       + recoverBtn
                                       + resetPassWordBtn
                                   + "</td>"
                           + "</tr>";
                    $("#tableBody").append(row);
                }
              $("#pagination").append(getPageLink(currentPage, totalPage));
            }
        });
    }

    function getStatusSelect() {
        $.ajax({
            url: userHost + "/select/status",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr, function(index, value){
                    $("#status").append("<option value='" +index+ "'>"+value+"</option>");
                });
            }
        });
    }

    function closeAuth(){
        closeMask();
        $("#authDiv").hide();
        $('#authForm')[0].reset();
    }