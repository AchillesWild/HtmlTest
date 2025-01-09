
    $(document).ready(function() {

        ifToLoginByLocalToken();
        getList();

        $("#addBtn").on('click', function() {
          location.href = "shareUser.html";
        });

        $(document).on('click', "#freezeBtn", function() {
            event.preventDefault();

            $(this).text("解冻");
            var id = $(this).attr('value');
            $(this).attr('id',"unfreezeBtn");
            $.ajax({
                url: shareUserHost + "/freeze/"+id,
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert("冻结失败 !");
                        return;
                    }
                    $("#statusValue_"+id).text("冻结中");
                    $("#li_"+id).css("background-color","#CDC5BF");
                }
            });
        });

        $(document).on('click', "#unfreezeBtn", function() {
            event.preventDefault();
            $(this).text("冻结");
            var id = $(this).attr('value');
            $(this).attr('id',"freezeBtn");
            $.ajax({
                url: shareUserHost + "/unfreeze/"+id,
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert("解冻失败 !");
                        return;
                    }
                    $("#statusValue_"+id).text("正常");
                    $("#li_"+id).css("background-color","#B0E0E6");
                }
            });
        });

        $("#toListPage").on('click', function(event) {
            $(this).addClass("active").css("background-color", commonFootBackgroundColor);
            location.href = "list.html";
        });

        $("#self").on('click', function(event) {
            $(this).addClass("active").css("background-color", commonFootBackgroundColor);
            self();
        });

        $(document).on('click', "#updatePassBtn", function() {
            var id = $(this).attr('value');
            $("#id").val(id);
            openPassAlert();
        });

        $(document).on('click', "#cancelPass", function() {
            closePassAlert();
        });

        $(document).on('click', "#confirmPass", function() {
            updatePass();
        });

        $(document).on('click', '.showPassword', function() {
            if($('#password').val() == ''){
                return;
            }
            var inputType = $('#password').attr('type') === 'password' ? 'text' : 'password';
            $('#password').attr('type', inputType);
            $(this).text(inputType === 'password' ? '👁️' : '🙈');
        });

        $('#password').on('input', function() {
            if ($(this).val() === '') {
                $(this).attr('type', 'password');  // 恢复为密码状态
                $('.showPassword').text('👁️'); // 重置图标
            }
        });
    });

    function updatePass() {
        var password = $('#password').val();
        if (password == '') {
            openAlert(MSG_PASSWORD_CAN_NOT_BE_NULL);
            return;
        }
        if (!checkPassWord(password)) {
            openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
            return;
        }
        let user = {
                "password": password
               };
        var id = $("#id").val();
        $.ajax({
            url: shareUserHost + "/update/pass/"+id,
            method: 'POST',
            data: JSON.stringify(user),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                if (obj.code == MASTER_AND_SHARE_USER_PASS_CAN_NOT_SAME.CODE) {
                    openAlert(MASTER_AND_SHARE_USER_PASS_CAN_NOT_SAME.MSG);
                    return;
                }
                if (obj.code != 1) {
                    return;
                }
                openAlert("密码修改成功 !");
                closePassAlert();
            }
        });
    }

    function openPassAlert(){
        $("#alertOverlay0").show();
        $('#alertPass').show();

    }

    function closePassAlert(){
        $("#id").val("");
        $('#alertOverlay0').hide();
        $('#alertPass').hide();
        $('#password').val("").attr('type', 'password');
        $('.showPassword').text('👁️'); // 重置图标
    }

    function getList() {
        $.mobile.loading("show");
        $.ajax({
            url: shareUserHost + "/list",
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    showBottomNoMessage();
                    return;
                }
                var list = obj.data;
                var num = 0;
                for (let i = 0; i < obj.data.length; i++) {
                    let user = list[i];
                    var id = user['id'];
                    var name = user['userName'];
                    var nickName = user['nickName'] == null ? '' : user['nickName'];
                    if(nickName != ''){
                        name = name + "(" + nickName + ")";
                    }
                    var sharePages = user['sharePagesValue'];
                    var status = user['status'];
                    var backgroundColor = "#CDC5BF";
                    var statusDiv = "<a class='detail-button' id='unfreezeBtn' value='"+id+"' style='margin-right:1em' style='color:red'>解冻</a>";
                    if (status == 1) {
                        backgroundColor = '#B0E0E6';
                        statusDiv = "<a class='detail-button' id='freezeBtn' value='"+id+"' style='margin-right:1em' style='color:red'>冻结</a>";
                    }
                    var updatePassDiv = "<a class='detail-button' id='updatePassBtn' value='"+id+"' style='margin-right:6em' style='color:red'>修改密码</a>";

                    var statusValue = user['statusValue'];
                    var updateTimeStr = user['updateTimeStr'];
                    var row = "<li id='li_"+id+"' style='margin-left:0.5em;margin-right:0.5em;margin-bottom:0.3em;background-color:"+backgroundColor+";border-radius: 0.5em;padding: 0.5em;'>"
                                   + "<h5>"+name+"</h5>"
                                   + "<p style='font-weight:bold'>"+sharePages+"</p>"
                                   + "<div class='row'>"
                                        + "<div class='col-left'>"
                                            + "<p id='statusValue_"+id+"'>"+statusValue+"</p>"
                                        + "</div> "
                                        + "<div class='col-right'>"
                                        + statusDiv
                                        + updatePassDiv
                                        + "</div> "
                                   + "</div> "
                                   + "<div class='row'>"
                                            + "<div class='col-left'>"
                                                + "<p class='time'>"+updateTimeStr+"</p>"
                                            + "</div> "
                                            + "<div class='col-right'>"
                                                + "<a class='ui-btn ui-corner-all ui-icon-eye ui-btn-icon-notext' onclick=getDetail("+id+") style='background-color: #7FFFD4;'></a>"
                                                + "<a class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext' id='delete_"+id+"' onclick=deleteOne("+id+") style='background-color: #F4A460;'>删除</a>"
                                            + "</div> "
                                   + "</div> "
                            + "</li>";
                    appendRow(row);
                }
            },
            complete: function() {
                loading = false;
                $.mobile.loading("hide");
                showBottomNoMessage();
            }
        });
    }

    function appendRow(row){
        if($("#list ul").children().length == 0){
            $("#list ul").append(row);
        } else {
            $('#list ul li:last-child').after(row);
        }
    }

    function getDetail(id){
       location.href = "shareUser.html?id="+id;
    }

    function deleteOne(id){
       customConfirm("您确定删除吗 !",
                function() {
                    $.ajax({
                        url: shareUserHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code != 1) {
                                openAlert("删除失败 !");
                                return;
                            }
                            removeCache("shareUserTotal");
                            var childNum = $('a#delete_'+id).closest('ul').children().length;
                            $('a#delete_'+id).closest('li').remove();
                            if(childNum == 1){
                                getList();
                            }
                        }
                    });
                },
                function() {return;}
        )
    }