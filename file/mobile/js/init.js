
//-----------------------------------------------------------------------------------------------------------------------------
    function toCacheMissionTotal(){
         var total = getCache("missionTotal");
         if(total != null){
            return;
         }
         $.ajax({
             url: missionHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("missionTotal", total);
                }
             }
         });
    }

    function toCacheNoteTotal(){
         var total = getCache("noteTotal");
         if(total != null){
            return;
         }
         $.ajax({
             url: noteHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("noteTotal", total);
                }
             }
         });
    }

    function toCacheFinanceTotal(){
         var total = getCache("financeTotal");
         if(total != null){
            return;
         }
         $.ajax({
             url: financeHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("financeTotal", total);
                }
             }
         });
    }

    function toCacheProductOutputTotal(){
         var total = getCache("productOutputTotal");
         if(total != null){
            return;
         }
         $.ajax({
             url: outputHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("productOutputTotal", total);
                }
             }
         });
    }

    function toCacheTradeGoodsTotal(){
         var total = getCache("tradeGoodsTotal");
         if(total != null){
            return;
         }
         $.ajax({
             url: tradeGoodsHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("tradeGoodsTotal", total);
                }
             }
         });
    }

     function toCacheShareUserTotal() {
         var total = getCache("shareUserTotal");
         if(total != null){
            return;
         }
         $.ajax({
             url: shareUserHost + "/count",
             method: 'GET',
             success: function(obj) {
                if(obj.code == 1){
                    var total = obj.data;
                    toCache("shareUserTotal", total);
                }
             }
         });
     }
//-----------------------------------------------------------------------------------------------------------------------------

     function getAvatar() {
          var jsonStr = getCache(INIT.USER_AVATAR);
          if (jsonStr == null) {
              $.ajax({
                 url: userHost + "/get/avatar",
                 method: 'GET',
                 async: false,
                 success: function(obj) {
                     if (obj.code != 1) {
                         return;
                     }
                     jsonStr = obj.data.imgUrl;
                     if(jsonStr != null && jsonStr != ""){
                         toCache(INIT.USER_AVATAR, jsonStr);
                     }
                 }
              });
          }
          return jsonStr;
     }
//-----------------------------------------------------------------------------------------------------------------------------

    function getHomePageValue(homePage) {
        var homePageArray = getHomePageSelect();
        var val;
        $.each(homePageArray, function(index, value){
            if(homePage == index){
               val = value;
               return false;
            }
        });
        return val;
    }

    function getHomePageSelect() {
         var jsonStr = getCache(INIT.USER_HOME_PAGE);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: userHost + "/homePage",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if (obj.code != 1) {
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(INIT.USER_HOME_PAGE, jsonStr);
                }
             });
         }
         return jsonObj;
    }
//-----------------------------------------------------------------------------------------------------------------------------

    function getGoodsSupplierType() {
         var jsonStr = getCache(INIT.GOODS_SUPPLIER_TYPE);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: supplierHost + "/supplier/type",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if (obj.code != 1) {
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(INIT.GOODS_SUPPLIER_TYPE, jsonStr);
                }
             });
         }
         return jsonObj;
    }
//-----------------------------------------------------------------------------------------------------------------------------
     function toSumRecent2MonthGoodsTrade(){
         $.ajax({
                url: tradeMonthGoodsHost + "/sum/recent/2",
             method: 'GET',
            success: function(obj) {
                 if (obj.code != 1) {
                     return;
                 }
             }
         });
     }

//-----------------------------------------------------------------------------------------------------------------------------

    function removeSupplierCache(){
        removeCache("supplier");
    }

    function getTheSupplierSelect() {
         var key = "supplier";
         var jsonStr = getCache(key);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: supplierHost + "/get/select",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                        jsonObj = null;
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(key, jsonStr);
                }
             });
         }
         return jsonObj;
    }

    function removeGoodsCache(){
        removeCache("goods");
    }

    function getTheGoodsSelect() {
         var key = "goods";
         var jsonStr = getCache(key);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: goodsHost + "/get/select",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                        jsonObj = null;
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(key, jsonStr);
                }
             });
         }
         return jsonObj;
    }

    function getGoodsTradeType() {
         var jsonStr = getCache(INIT.GOODS_TRADE_TYPE);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: tradeGoodsHost + "/type/trade",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if (obj.code != 1) {
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(INIT.GOODS_TRADE_TYPE, jsonStr);
                }
             });
         }
         return jsonObj;
    }

//-----------------------------------------------------------------------------------------------------------------------------
    function toSumRecent2MonthProductOutput() {
        $.ajax({
            url: outputMonthHost + "/sum/recent/2",
            method: 'GET',
            success: function(obj) {
                if (obj.code != 1) {
                    return;
                }
            }
        });
    }
//-----------------------------------------------------------------------------------------------------------------------------
    function ifUnitIsInteger(unit) {
        var unitArray = getUnits();
        var result = false;
        $.each(unitArray, function(index, object){
            if(unit == object.unit && object.isInteger == 1){
               result = true;
               return false;
            }
        });
        return result;
    }

    function getUnits() {
         var jsonStr = getCache(INIT.UNIT);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: commonHost + "/unit/select",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if (obj.code != 1) {
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(INIT.UNIT, jsonStr);
                }
             });
         }
         return jsonObj;
    }
//-----------------------------------------------------------------------------------------------------------------------------
    function removeProductCache(){
        removeWithPrefix("product_");
    }

    function getTheProductSelect() {
         var key = "product_";
         var jsonStr = getCache(key);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: productHost + "/get/select",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                        jsonObj = null;
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(key, jsonStr);
                }
             });
         }
         return jsonObj;
    }

//-----------------------------------------------------------------------------------------------------------------------------
     function toSumRecent2MonthFinance() {
         $.ajax({
             url: financeMonthHost + "/sum/recent/2",
             method: 'GET',
             success: function(obj) {
                 if (obj.code != 1) {
                     return;
                 }
             }
         });
     }
//-----------------------------------------------------------------------------------------------------------------------------
    function getNoteType() {
         var jsonStr = getCache(INIT.NOTE_TYPE);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: noteHost + "/type",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if (obj.code != 1) {
                        jsonObj = null;
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(INIT.NOTE_TYPE, jsonStr);
                }
             });
         }
         return jsonObj;
    }
//-----------------------------------------------------------------------------------------------------------------------------
    function removeTransactionTypeCache(){
        removeWithPrefix("transaction_type_");
    }

    function getTransactionTypeSelect(flowType) {
         var key = "transaction_type_" + flowType;
         var jsonStr = getCache(key);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: transactionTypeHost + "/get/select?flowType="+flowType,
                method: 'GET',
                async: false,
                success: function(obj) {
                    if(obj.code != 1 || (obj.code == 1 && obj.data.count == 0)){
                        jsonObj = null;
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(key, jsonStr);
                }
             });
         }
         return jsonObj;
    }
//-----------------------------------------------------------------------------------------------------------------------------
    function getMissionPace() {
         var jsonStr = getCache(INIT.MISSION_PACE);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: missionHost + "/pace",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if (obj.code != 1) {
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(INIT.MISSION_PACE, jsonStr);
                }
             });
         }
         return jsonObj;
    }

    function getMissionType() {
         var jsonStr = getCache(INIT.MISSION_TYPE);
         var jsonObj;
         if (jsonStr != null) {
             jsonObj = JSON.parse(jsonStr);
         } else {
             $.ajax({
                url: missionHost + "/type",
                method: 'GET',
                async: false,
                success: function(obj) {
                    if (obj.code != 1) {
                        return;
                    }
                    jsonObj = obj.data;
                    var jsonStr = JSON.stringify(jsonObj);
                    toCache(INIT.MISSION_TYPE, jsonStr);
                }
             });
         }
         return jsonObj;
    }

//------------------------------------------------------------------------------------------------------------------------------