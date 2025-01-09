
    if(ip != undefined){
        host = "http://" + ip + ":" + "8083";
    }
    var hostPrefix = host + "/record";
    var commonHost = hostPrefix + "/common";
    var userHost = hostPrefix + "/user";
    var shareUserHost = userHost + "/share";
    var userNoticeHost = userHost + "/notice";
    var noteHost = hostPrefix + "/note";
    var missionHost = hostPrefix + "/mission";
    var financeHost = hostPrefix + "/finance";
    var financeMonthHost = financeHost + "/month";
    var transactionTypeHost = financeHost + "/transaction/type";
    var shareHost = hostPrefix + "/share";
    var commentHost = hostPrefix + "/comment";
    var goodsHost = hostPrefix + "/goods";
    var supplierHost = goodsHost + "/supplier";
    var goodsPriceListHost = goodsHost + "/price";
    var tradeGoodsHost = goodsHost + "/trade";
    var tradeMonthGoodsHost = tradeGoodsHost + "/month";
    var productHost = hostPrefix + "/product";
    var outputHost = productHost + "/output";
    var outputMonthHost = outputHost + "/month";
    var configHost = hostPrefix + "/config";

    var pageSize = 10;

    const NOT_LOGIN = {CODE: "-300", MSG: "未登录 !"};
    const USER_IS_MISSING = {CODE: "-302", MSG: "账号不存在 !"};
    const PASSWORD_IS_WRONG = {CODE: "-303", MSG: "密码错误 !"};
    const USER_NAME_HAS_EXISTED = {CODE: "-306", MSG: "账号已存在, 请修改 !"};
    const USER_IS_FROZEN = {CODE: "-307", MSG: "账号已被冻结 !"};
    const SHARE_USER_COUNT_EXCEED_LIMIT = {CODE: "-308", MSG: "每个账号最多创建5个分享账号 !"};
    const USER_NOT_SET_QUESTION = {CODE: "-311", MSG: "该账号未设置问题, 请通过其他方式找回密码 !"};
    const SHARE_USER = -312;
    const USER_IS_ABNORMAL = {CODE: "-313", MSG: "该账号异常 !"};
    const USER_IS_FROZEN_BY_WRONG_PASSWORD = {CODE: "-315"};
    const MASTER_AND_SHARE_USER_PASS_CAN_NOT_SAME = {CODE: "-316", MSG: "主账号和分享账号密码不能相同 !"};
    const NO_DATA = {CODE: "106", MSG: "没有查到数据 !"};
    const NAME_HAS_EXISTED = {CODE: "107", MSG: "名称已经存在, 请修改 !"};
    const DATA_TOO_LARGE = 108;
    const HAS_RELATED_DATA = 109;
    const TRANSACTION_TYPE_HAS_RELATED_DATA = "该交易类型存在业务数据，无法删除 !";
    const PRODUCT_HAS_RELATED_DATA = "该计量物存在业务数据，无法删除 !";
    const SUPPLIER_HAS_RELATED_DATA = "该供应商存在业务数据，无法删除 !";
    const GOODS_HAS_RELATED_DATA = "该商品存在业务数据，无法删除 !";
    const MSG_NICK_NAME_CAN_NOT_BE_NULL = "昵称不能为空 !";
    const MSG_USER_NAME_CAN_NOT_BE_NULL = "账号不能为空 !";
    const REQUESTS_TOO_FREQUENT = {CODE: "2002", MSG: "系统繁忙,请稍后重试 !"};
    const REQUESTS_TOO_FREQUENT_LIMIT = {CODE: "2008", MSG: "当前使用该功能的用户较多, 请稍后再试 !"};
    const PERMISSION_DENIED = {CODE: "403", MSG: "permission denied !"};
    const ABNORMAL_TIME = {CODE: "406", MSG: "设备时间异常, 请校对 !"};
    const REGISTER_OUT_OF_LIMIT = {CODE: "-314", MSG: "今日注册人数超出限制, 无法再注册 !"};

    const MISSION_OUT_OF_LIMIT = {CODE: "3000", MSG: "今日记录数超出限制, 无法再记录 !"};
    const NOTE_OUT_OF_LIMIT = {CODE: "4000", MSG: "今日记录数超出限制, 无法再记录 !"};
    const FINANCE_OUT_OF_LIMIT = {CODE: "5000", MSG: "今日记录数超出限制, 无法再记录 !"};
    const PRODUCT_OUTPUT_OUT_OF_LIMIT = {CODE: "6000", MSG: "今日记录数超出限制, 无法再记录 !"};
    const GOODS_TRADE_OUT_OF_LIMIT = {CODE: "7000", MSG: "今日记录数超出限制, 无法再记录 !"};

    const MSG_PASSWORD_CAN_NOT_BE_NULL = "密码不能为空 !";
    const MSG_OLD_PASSWORD_CAN_NOT_BE_NULL = "原密码不能为空 !";
    const MSG_NEW_PASSWORD_CAN_NOT_BE_NULL = "新密码不能为空 !";
    const MSG_NEW_PASSWORD_CAN_NOT_BE_EQUAL_OLD = "新密码和原密码不能相同 !";
    const MSG_INPUT_PASSWORD_AGAIN = "请再次输入密码 !";
    const MSG_INPUT_NEW_PASSWORD_AGAIN = "请再次输入新密码 !";
    const MSG_PASSWORD_NOT_SAME = "两次密码输入不一样 !";
    const MSG_NEW_PASSWORD_NOT_SAME = "两次新密码输入不一样 !";
    const MSG_ILLEGAL_USER_NAME = "账号非法 ! (长度2-32位, 只能包含数字, 字母, 下划线) !";
    const MSG_ILLEGAL_PASSWORD_PROMPT = "密码非法 ! (长度6-32位, 只能包含数字, 字母, 键盘上的特殊字符(英文输入法))";
    const MSG_PRODUCT_HAS_RELATED_DATA_CAN_NOT_UPDATE_UNIT = "该计量物存在业务数据, 无法修改单位 !";
    const MSG_ILLEGAL_ANSWER = "答案不能为空, 且长度不能超过64个字符 !";
    const MSG_QUESTION_CAN_NOT_SAME = '问题不能相同 !';
    const MSG_ANSWER_CAN_NOT_SAME = '答案不能相同 !';
    const MSG_SHARE_USER_CAN_NOT_FIND_PASSWORD = "该账号是分享账户, 无法找回密码 !";
    const MSG_SHARE_MODEL_MUST_CHOOSE = "分享的模块必选 !";
    const MSG_PAY_OR_INCOME_NAME_CHECK = "收/支名称不能为空, 且长度不能超过16个字符 !";
    const MSG_ORDER_CHECK = "顺序只能为自然数 !";
    const MSG_NAME_CAN_NOT_BE_NULL = "名称不能为空 !";
    const MSG_TITLE_64 = '标题不能为空且长度不能超过64个字符 !';
    const MSG_CODE_32 = '编号长度不能超过32个字符 !';
    const MSG_NAME_32 = '名称不能为空且长度不能超过32个字符 !';
    const MSG_NAME_64 = '名称不能为空且长度不能超过64个字符 !';
    const MSG_AMOUNT_CAN_NOT_BE_NULL = '金额不能为空 !';
    const MSG_AMOUNT_2 = '金额只能为正数(最多两位小数) !';
    const MSG_FLOW_TYPE_MUST_CHOOSE = '收/支类型必选(如果菜单为空, 请先添加收/支类型) !';
    const MSG_DATE_MUST_CHOOSE = '日期不能为空 !';
    const MSG_REMARK_1024 = '备注长度不能超过1024个字符 !';
    const MSG_REMARK_512 = '备注长度不能超过512个字符 !';
    const MSG_REMARK_128 = '备注长度不能超过128个字符 !';
    const MSG_REMARK_64 = '备注长度不能超过64个字符 !';
    const MSG_DESCRIPTION_1024 = '描述长度不能超过1024个字符 !';

    const GOODS_MUST_CHOOSE = '商品必选(如果下拉菜单为空, 请先添加商品) !';
    const MSG_NUMBER_CAN_NOT_BE_NULL = "数量不能为空 !";
    const MSG_NUMBER_3 = '数量只能为正数(最多3位小数) !';
    const MSG_UNIT_MUST_CHOOSE = '请选择单位 !';
    const MSG_UNIT_MUST_INTEGER = '该单位数量只能为整数 !';
    const MSG_UNIT_PRICE = '单价只能为正数(最多3位小数) !';
    const MSG_SUM_PRICE = '总价不能为空, 且只能为正数(最多2位小数) !';
    const MSG_SUPPLIER_MUST_CHOOSE = '请选择供应商, 如果无供应商可选, 请先维护供应商信息 !';

    const MSG_PRODUCT_MUST_CHOOSE = '计量物必选(如果下拉菜单为空, 请先添加计量物) !';
    const MSG_PRODUCT_512 = '计量物长度不能超过512个字符 !';
    const MSG_CONTACT_64 = '联系方式长度不能超过64个字符 !';
    const MSG_OTHER_CONTACT_128 = '其他联系方式长度不能超过128个字符 !';
    const MSG_EMAIL = 'email长度不能超过128个字符 !';
    const MSG_ADDRESS = '地址长度不能超过128个字符 !';

    const MSG_OLD_PASSWORD_IS_WRONG = '原密码错误 !';
    const SECOND_CONFIRM = "请您再次确认 !";
    const MODEL_IS_CLOSED = "该功能暂时关闭中 !";

    const TOKEN = {
                 NAME: 'Author' + 'ization',
                  WHO: 'w' + 'h' + 'o',
                 SIGN: 'S' + 'i' + 'g' + 'n',
            USER_NAME: 'userName',
            NICK_NAME: 'nickName',
             TRACE_ID: 'traceId',
            HOME_PAGE: 'homePage',
          SHARE_PAGES: 'sharePages',
      LAST_LOGIN_DATE: 'lastLoginDate'
    }

    const INIT = {
          MISSION_TYPE: 'missionType',
          MISSION_PACE: 'missionPace',
             NOTE_TYPE: 'noteType',
                  UNIT: 'unit',
      GOODS_TRADE_TYPE: 'goodsTradeType',
        GOODS_SUPPLIER: 'goodsSupplier',
   GOODS_SUPPLIER_TYPE: 'goodsSupplierType',
        USER_HOME_PAGE: 'userHomePage',
           USER_AVATAR: 'userAvatar',
   }

    const MAX_IMG_WIDTH = 500;
    const MAX_IMG_HEIGHT = 500;

    var DEFAULT_IMG_BASE64 = "data:image/jpg;base64,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";

    const CONNECT_MSG = '5qyi6L+O5L2/55So5pys57O757uf77yM5aaC6YGH6Zeu6aKY6K+36IGU57O7IDogQWNoaWxsZXNXaWxkQGhvdG1haWwuY29tIOaIliAyMjM2OTY2MjgwQHFxLmNvbSAh';

     function getToken(){
        var token = getCache(TOKEN.NAME);
        if (token == null) {
            ifToLoginByCode(null);
        }
        return token;
     }

    function ifToLoginByLocalToken() {
        var token = getToken();
        if (token == null) {
            deleteAllCache();
            top.location.href = "login.html";
         }
    }

    function ifToLoginByCode (code) {
        if (code == null || code == NOT_LOGIN.CODE) {
            deleteAllCache();
            top.location.href = "login.html";
         }
        if (code == USER_IS_ABNORMAL.CODE) {
            deleteAllCache();
            alert(USER_IS_ABNORMAL.MSG);
            top.location.href = "login.html";
         }
        if (code == REQUESTS_TOO_FREQUENT.CODE) {
            deleteAllCache();
            alert(REQUESTS_TOO_FREQUENT.MSG);
            top.location.href = "login.html";
         }
        if (code == PERMISSION_DENIED.CODE) {
            deleteAllCache();
            alert(PERMISSION_DENIED.MSG);
            top.location.href = "login.html";
         }
        if (code == ABNORMAL_TIME.CODE) { // ignore admin for now
            deleteAllCache();
            openAlert(ABNORMAL_TIME.MSG);
         }
         if (code == REQUESTS_TOO_FREQUENT_LIMIT.CODE) { // ignore admin for now
             openAlert(REQUESTS_TOO_FREQUENT_LIMIT.MSG);
          }
    }

    function addHeaderToken (xhr) {
        xhr.setRequestHeader(TOKEN.NAME, getCache(TOKEN.NAME));
        var w = getW();
        xhr.setRequestHeader(TOKEN.WHO, w);
        xhr.setRequestHeader(TOKEN.SIGN, getS(w));
        var traceId = getTraceId();
        console.log(traceId);
        xhr.setRequestHeader(TOKEN.TRACE_ID, traceId);
    }

    function storageResponseHeaderToken (xhr) {
        var token = xhr.getResponseHeader(TOKEN.NAME);
        if (token == null) {
            return;
        }
        toCache(TOKEN.NAME, token);
    }

    function getLastLoginDate(){
        var lastLoginDate = getCache(TOKEN.LAST_LOGIN_DATE);
        if (lastLoginDate == null || lastLoginDate == undefined || lastLoginDate == "undefined") {
            var userinfo = getUserInfoByToken(getToken());
            lastLoginDate = userinfo.lastLoginDate;
            toCache(TOKEN.LAST_LOGIN_DATE, lastLoginDate);
        }
        return lastLoginDate;
    }

    function getHomePage(){
        var homePage = getCache(TOKEN.HOME_PAGE);
        if (homePage == null || homePage == undefined || homePage == "undefined") {
            var userinfo = getUserInfoByToken(getToken());
            homePage = userinfo.homePage;
            toCache(TOKEN.HOME_PAGE, homePage);
        }
        return homePage;
    }

	function getHomePageValue(homePage){
        var homePageArray = getHomePageSelect();
        $.each(homePageArray, function(index, value){
            $("#homePage").append("<option value='" +index+ "'>"+value+"</option>");
        });
	}


    function getNickName(){
        var nickName = getCache(TOKEN.NICK_NAME);
        if (nickName == null || nickName == undefined || nickName == "undefined") {
            var userinfo = getUserInfoByToken(getToken());
            nickName = userinfo.nickName;
            toCache(TOKEN.NICK_NAME, nickName);
        }
        return nickName;
    }

    function getUserName(){
        var userName = getCache(TOKEN.USER_NAME);
        if (userName == null || userName == undefined || userName == "undefined") {
            var userinfo = getUserInfoByToken(getToken());
            userName = userinfo.userName;
            toCache(TOKEN.USER_NAME, userName);
        }
        return userName;
    }

    function ifShare(sharePage){
        return getSharePagesArray().includes(sharePage);
    }

    function getSharePagesArray(){
        var sharePages = getCache(TOKEN.SHARE_PAGES);
        if (sharePages == null || sharePages == undefined || sharePages == "undefined") {
            var userinfo = getUserInfoByToken(getToken());
            sharePages = userinfo.sharePages;
            toCache(TOKEN.SHARE_PAGES, sharePages);
        }

        if (sharePages == null) {
            return new Array();
        }
        return sharePages.split(',');
    }

    function getUserInfoByToken(token) {
        ifToLoginByLocalToken();
        let params = token.split("."); //截取token，获取载体
        var userinfo = JSON.parse(decodeURIComponent(escape(window.atob(params[1].replace(/-/g, "+").replace(/_/g, "/")))));
        return userinfo;
    }

    function isVip() {
        var userinfo = getUserInfoByToken(getToken());
        var userRole = userinfo.userRole;
        if(userRole == 1){
            return true;
        }
        return false;
    }

    function ifShareUser() {
        var userinfo = getUserInfoByToken(getToken());
        var parentUserId = userinfo.parentUserId;
        if(parentUserId != undefined && parentUserId != null){
            return true;
        }
        return false;
    }

    function deleteAllCache(){
//        localStorage.clear();
        removeCache(TOKEN.NAME);
        removeCache(TOKEN.NICK_NAME);
        removeCache(TOKEN.SHARE_PAGES);
        removeCache(TOKEN.LAST_LOGIN_DATE);
    }

    function resetUserCache(nickName, homePage){
        toCache(TOKEN.NICK_NAME, nickName);
    }

    function toCache(key, value){
        localStorage.setItem(key, value);
    }

    function getCache(key){
        var value = localStorage.getItem(key);
        return value;
    }

    function removeCache(key){
        localStorage.removeItem(key);
    }

    function removeWithPrefix(prefix) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        }
    }

    function getUuid() {
      const hexList = []
      for (let i = 0; i <= 15; i++) {
        hexList[i] = i.toString(16)
      }
      let uuid = ''
      for (let i = 1; i <= 36; i++) {
        if (i === 9 || i === 14 || i === 19 || i === 24) {
          uuid += '-'
        } else if (i === 15) {
          uuid += 4
        } else if (i === 20) {
          uuid += hexList[(Math.random() * 4) | 8]
        } else {
          uuid += hexList[(Math.random() * 16) | 0]
        }
      }
      return uuid.replace(/-/g, '');
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
      return null;
    }

    function getCurrentDate() {
        let date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        return Y + M + D;
    }

    function compressImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function() {
          const img = new Image();
          img.onload = function() {

            let width = img.width;
            let height = img.height;

            if (width > MAX_IMG_WIDTH || height > MAX_IMG_HEIGHT) {
              if (width / height > MAX_IMG_WIDTH / MAX_IMG_HEIGHT) {
                width = MAX_IMG_WIDTH;
                height = Math.round(MAX_IMG_WIDTH * img.height / img.width);
              } else {
                height = MAX_IMG_HEIGHT;
                width = Math.round(MAX_IMG_HEIGHT * img.width / img.height);
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              blob => resolve(new File([blob], file.name, { type: file.type })),
              file.type,
              1 // 压缩质量，可根据需要调整
            );
          };
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function compressImg(file, maxWidth, maxHeight) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function() {
          const img = new Image();
          img.onload = function() {

            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
              if (width / height > maxWidth / maxHeight) {
                width = maxWidth;
                height = Math.round(maxWidth * img.height / img.width);
              } else {
                height = maxHeight;
                width = Math.round(maxHeight * img.width / img.height);
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              blob => resolve(new File([blob], file.name, { type: file.type })),
              file.type,
              1 // 压缩质量，可根据需要调整
            );
          };
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function getW(){
        var words = murmurHash(djb2("QWE!R34TY%^&*(*(U124^<!@#fghtr57569Ha"));
        words = fnv1a(shuffleString("0876LJLZC5@$42235SDEF456456IO!P:\"{P*(67^57S2$" + words));
        words = murmurHash(fnv1a("#%$#^%&HKVB@%@#^*%)((*Wpherp4564" + words));
        words = djb2(reverseString(words + "RRYertw;rw'tyuVMB0@#$^&*&*(THUTYJYert8^"));
        words = shuffleString("sbjk83*&^(_!@#@#%$jhgjyu7897#$%%^&*&^8734g" + words);
        words = reverseString(shuffleString(words + ")(+}{|}{<DHF:L>?:>:O^&*^$GHR#TQW*ertyu$).sbjk8395"));
        words = reverseString(shuffleString(reverseString(words +"wer27202-JHKsffd#$YU^%I*&FRT#$^&hVBVMfghBN~!@#$%^&(*)_+:")));
        words = shuffleString(words);
        words = reverseString(shuffleString("Kw>erVBL:/'?Vj_-+k83*B~!~!@#@@#q$%ty><oaopk;Lk^X&*()" + words));
        var w = words + "_" + new Date().getTime();
        return w;
    }

    function getS(str){
        var s = reverseString(md5(str) + "@#$%f& rH*&()_I;fw)*()(*SS:KJIYU|IO4$%*&^*()PO<>?>LU~!~#$<");
        return s;
    }

    function djb2(str) {
        let hash = 5381; // 初始值
        for (let i = 0; i < str.length; i++) {
            // 使用位运算，将 hash 左移 5 位，然后与当前字符的 ASCII 值相加
            hash = (hash * 33) ^ str.charCodeAt(i);
        }
        return hash >>> 0; // 返回无符号值
    }

    function murmurHash(str) {
        let h = 0x6b8b4567;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = (h * 0x5bd1e995) >>> 0; // 乘以质数
            h ^= h >>> 15; // 混合
            h = (h * 0x5bd1e995) >>> 0; // 再次乘以质数
        }
        return h >>> 0; // 返回无符号32位整数
    }

    function fnv1a(str) {
        const prime = 0x01000193; // FNV prime
        let hash = 0x811c9dc5;      // FNV offset basis

        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash *= prime;
            hash = hash >>> 0;
        }

        return hash.toString(16);
    }

    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    function reverseString(str) {
        return str.split('').reverse().join('');
    }

function md5(message) {
    const rotateLeft = (lValue, cb) => (lValue << cb) | (lValue >>> (32 - cb));
    const addUnsigned = (lX, lY) => (lX & 0xFFFFFFFF) + (lY & 0xFFFFFFFF);

    const F = (x, y, z) => (x & y) | (~x & z);
    const G = (x, y, z) => (x & z) | (y & ~z);
    const H = (x, y, z) => x ^ y ^ z;
    const I = (x, y, z) => y ^ (x | ~z);

    const FF = (a, b, c, d, x, s, ac) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, F(b, c, d)), addUnsigned(x, ac)), s), b);
    const GG = (a, b, c, d, x, s, ac) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, G(b, c, d)), addUnsigned(x, ac)), s), b);
    const HH = (a, b, c, d, x, s, ac) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, H(b, c, d)), addUnsigned(x, ac)), s), b);
    const II = (a, b, c, d, x, s, ac) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, I(b, c, d)), addUnsigned(x, ac)), s), b);

    const convertToWordArray = str => {
        const lWordCount = (str.length + 8) >> 6 + 1;
        const lByteCount = lWordCount * 4;
        const lWordArray = new Array(lWordCount - 1);
        for ( i = 0; i < lByteCount; i++) {
            lWordArray[i >> 2 ]= str.charCodeAt(i) << ((i % 4) * 8);
        }
        lWordArray[lByteCount >> 2] = 0x80 << ((lByteCount % 4) * 8);
        lWordArray[lWordCount - 1] = str.length * 8;
        return lWordArray;
    };

    const main = (str) => {
        const x = convertToWordArray(str);
        let a = 0x67452301;
        let b = 0xEFCDAB89;
        let c = 0x98BADCFE;
        let d = 0x10325476;

        const k = [
            0xD76AA478, 0xE8C7B756, 0x242070DB, 0xC1BDCEEE,
            0xF57C0FAF, 0x4787C62A, 0xA8304613, 0xFD469501,
            0x698098D8, 0x8B44F7AF, 0xFFFF5BB1, 0x895CD7BE,
            0x6B901122, 0xFD987193, 0xA679438E, 0x49B40821,
            0xF61E2562, 0xC040B340, 0x265E5A51, 0xEAA127FA,
            0xD4EF3085, 0x04881D05, 0xD9C96157, 0xE6DB99E5,
            0x1FA27CF8, 0xC4AC5665, 0xF4292244, 0x432AFF97,
            0xAB9423A7, 0xFC93A039, 0x655B59C3, 0x8F0CCC92,
            0xFFEFF47D, 0x85845FF1, 0x6FA87E4F, 0xFE2CE6E0,
            0xA3014314, 0x4E0811A1, 0xF7537E82, 0xBD3AF235,
            0x2AD7D2BB, 0xEB86D391
        ];

        const r = [
            [7, 12, 17, 22],
            [5, 9, 14, 20],
            [4, 11, 16, 23],
            [6, 10, 15, 21]
        ];

        const s = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [8, 9, 10, 11],
            [12, 13, 14, 15]
        ];

        for (let i = 0; i < x.length; i += 16) {
            let [aTemp, bTemp, cTemp, dTemp] = [a, b, c, d];

            for (let j = 0; j < 64; j++) {
                let f, g;
                if (j < 16) {
                    f = F(bTemp, cTemp, dTemp);
                    g = j;
                } else if (j < 32) {
                    f = G(bTemp, cTemp, dTemp);
                    g = (5 * j + 1) % 16;
                } else if (j < 48) {
                    f = H(bTemp, cTemp, dTemp);
                    g = (3 * j + 5) % 16;
                } else {
                    f = I(bTemp, cTemp, dTemp);
                    g = (7 * j) % 16;
                }
                const temp = dTemp;
                dTemp = cTemp;
                cTemp = bTemp;
                bTemp = addUnsigned(bTemp, rotateLeft(addUnsigned(aTemp, addUnsigned(f, addUnsigned(x[i + g], k[j]))), r[Math.floor(j / 16)][j % 4]));
                aTemp = temp;
            }

            a = addUnsigned(a, aTemp);
            b = addUnsigned(b, bTemp);
            c = addUnsigned(c, cTemp);
            d = addUnsigned(d, dTemp);
        }

        return (toHex(a) + toHex(b) + toHex(c) + toHex(d)).toLowerCase();
    };

    const toHex = (value) => {
        let hex = '';
        for (let i = 0; i < 4; i++) {
            hex += ((value >> (i * 8)) & 0xFF).toString(16).padStart(2, '0');
        }
        return hex.split('').reverse().join('');
    };

    return main(message);
}

    function getYyyyMMddHHmmssSSS(date) {
        const pad = (num) => String(num).padStart(2, '0');
        const pad3 = (num) => String(num).padStart(3, '0');

        const yyyy = date.getFullYear();
        const MM = pad(date.getMonth() + 1); // 月份从0开始
        const dd = pad(date.getDate());
        const HH = pad(date.getHours());
        const mm = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        const SSS = pad3(date.getMilliseconds());

        return `${yyyy}${MM}${dd}${HH}${mm}${ss}${SSS}`;
    }

    function getDecode(str){
        return decodeURIComponent(atob(str).split('').map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
      }
