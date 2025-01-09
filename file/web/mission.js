
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
            loadingGifToGetFadeIn();
            $.ajax({
                url: missionHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    loadingGifFadeOut();
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewTitle").val(obj.data.title);
                    $("#viewContent").val(obj.data.content);
                    $("#viewType").val(obj.data.type);
                    $("#viewPace").val(obj.data.pace);
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
            loadingGifToGetFadeIn();
            $.ajax({
                url: missionHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    loadingGifFadeOut();
                    if (obj.code != 1) {
                        openAlert(obj.message);
                        return;
                    }
                    $("#updateDiv").show();
                    $("#updateId").val(obj.data.id);
                    $("#updateTitle").val(obj.data.title);
                    $("#updateContent").val(obj.data.content);
                    $("#updateType").val(obj.data.type);
                    $("#updatePace").val(obj.data.pace);
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

        $(document).on('click', "#deleteBtn", function() {
           event.preventDefault();
           var id = $(this).val();
           customConfirm("您确定删除吗 !",
                function() {
                    $.ajax({
                        url: missionHost + "/delete/"+id,
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

        $(document).on('click', "#initBtn", function() {
            event.preventDefault();
            $.ajax({
                url: missionHost + "/update/pace/initial/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert("修改失败 !");
                        return;
                    }
                    fetchData(currentPage);
                }
            });
        });

        $(document).on('click', "#doingBtn", function() {
            event.preventDefault();
            $.ajax({
                url: missionHost + "/update/pace/doing/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert("修改失败!");
                        return;
                    }
                    fetchData(currentPage);
                }
            });
        });

        $(document).on('click', "#doneBtn", function() {
            event.preventDefault();
            $.ajax({
                url: missionHost + "/update/pace/done/"+$(this).val(),
                method: 'POST',
                success: function(obj) {
                    if (obj.code != 1) {
                        openAlert("修改失败!");
                        return;
                    }
                    fetchData(currentPage);
                }
            });
        });

        $("form").submit(function(event) {
            event.preventDefault();
        });

        getType ();
        getPace ();
    });

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
        files.append('content', $(idPrefix + "Content").val());
        files.append('type', $(idPrefix + "Type").val());
        var pace = $(idPrefix + "Pace").val();
        if(pace != undefined){
            files.append('pace', pace);
        }

        var imgUrl = $(idPrefix + "ImgPreview").attr('src');
        var hasImg = "0";
        if (imgUrl != null && imgUrl != undefined && imgUrl != ''  ) {
            hasImg = "1";
        }
        files.append('hasImg', hasImg);
        var url = missionHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = missionHost + "/add";
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
                if (obj.code == MISSION_OUT_OF_LIMIT.CODE) {
                    openAlert(MISSION_OUT_OF_LIMIT.MSG);
                    return;
                }
                if (obj.code != 1) {
                    openAlert("修改失败 !");
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
        loadingGifToGetFadeIn();
        $.ajax({
            url: missionHost + "/list",
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
                    let mission = list[i];
                    var id = mission['id'];
                    var title = mission['title'];
                    var content = mission['content'] == null ? '' : mission['content'];
                    var typeValue = mission['typeValue'];
                    var pace = mission['pace'];
                    var paceColor = '';
                    var initBtn = '';
                    var doingBtn = '';
                    var doneBtn = '';
                    if (pace == 0) {
                        paceColor = 'red';
                        doingBtn = "<button id='doingBtn' style='margin-right: 4px' value='"+id+"'>处理中</button>";
                        doneBtn = "<button id='doneBtn' value='"+id+"'>已处理</button>";
                    } else if (pace == 1){
                        paceColor = 'yellow';
                         initBtn = "<button id='initBtn' style='margin-right: 4px' value='"+id+"'>未处理</button>";
                         doneBtn = "<button id='doneBtn' value='"+id+"'>已处理</button>";
                    } else {
                        initBtn = "<button id='initBtn' style='margin-right: 4px' value='"+id+"'>未处理</button>";
                        doingBtn = "<button id='doingBtn' style='margin-right: 4px' value='"+id+"'>处理中</button>";
                    }
                    var paceValue = mission['paceValue'];
                    var hasImg = mission['hasImg'];
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
                    var createTimeStr = mission['createTimeStr'];
                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#4CAF50'>"+num+"</td>"
                                   + "<td>"+title+"</td>"
                                   + "<td>"+content+"</td>"
                                   + "<td>"+typeValue+"</td>"
                                   + "<td bgcolor='"+paceColor+"'>"+paceValue+"</td>"
                                   + "<td>"+hasImg+"</td>"
                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td><button id='viewBtn' style='margin-right: 4px' value='"+id+"'>详细</button>"
                                   + "<button id='editBtn' style='margin-right: 4px' value='"+id+"'>修改</button>"
                                   + "<button id='deleteBtn' style='margin-right: 4px' value='"+id+"'>删除</button>"
                                   + initBtn
                                   + doingBtn
                                   + doneBtn
                                   + "</td>"
                           + "</tr>";
                    $("#tableBody").append(row);
                }
                $("#pagination").append(getPageLink(currentPage, totalPage));
                if(ifShareUser()){
                    hideUpdateBtn();
                    $("#initBtn, #doingBtn, #doneBtn").hide();
                }
            }
        });
    }

    function getType () {
        $.ajax({
            url: missionHost + "/type",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,value){
                    $("#type,#addType,#updateType,#viewType").append("<option value='" +index+ "'>"+value+"</option>");
                });
            }
        });
    }

    function getPace () {
        $.ajax({
            url: missionHost + "/pace",
            method: 'GET',
            success: function(obj) {
                var arr = obj.data;
                $.each(arr,function(index,value){
                    $("#pace,#addPace,#updatePace,#viewPace").append("<option value='" +index+ "'>"+value+"</option>");
                });
            }
        });
    }

    function previewImg(id){
        previewImgFromBase64(missionHost + "/get/"+id);
    }

    function downloadImg(id){
        downloadImgFromBase64(missionHost + "/get/img/"+id);
    }

    function exportExcel(){
        exportExcelFile(missionHost + '/download?'+ $("#search").serialize(), '待办.xlsx');
    }