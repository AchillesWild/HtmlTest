
    if(ip != undefined){
        host = "http://" + ip + ":" + "8085";
    }
    var hostPrefix = host + "/record_admin";
    var adminHost = hostPrefix;
    var userHost = hostPrefix + "/user";
    var logHost = hostPrefix + "/log";
    var configHost = hostPrefix + "/config";
    var commonHost = hostPrefix + "/common";

    var pageSize = 10;

    const NOT_LOGIN = {CODE: "-300", MSG: "未登录 !"};
    const MSG_USER_NAME_CAN_NOT_BE_NULL = "账号不能为空 !";
    const MSG_ILLEGAL_USER_NAME = "账号非法 ! (长度2-32位, 只能包含数字, 字母, 下划线) !";
    const MSG_PASSWORD_CAN_NOT_BE_NULL = "密码不能为空 !";
    const MSG_ILLEGAL_PASSWORD_PROMPT = "密码非法 ! (长度6-32位, 只能包含数字, 字母, 键盘上的特殊字符(英文输入法))";
    const REQUESTS_TOO_FREQUENT = {CODE: "2002", MSG: "系统繁忙,请稍后重试 !"};
    const PERMISSION_DENIED = {CODE: "403", MSG: "permission denied !"};
    const AUTH_CODE_WRONG = {CODE: "405", MSG: "授权码错误 !"};

    const ADMIN_TOKEN = {
                 NAME: 'adminAuthorization'
          }

    const WHO = 'w' + 'h' + 'o';
    const SIGN =  'S' + 'i' + 'g' + 'n';
    const TRACE_ID =  'traceId';

   function getToken(){
        var token = getCache(ADMIN_TOKEN.NAME);
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
    }

    function addHeaderToken (xhr) {
        xhr.setRequestHeader(ADMIN_TOKEN.NAME, getCache(ADMIN_TOKEN.NAME));
        var w = getW();
        xhr.setRequestHeader(WHO, w);
        xhr.setRequestHeader(SIGN, getS(w));
        var traceId = getTraceId();
        console.log(traceId);
        xhr.setRequestHeader(TRACE_ID, traceId);
    }

    $.ajaxSetup({
        beforeSend:function(xhr) {
            addHeaderToken (xhr);
        }
    });

    $(document).ajaxComplete(function(event, xhr, settings) {
        var res = xhr.responseText;
        if (res == undefined) {
            return;
        }
        var jsonData = JSON.parse(res);
        ifToLoginByCode (jsonData.code);
        storageResponseHeaderToken (xhr);
    });

    function storageResponseHeaderToken (xhr) {
        var token = xhr.getResponseHeader(ADMIN_TOKEN.NAME);
        if (token == null) {
            return;
        }
        toCache(ADMIN_TOKEN.NAME, token);
    }

    function getNickName(){
        var userinfo = getUserInfoByToken(getToken());
        nickName = userinfo.nickName;
        return nickName;
    }

    function getUserInfoByToken(token) {
        ifToLoginByLocalToken();
        let params = token.split("."); //截取token，获取载体
        var userinfo = JSON.parse(decodeURIComponent(escape(window.atob(params[1].replace(/-/g, "+").replace(/_/g, "/")))));
        return userinfo;
    }

    function deleteAllCache(){
//        localStorage.clear();
        removeCache(ADMIN_TOKEN.NAME);
        removeCache("homePage");
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

    function getTraceId() {
        return "p" + getUuid();
    }

    function changeTrBgcolor(obj){
       var children = $(obj).parent().children();
       $.each(children, function(i, value){
          if (i % 2 == 0) {
              bgcolor = '#DCDCDC';
          } else {
              bgcolor = '#B0C4DE';
          }
          $(value).css("background-color", bgcolor);
       });
       $(obj).css("background-color", "#6B8E23");
    }

    function openMask(){
       $('.overlay').css('display','block');
    }

    function closeMask(){
       $('.overlay').css('display','none');
    }

   function loadingGifToGetFadeIn(){
      $("#loadingGifDiv").fadeIn();
      $("#loadingMsg").html("加载中...");
   }

   function loadingGifFadeOut(){
      $("#loadingGifDiv").fadeOut();
   }

   function closeViewDialog(){
       closeMask();
       $("#viewDiv").hide();
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