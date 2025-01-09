    function cancel(){
       customConfirm("您确定注销账号吗?",
            function() {
                customConfirm(SECOND_CONFIRM,
                     function() {
                        $.ajax({
                            url: userHost + "/cancel",
                            method: 'POST',
                            success: function(obj) {
                                if (obj.code != 1) {
                                    openAlert("失败 !");
                                    return;
                                }
                                openAlert("账号已注销 !");
                            }
                        });
                     },
                     function() {return;}
                )
            }
       , function() {return;});
    }

    function closeCancelAlert(){
        closeAlert();
        logout();
    }