    $(document).ready(function() {

        $("#addBtn").on('click', function(event) {
            addOrUpdate();
        });

        getQuestions ();
    });

    function addOrUpdate(){
        var answer1 = $("#answer1").val();
        if(answer1 == '' || answer1.length > 64){
            openAlert('答案不能为空,且长度不能超过64个字符!');
            return;
        }
        var answer2 = $("#answer2").val();
        if(answer2 == '' || answer2.length > 64){
            openAlert('答案不能为空,且长度不能超过64个字符!');
            return;
        }
        var answer3 = $("#answer3").val();
        if(answer3 == '' || answer3.length > 64){
            openAlert('答案不能为空,且长度不能超过64个字符!');
            return;
        }
        var question1 = $("#question1").val();
        var question2 = $("#question2").val();
        var question3 = $("#question3").val();
        if(question1 == question2 || question1 == question3 || question2 == question3){
            openAlert('问题不能相同!');
            return;
        }
        if(answer1 == answer2 || answer1 == answer3 || answer2 == answer3){
            openAlert('答案不能相同!');
            return;
        }
        let questions = {
                    "question1": question1,
                      "answer1": answer1,
                    "question2": question2,
                      "answer2": answer2,
                    "question3": question3,
                      "answer3": answer3,
                 };
        $("#addBtn").attr('disabled',"disabled");
        $.ajax({
            url: userHost + "/update/user/question",
            method: 'POST',
            data: JSON.stringify(questions),
            contentType: 'application/json;charset=utf-8',
            success: function(obj) {
                $("#addBtn").removeAttr('disabled');
                if (obj.code != 1) {
                    openAlert("失败 !");
                    return;
                }
                openAlert("保存成功 !");
                //top.location.href = "index.html";
            }
        });
    }


     function getQuestions () {
         $.ajax({
             url: userHost + "/get/all/question",
             method: 'GET',
             success: function(obj) {
                 var arr = obj.data;
                 $.each(arr,function(index, object){
                     $("#question1,#question2,#question3").append("<option value='" +object.key+ "'>"+object.value+"</option>");
                 });

                $(".container").show();

                 $.ajax({
                     url: userHost + "/get/questionAndAnswer",
                     method: 'GET',
                     success: function(obj) {
                         if (obj.code != 1) {
                             return;
                         }
                         var data = obj.data;
                         $("#question1").val(data.question1);
                         $("#answer1").val(data.answer1);
                         $("#question2").val(data.question2);
                         $("#answer2").val(data.answer2);
                         $("#question3").val(data.question3);
                         $("#answer3").val(data.answer3);
                     }
                 });
             }
         });
     }