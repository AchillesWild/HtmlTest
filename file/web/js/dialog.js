    function openAddDialog(){
        openMask();
        $("#addDiv").show();
        $("#addTitle, #addName").focus()
    }

    function closeAddDialog(){
        closeMask();
        $("#addDiv").hide();
        $('#addForm')[0].reset();
        file = null;
        $('#addShowImg').empty();
    }

    function closeUpdateDialog(){
        closeMask();
        $("#updateDiv").hide();
        $('#updateForm')[0].reset();
        file = null;
        $('#updateShowImg').empty();
    }

    function closeViewDialog(){
        closeMask();
        $("#viewDiv").hide();
    }