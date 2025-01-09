    function checkPositive(num) {
       var reg = /^[1-9]+([0-9]*)?$/;
       if (!reg.test(num)) {
            return false;
       }
       return true;
    }

    function checkPositiveInteger(num) {
       var reg = /^[1-9]+([0-9]*)?$/;
       if (!reg.test(num)) {
            return false;
       }
       return true;
    }

    function checkPositiveAndZero(num) {
       var reg = /^[0-9]+$/;
       if (!reg.test(num)) {
            return false;
       }
       return true;
    }


    function checkPositive2AndZero(num) {
       var reg = /^[0-9]+(.[0-9]{1,2})?$/;
       if (!reg.test(num)) {
           return false;
       }
       return true;
    }

    function checkPositive2(num) {
       var reg = /^[0-9]+(.[0-9]{1,2})?$/;
       if (!reg.test(num)) {
           return false;
       }
       if(Number(num) == 0){
           return false;
       }
       return true;
    }


    function checkPositive3(num) {
       var reg = /^[0-9]+(.[0-9]{1,3})?$/;
       if (!reg.test(num)) {
           return false;
       }
       if(Number(num) == 0){
           return false;
       }
       return true;
    }

    function checkUserName(str) {
       if(!containsLetter(str) && !containsNumber(str)){
           return false;
       }
       var reg = /^[a-zA-Z0-9_-]{2,32}$/;
       if (!reg.test(str)) {
           return false;
       }
       return true;
    }

    function checkPassWord(str) {
       if(!containsNumber(str) || !containsLetter(str)){
           return false;
       }
       var reg = /^[a-zA-Z0-9~\!@#\$%\^&\*\(\)_=\+\{\}\[\]:\/,\.\?\|\<\>\\]{6,32}$/;
       if (!reg.test(str)) {
           return false;
       }

       return true;
    }

    function containsNumber(str) {
        var reg=/\d/;
        return reg.test(str);
    }

    function containsLetter(str) {
        var reg=/[a-zA-Z]/;
        return reg.test(str);
    }