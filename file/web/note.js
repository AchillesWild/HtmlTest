
    var currentPage = 1;
    var file;
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
                url: noteHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewTitle").val(obj.data.title);
                    $("#viewContent").val(obj.data.content);
                    $("#viewType").val(obj.data.type);
                    $("#createTimeStr").val(obj.data.createTimeStr);
                    $("#updateTimeStr").val(obj.data.updateTimeStr);
                    var imgBase64 = obj.data.compressImgUrl;
                    if (imgBase64 != null && imgBase64 != '') {
                        showPreview('view', imgBase64);
                        $("#imgViewDiv").show();
                    } else {
                        $("#viewShowImg").empty();
                        $("#imgViewDiv").hide();
                    }
                }
            });
        });

        $(document).on('click', '#editBtn', function() {
            openMask();
            $.ajax({
                url: noteHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#updateDiv").show();
                    $("#updateId").val(obj.data.id);
                    $("#updateTitle").val(obj.data.title);
                    $("#updateContent").val(obj.data.content);
                    $("#updateType").val(obj.data.type);
                    var imgBase64 = obj.data.compressImgUrl;
                    if (imgBase64 != null && imgBase64 != '') {
                        showPreviewAndDelete("update", imgBase64);
                    } else {
                        $("#updateShowImg").empty();
                    }
                }
            });
        });

        $("#updateBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate('update');
        });

        $("#updateContentBtn").on('click', function(event) {
            event.preventDefault();
            let noteObj = {
                    "content": $("#showContent").val()
                     };
            $.ajax({
                url: noteHost + "/update/content/"+$("#updateContentId").val(),
                method: 'POST',
                data: JSON.stringify(noteObj),
                contentType: 'application/json;charset=utf-8',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert("修改失败 !");
                        return;
                    }
                    closeContent();
                    fetchData(currentPage);
                }
            });
        });

        $(document).on('click', "#deleteBtn", function() {
           event.preventDefault();
           var id = $(this).val();
           customConfirm("您确定删除吗 !",
                function() {
                    $.ajax({
                        url: noteHost + "/delete/"+id,
                        method: 'POST',
                        success: function(obj) {
                            if (obj.code != 1) {
                                openAlert(obj.message);
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

        getType ();

        $(document).on('click', "#copyBtn", function() {
            event.preventDefault();
            $.ajax({
                url: noteHost + "/copy/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    currentPage = 1;
                    fetchData(currentPage);
                }
            });
        });
    });

    function fetchData(currentPage) {
        loadingGifToGetFadeIn();
        $.ajax({
            url: noteHost + "/list",
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
                    let note = list[i];
                    var id = note['id'];
                    var title = note['title'];
                    var content = note['content'] == null ? '' : note['content'];
                    if (content != '') {
                        content = "<a href='javascript:void(0)' onclick='showContent(\""+id+"\")'>"+content+"</a>";
                    }
                    var typeValue = note['typeValue'];
                    var hasImg = note['hasImg'];
                    if (hasImg == 1) {
                        hasImg = "<a href='javascript:void(0)' title='点击预览图片' onclick='previewImg(\""+id+"\")'>预览</a>"
                               + "&nbsp;&nbsp;"
                               + "<a href='javascript:void(0)' title='点击下载原图' onclick='downloadImg(\""+id+"\")'>下载</a>";
                    } else {
                        hasImg = '';
                    }
                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }
                    var createTimeStr = note['createTimeStr'];
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+title+"</td>"
                                   + "<td title='点击查看全部内容'>"+content+"</td>"
                                   + "<td>"+typeValue+"</td>"
                                   + "<td>"+hasImg+"</td>"
                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td><button id='viewBtn' style='margin-right: 4px' value='"+id+"'>详细</button>"
                                   + "<button id='editBtn' style='margin-right: 4px' value='"+id+"'>修改</button>"
                                   + "<button id='copyBtn' style='margin-right: 4px' value='"+id+"'>复制</button>"
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

    function addOrUpdate(prefix){
	    var idPrefix = '#' + prefix;
        var title = $(idPrefix + "Title").val();
        if(title == '' || title.length > 64){
            openAlert(MSG_TITLE_64);
            return;
        }

        var files = new FormData();
        files.append('file', file);
        files.append('title', title);
        files.append('content', $(idPrefix + "Content").val(),);
        files.append('type', $(idPrefix + "Type").val());
        var imgUrl = $(idPrefix + "ImgPreview").attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
        var url = noteHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = noteHost + "/add";
        }
        $(idPrefix + "Btn").attr('disabled',"disabled");
        $.ajax({
            url: url,
            type: 'POST',
            data: files,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(obj) {
                $(idPrefix + "Btn").removeAttr('disabled');
                if (obj.code == NOTE_OUT_OF_LIMIT.CODE) {
                    openAlert(NOTE_OUT_OF_LIMIT.MSG);
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

    function getType () {
        $.ajax({
            url: noteHost + "/type",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,value){
                    $("#type,#addType,#updateType,#viewType").append("<option value='" +index+ "'>"+value+"</option>");
                });
            }
        });
    }

    function exportExcel(){
       exportExcelFile(noteHost + '/download?'+ $("#search").serialize(), '笔记.xlsx');
    }

    function previewImg(id){
        previewImgFromBase64(noteHost + "/get/"+id);
    }

    function downloadImg(id){
        downloadImgFromBase64(noteHost + "/get/img/"+id);
    }

    function showContent(id){
        openMask();
        $.ajax({
            url: noteHost + "/get/"+id,
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    openAlert(obj.message);
                    return;
                }
                $("#updateContentId").val(id);
                $("#showContent").val(obj.data.content);
                $("#contentDiv").show();
                if(ifShareUser()){
                    $("#updateContentBtn").hide();
                }
            }
        });
    }

    function closeContent(){
        closeMask();
        $("#contentDiv").hide();
    }