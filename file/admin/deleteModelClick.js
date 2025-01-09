    $(document).ready(function() {

        $(document).on('click', "#doIt", function() {
            var key = $("#modelCode").val();
            if(key == '' || key == null){
                alert("请选择模块 !");
                return;
            }
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
            var key = $("#modelCode").val();
            $.ajax({
                 url: commonHost + "/model/delete/"+key,
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
                    alert("成功 !");
                    closeAuth();
                }
            });
        });

        getDeleteModelSelect();
    });

    function closeAuth(){
        closeMask();
        $("#authDiv").hide();
        $('#authForm')[0].reset();
    }

    function getDeleteModelSelect() {
        $.ajax({
            url: commonHost + "/delete/select/model",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr, function(index, object){
                    $("#modelCode").append("<option value='" +object.key+ "'>"+object.value+"</option>");
                });
            }
        });
    }
