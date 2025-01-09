
    $(document).ready(function() {

        fetchData(1);

        $("#addSelectAll").click(function(){
            selectAll("add");
        });

        $("input[name='addSharePages']").click(function(){
            selectOne("add")
        });

        $("#updateSelectAll").click(function(){
            selectAll("update");
        });

        $("input[name='updateSharePages']").click(function(){
            selectOne("update")
        });

        $("#addBtn").on('click', function() {
            $(this).attr('disabled',"disabled");
            var userName = $('#addUserName').val();
            if (userName == '') {
                openAlert("账号不能为空！");
                return;
            }
            if (!checkUserName(userName)) {
                openAlert(MSG_ILLEGAL_USER_NAME);
                return;
            }

            var password = $("#addPassword").val();
            var password2 = $("#addPassword2").val();
            if (password == '' || password2 == '') {
                openAlert("密码不能为空！");
                return;
            }
            if (password != password2) {
                openAlert("两次密码输入不一样！");
                return;
            }
            if (!checkPassWord(password)) {
                openAlert(MSG_ILLEGAL_PASSWORD_PROMPT);
                return false;
            }

            var checkList = new Array();
            $('input[name="addSharePages"]:checked').each(function(){
                checkList.push($(this).val());//向数组中添加元素
            });
            if(checkList.length == 0){
                openAlert("分享的模块必选！");
                return false;
            }
            var sharePages = checkList.join(',');//将数组元素连接起来以构建一个字符串

            let user = {
                        "userName": userName,
                        "password": password,
                        "nickName": $("#addNickName").val(),
                      "sharePages": sharePages
                       };
            $.ajax({
                url: shareUserHost + "/register",
                method: 'POST',
                data: JSON.stringify(user),
                contentType: 'application/json;charset=utf-8',
                success: function(obj) {
                    $("#addBtn").removeAttr('disabled');
                    if (obj.code == USER_NAME_HAS_EXISTED.CODE) {
                        openAlert(USER_NAME_HAS_EXISTED.MSG);
                        return;
                    }
                    if (obj.code == SHARE_USER_COUNT_EXCEED_LIMIT.CODE) {
                        openAlert(SHARE_USER_COUNT_EXCEED_LIMIT.MSG);
                        return;
                    }
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    fetchData(1);
                    closeAddDialog();
                }
            });
	    });

        $("#updateBtn").on('click', function() {
            var userName = $('#updateUserName').val();
            if (userName == '') {
                openAlert("账号不能为空！");
                return;
            }

            var checkList = new Array();
            $('input[name="updateSharePages"]:checked').each(function(){
                checkList.push($(this).val());//向数组中添加元素
            });
            if(checkList.length == 0){
                openAlert("分享的模块必选！");
                return false;
            }
            var sharePages = checkList.join(',');//将数组元素连接起来以构建一个字符串

            let user = {
                        "userName": userName,
                        "nickName": $("#updateNickName").val(),
                      "sharePages": sharePages
                       };
            $.ajax({
                url: shareUserHost + "/update/"+$("#updateId").val(),
                method: 'POST',
                data: JSON.stringify(user),
                contentType: 'application/json;charset=utf-8',
                success: function(obj) {
                    if (obj.code == USER_NAME_HAS_EXISTED.CODE) {
                        openAlert(USER_NAME_HAS_EXISTED.MSG);
                        return;
                    }
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    fetchData(1);
                    closeUpdateDialog();
                }
            });
	    });

        $(document).on('click', '#viewBtn', function() {
            openMask();
            $.ajax({
                url: shareUserHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewUserName").val(obj.data.userName);
                    $("#viewNickName").val(obj.data.nickName);
                    var sharePages = obj.data.sharePages;
                    var checkArray = sharePages.split(",");
                    var checkBoxAll = $("input[name='viewSharePages']");
                    for(var i = 0; i < checkArray.length; i++){
                         $.each(checkBoxAll,function(j,checkbox){
                             var checkValue=$(checkbox).val();
                             if(checkArray[i] == checkValue){
                                 $(checkbox).prop("checked",true);
                             }
                         })
                     }
                     if(checkArray.length == checkBoxAll.length){
                        $("input[name='viewSelectAll']").prop("checked",true);
                     }
                }
            });
        });

        $(document).on('click', '#editBtn', function() {
            openMask();
            $.ajax({
                url: shareUserHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#updateDiv").show();
                    $("#updateId").val(obj.data.id);
                    $("#updateUserName").val(obj.data.userName);
                    $("#updateNickName").val(obj.data.nickName);
                    var sharePages = obj.data.sharePages;
                    var checkArray = sharePages.split(",");
                    var checkBoxAll = $("input[name='updateSharePages']");
                    for(var i = 0; i < checkArray.length; i++){
                         $.each(checkBoxAll,function(j,checkbox){
                             var checkValue=$(checkbox).val();
                             if(checkArray[i] == checkValue){
                                 $(checkbox).prop("checked",true);
                             }
                         })
                     }
                     if(checkArray.length == checkBoxAll.length){
                        $("input[name='updateSelectAll']").prop("checked",true);
                     }
                }
            });
        });

        $(document).on('click', "#freezeBtn", function() {
            event.preventDefault();
            $.ajax({
                url: shareUserHost + "/freeze/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert("冻结失败 !");
                        return;
                    }
                    fetchData(1);
                }
            });
        });

        $(document).on('click', "#unfreezeBtn", function() {
            event.preventDefault();
            $.ajax({
                url: shareUserHost + "/unfreeze/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert("解冻失败 !");
                        return;
                    }
                    fetchData(1);
                }
            });
        });

        $(document).on('click', "#deleteBtn", function() {
           event.preventDefault();
           var id = $(this).val();
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
                            fetchData(1);
                        }
                    });
                },
                function() {return;}
            )
        });

        $("form").submit(function(event) {
            event.preventDefault();
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

    function selectAll(type){
      var isCheckAll = $("#"+type+"SelectAll").prop("checked");
      var checkBoxAll = $("input[name='"+type+"SharePages']");
      if(isCheckAll == true){
           $.each(checkBoxAll,function(i,checkbox){
               $(checkbox).prop("checked",true);
           });
       }else{
           $.each(checkBoxAll,function(i,checkbox){
               $(checkbox).prop("checked",false);
           });
       }
    }

    function selectOne(type){
       var checkBoxAll = $("input[name='"+type+"SharePages']");
       var checkedCount = 0;
       $.each(checkBoxAll, function(i,checkbox){
           var checked = $(checkbox).prop("checked");
           if(checked){
              checkedCount++;
           }
       });
       if(checkBoxAll.length > checkedCount){
            $("#"+type+"SelectAll").prop("checked",false);
       }else{
            $("#"+type+"SelectAll").prop("checked",true);
       }
    }

    function fetchData(currentPage) {
        $.ajax({
            url: shareUserHost + "/list",
            method: 'GET',
            success: function(obj) {
                $("#tableBody").empty();
                if (obj.code != 1) {
                    return;
                }
                var list = obj.data;
                var num = 0;
                for (let i = 0; i < obj.data.length; i++) {
                    let user = list[i];
                    var id = user['id'];
                    var name = user['userName'];
                    var nickName = user['nickName'] == null ? '' : user['nickName'];
                    var sharePages = user['sharePagesValue'];
                    var status = user['status'];
                    var freezeBtn = '';
                    var unfreezeBtn = '';
                    if(status == 1){
                        freezeBtn = "<button id='freezeBtn' style='margin-right: 4px' value='"+id+"'>冻结</button>";
                    } else {
                        unfreezeBtn = "<button id='unfreezeBtn' style='margin-right: 4px' value='"+id+"'>解冻</button>";
                    }
                    var statusValue = user['statusValue'];
//                    var createTimeStr = user['createTimeStr'];
                    var updateTimeStr = user['updateTimeStr'];
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    num = i + 1;
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#8FBC8F'>"+num+"</td>"
                                   + "<td>"+name+"</td>"
                                   + "<td>"+nickName+"</td>"
                                   + "<td>"+sharePages+"</td>"
                                   + "<td>"+statusValue+"</td>"
//                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td>"+updateTimeStr+"</td>"
                                   + "<td>"
                                       + "<button id='viewBtn' style='margin-right: 4px' value='"+id+"'>查看</button>"
                                       + "<button id='editBtn' style='margin-right: 4px' value='"+id+"'>修改信息</button>"
                                       + "<button id='updatePassBtn' style='margin-right: 4px' value='"+id+"'>修改密码</button>"
                                       + freezeBtn
                                       + unfreezeBtn
                                       + "<button id='deleteBtn' style='margin-right: 4px' value='"+id+"'>删除</button>"
                                   + "</td>"
                           + "</tr>";
                    $("#tableBody").append(row);
                }
            }
        });
    }

    function openAddDialog(){
        openMask();
        var checkBoxAll = $("input[name='addSharePages']");
         $.each(checkBoxAll,function(i,checkbox){
             $(checkbox).prop("checked",false);
         });
        $("#addDiv").show();
    }

    function closeAddDialog(){
        closeMask();
        $("#addDiv").hide();
        $('#addForm')[0].reset();
    }

    function closeUpdateDialog(){
        closeMask();
        $("#updateDiv").hide();
        $('#updateForm')[0].reset();
        var checkBoxAll = $("input[name='updateSharePages']");
         $.each(checkBoxAll,function(i,checkbox){
             $(checkbox).prop("checked",false);
         });
    }

    function closeViewDialog(){
        closeMask();
        $("#viewDiv").hide();
        $('#viewForm')[0].reset();
        var checkBoxAll = $("input[name='viewSharePages']");
         $.each(checkBoxAll,function(i,checkbox){
             $(checkbox).prop("checked",false);
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