     function getSearchSum (url) {
        var params = $("#search").serialize();
        $.ajax({
            url: url,
            method: 'GET',
            data: params,
            success: function(obj) {
                var sumIncomeAmountValue = obj.data.sumIncomeAmountValue;
                $("#sumIncomeAmountValue").html(sumIncomeAmountValue);
                var sumPayAmountValue = obj.data.sumPayAmountValue;
                $("#sumPayAmountValue").html(sumPayAmountValue);
                $("#sumMarginValue").html(obj.data.sumMarginValue);
            }
        });
     }