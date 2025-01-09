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

        $("#updateBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate('update');
        });

        $(document).on('click', '#editBtn', function() {
            openMask();
             loadingGifToGetFadeIn();
             $.ajax({
                 url: configHost + "/get/"+$(this).val(),
                 method: 'GET',
                 success: function(obj) {
                     loadingGifFadeOut();
                     if (obj.code != 1) {
                         alert(obj.message);
                         return;
                     }
                     $("#updateDiv").show();
                     $("#updateId").val(obj.data.id);
                     $("#updateCode").val(obj.data.code);
                     $("#updateVal").val(obj.data.val);
                     $("#updateDescription").val(obj.data.description);
                 }
             });
         });

        $(document).on('click', '#viewBtn', function() {
            openMask();
            loadingGifToGetFadeIn();
            $.ajax({
                url: configHost + "/get/"+$(this).val(),
                method: 'GET',
                success: function(obj) {
                    loadingGifFadeOut();
                    if (obj.code != 1) {
                        alert(obj.message);
                        return;
                    }
                    $("#viewDiv").show();
                    $("#viewCode").val(obj.data.code);
                    $("#viewVal").val(obj.data.val);
                    $("#viewDescription").val(obj.data.description);
                    $("#createTimeStr").val(obj.data.createTimeStr);
                    $("#updateTimeStr").val(obj.data.updateTimeStr);
                }
            });
        });

        $("#addBtn").on('click', function(event) {
            event.preventDefault();
            addOrUpdate('add');
        });

        $(document).on('click', "#deleteBtn", function() {
            if (!confirm("您确定删除吗 ?")) {
                return;
            }
            if (!confirm("请您再次确认 !")) {
                return;
            }
            event.preventDefault();
            $.ajax({
                 url: configHost + "/delete/"+$(this).val(),
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

    });

    function closeUpdateDialog(){
        closeMask();
        $("#updateDiv").hide();
        $('#updateForm')[0].reset();
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
        var code = $(idPrefix + "Code").val();
        if(code == '' || code.length > 32){
            alert('code长度不能超过32个字符!');
            return;
        }
        var val = $(idPrefix + "Val").val();
        if(val == '' || val.length > 128){
            alert('val长度不能超过128个字符!');
            return;
        }
        var description = $(idPrefix + "Description").val();
        if(description != '' && description.length > 128){
            alert('说明长度不能超过128个字符!');
            return;
        }

        let supplier = {
                      "code": code,
                       "val": val,
               "description": description,
                 };
        $(idPrefix + "Btn").attr('disabled',"disabled");

        var url = configHost + "/update/"+$("#updateId").val();
        if (prefix == 'add') {
            url = configHost + "/add";
        }
        $.ajax({
            url: url,
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
            url: configHost + "/list",
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
                    let config = list[i];
                    var id = config['id'];
                    var code = config['code'];
                    var val = config['val'];
                    var description = config['description'] == null ? '' : config['description'];
                    var createTimeStr = config['createTimeStr'];
                    var updateTimeStr = config['updateTimeStr'];

                    var bgcolor;
                    if (i % 2 == 0) {
                         bgcolor = '#DCDCDC';
                    } else {
                         bgcolor = '#B0C4DE';
                    }

                    var row = "<tr bgcolor="+bgcolor+" onclick='changeTrBgcolor(this);'>"
                                   + "<td bgcolor='#8FBC8F'>"+num+"</td>"
                                   + "<td>"+code+"</td>"
                                   + "<td>"+val+"</td>"
                                   + "<td>"+description+"</td>"
                                   + "<td>"+createTimeStr+"</td>"
                                   + "<td>"+updateTimeStr+"</td>"
                                   + "<td>"
                                      + "<button id='viewBtn' style='margin-right: 4px' value='"+id+"'>查看</button>"
                                      + "<button id='editBtn' style='margin-right: 4px' value='"+id+"'>修改</button>"
                                      + "<button id='deleteBtn' style='margin-right: 4px' value='"+id+"'>删除</button>"
                                   + "</td>"
                           + "</tr>";
                    $("#tableBody").append(row);
                }
              $("#pagination").append(getPageLink(currentPage, totalPage));
            }
        });
    }
