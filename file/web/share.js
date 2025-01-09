    var file;
    let currentPage = 1;
    $(document).ready(function() {
        var userName = getUserName();
        if("admin" == userName || "Achilles" == userName){
            $("#openAddBtn").show();
        }

        fetchData(null, currentPage);

        $("#addBtn").on('click', function(event) {
            event.preventDefault();

            var files = new FormData();
            files.append('file', file);
            var content = $('#addContent').val();
            if (content == null || content == '') {
                alert("内容不能为空 !");
                return;
            }
            files.append('content', content);
            $("#addBtn").attr('disabled',"disabled");
            $.ajax({
                url: shareHost + "/add",
                type: 'POST',
                data: files,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function(obj) {
                    $("#addBtn").removeAttr('disabled');
                    if (obj.code != 1) {
                        alert("发布失败 !");
                        return;
                    }
                    location.reload();
                }
            });
        });

        $(document).on('click', ".delete-btn", function() {
            if (!confirm("您确定删除吗 !")) {
                return;
            }
            var id = $(this).attr("id");
            $.ajax({
                url: shareHost + "/delete/" + id,
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert("删除失败 !");
                        return;
                    }
                    $(".delete-btn[id='"+id+"']").parent().remove();
//                    location.reload();
//                    fetchData(null, currentPage);
                }
            });
        });

        $(document).on('click', ".first-delete-btn", function() {
            if (!confirm("您确定删除吗 !")) {
                return;
            }
            var id = $(this).attr("id");
            var targetUuid = $(this).attr("targetUuid");
            $.ajax({
                url: commentHost + "/delete/" + id,
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert("删除失败 !");
                        return;
                    }
                    $(".first-delete-btn[id='"+id+"'][targetUuid='" + targetUuid + "']").parent().parent().remove();
                }
            });
        });

        $(document).on('click', '.show-more-btn', function() {
            currentPage = currentPage + 1;
            fetchData($(this), currentPage);
        });

        $(document).on('click', "[id^='reply_target_btn_']", function() {
            var targetUuid = $(this).attr('targetUuid')
            var content = $("#first_textarea_"+targetUuid).val();
            if (content == '') {
                alert("请先输入内容 !");
                return;
            }

            let note = {
                "targetUuid": targetUuid,
                   "content": content
            };
            $("#first_textarea_"+targetUuid).val(null);
            $.ajax({
                url: commentHost + "/add/first",
                method: 'POST',
                data: JSON.stringify(note),
                contentType: 'application/json;charset=utf-8',
                success: function(obj) {
                    if (obj.code != 1) {
                        alert("评论失败 !");
                        return;
                    }
                    var id = obj.data.id;
                    var nickName = getNickName();
                    var contentDiv = "<div class='comment-content' id='comment_content_" + targetUuid + "'>"
                                        + "<label style='font-weight:bold'>我</label> : <label>"+content+"</label>"
                                        + "<div  class='comment-actions'>"
                                            + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                            + "<label>刚刚</label>"
                                            + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                            + "<span align='right' class='reply-btn'>回复</span>"
                                            + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                            + "<span class='first-delete-btn' id='"+id+"' targetUuid='" + targetUuid + "'>删除</span>"
                                        + "</div>"
                                    + "</div>";
                    var firstCommentDiv = "<div id='first_comment_div_" + targetUuid + "'></div>";
                    if ($("#first_comment_div_" + targetUuid).length == 0) {
                        $(".reply-btn[id='reply_target_btn_" + targetUuid + "']").after(firstCommentDiv);
                    }
                    $("#first_comment_div_" + targetUuid).prepend(contentDiv).prepend('</br>');
                }
            });
        });

        $(document).on('click',"[id^='first_count']", function() {
            var targetUuid = $(this).attr('targetUuid');
             var firstCurrentPage = $("#first_count_"+targetUuid).attr('pageNo');
             if (firstCurrentPage == null || firstCurrentPage == undefined) {
                 firstCurrentPage = 1;
             } else {
                firstCurrentPage = parseInt(firstCurrentPage);
             }
             if (firstCurrentPage == 1) {
                $("#comment_content_" + targetUuid).remove();
             }
            $.ajax({
               url: commentHost + "/list/first",
               method: 'GET',
               data: "pageNo=" + firstCurrentPage+ "&pageSize="+pageSize+"&targetUuid=" + targetUuid,
               success: function(obj) {
                    if (obj.code != 1) {
                        return;
                    }
                    var count = obj.data.count;
                    var total = obj.data.total;
                    var totalPage = total % pageSize == 0 ? (total / pageSize) : (Math.floor(total / pageSize) + 1);
                    var list = obj.data.list;
                    if(firstCurrentPage == 1){
                        var firstCommentDiv = "<div id='first_comment_div_" + targetUuid + "'></div>";
                        $(".reply-btn[id='reply_target_btn_" + targetUuid + "']").after(firstCommentDiv);
                    }
                    for (let i = 0; i < count; i++) {
                       let comment = list[i];
                       var id = comment['id'];
                       var uuid = comment['uuid'];
                       var content = comment['content'];
                       var nickName = comment['nickName'];
                       var isAuthor = comment['isAuthor'];
                       var createTimeStr = comment['createTimeStr'];
                       var deleteElement = '';
                       if(isAuthor == 1) {
                          nickName ='我';
                          deleteElement = "&nbsp;&nbsp;"
                                         +"<span class='first-delete-btn' id='"+id+"' targetUuid='" + targetUuid + "'>删除</span>";
                       }
                       var nickNameAndContentElement = "<label style='font-weight:bold'>"+nickName+"</label> : <label>"+content+"</label>";
                       var commentActionsElement = "<div class='comment-actions'>"
                                                         + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                         + "<label>"+createTimeStr+"</label>"
                                                         + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
//                                                         + "<span align='right' class='reply-btn'>回复</span>"
                                                         + deleteElement;
                                                     + "</div>"

                       var contentDiv = "<div class='comment-content'>"+nickNameAndContentElement+commentActionsElement+"</div>";

                       if ($("#first_comment_div_" + targetUuid).children().length == 0) {
                           $("#first_comment_div_" + targetUuid).append("</br>").append(contentDiv);
                       } else {
                           $("#first_comment_div_" + targetUuid).children().last().after(contentDiv);
                       }
                    }
                   if (firstCurrentPage < totalPage) {
                       $("span[id='first_count_" + targetUuid + "']").html("展开更过评论");
                   } else {
                       $("span[id='first_count_" + targetUuid + "']").remove();
                       return;
                   }
                   firstCurrentPage += 1;
                   $("#first_count_"+targetUuid).attr('pageNo',firstCurrentPage);
                }
            });
        });
   });

   function fetchData(jDiv, currentPage) {
       loadingGifToGetFadeIn();
       if (jDiv != null) {
            jDiv.remove();
       }
       pageSize = 5;
       $.ajax({
           url: shareHost + "/list",
           method: 'GET',
           data: "pageNo=" + currentPage+ "&pageSize="+pageSize,
           success: function(obj) {
                loadingGifFadeOut();
                if (obj.code != 1 || obj.data.count == 0) {
                    return;
                }
               var count = obj.data.count;
               var total = obj.data.total;
               var totalPage = total % pageSize == 0 ? (total / pageSize) : (Math.floor(total / pageSize) + 1);
               var list = obj.data.list;
               for (let i = 0; i < count; i++) {
                   let share = list[i];
                   var id = share['id'];
                   var uuid = share['uuid'];
                   var content = share['content'];
                   var nickName = share['nickName'];
                   var avatarUrl = share['avatarUrl'];
                   if(avatarUrl == null || avatarUrl == ""){
                       avatarUrl = DEFAULT_IMG_BASE64;
                   }
                   var imgUrl = share['imgUrl'];
                   var createTimeStr = share['createTimeStr'];
                   var imgBaseDiv = '';
                   var isAuthor = share['isAuthor'];
                   if(isAuthor == 1) {
                       nickName = '我';
                   }
                   var isAuthorDiv = '';
                   var contentDiv = '';

                   var avatarElement = "<img src='" + avatarUrl + "' height='30' width='30'>&nbsp;";
                   var nickNameElement = "<span style='color:#8B3A3A;font-weight:bold;font-size:1.2em'>" + nickName + "</span>"
                   var contentElement = "<h4>" + content + "</h3>";
                   var imgElement = "<img src='" + imgUrl + "' height='300'>";
                   var deleteElement = "<span class='delete-btn' id='" + id + "'>删除</span>";
                   var createTimeElement = "<label>" + createTimeStr + "</label>";
                   if(imgUrl == null) {
                       if(isAuthor == 1) {
                           contentDiv =   avatarElement
                                         + nickNameElement
                                         + contentElement
                                         + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                         + deleteElement
                                         + "</br>"
                                         + createTimeElement;
                       } else {
                           contentDiv =    avatarElement
                                         + nickNameElement
                                         + contentElement
                                         + createTimeElement;
                       }
                   } else {
                       if(isAuthor == 1) {
                             contentDiv = avatarElement
                                        + nickNameElement
                                        + contentElement
                                        + imgElement
                                        + "&nbsp;&nbsp;"
                                        + deleteElement
                                        + "</br>"
                                        + createTimeElement;
                        } else {
                           contentDiv =   avatarElement
                                        + nickNameElement
                                        + contentElement
                                        + imgElement
                                        + "</br>"
                                        + createTimeElement;
                        }
                   }

//                   var replyArea = "<textarea name='reply' id='first_textarea_" + uuid + "' rows='2' cols='57' placeholder='说说你的看法'></textarea>"
//                                 + "&nbsp;&nbsp;"
//                                 + "<span class='reply-btn' id='reply_target_btn_" + uuid + "' targetUuid='" + uuid + "'>回复</span>";
                   var replyArea = "";
                   contentDiv = "<div align='left' class='post-text'>" + contentDiv + "</br></br>" + replyArea + "</br></br></div>";
                   if (totalPage > 1 && i == count-1 && currentPage < totalPage) {
                       var theRestCount = total - currentPage * pageSize;
                       $(".post").append(contentDiv).after("</br><div class='show-more-btn' style='font-weight:bold;font-size:30px'>展开" + theRestCount  + "条</div>");
                   } else {
                       $(".post").append(contentDiv);
                   }

                    $.ajax({
                       url: commentHost + "/first/count",
                       method: 'GET',
                       data: "targetUuid=" + uuid,
                       async: false,
                       success: function(obj) {
                            if (obj.code != 1) {
                                return;
                            }
                            var totalCommentCount = obj.data.totalCommentCount;
                            var totalCommentCountDiv = '';
                            if (totalCommentCount == 0){
                                totalCommentCountDiv = '</br>';
                            } else {
                                totalCommentCountDiv = "</br><div align='left'><span id='first_count_" + uuid + "' targetUuid='" + uuid + "' style='font-weight:bold'>展开" + totalCommentCount + "条评论</span></div>";
                            }
                            $("span[id='reply_target_btn_" + uuid + "']").after(totalCommentCountDiv);
                       }
                    });
               }
           }
       });
   }