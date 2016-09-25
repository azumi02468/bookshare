var crypto = require("crypto");
var prop = require('./property/properties.js');

/*
共通関数一覧
 */

// 現在日時を返す
exports.getCurrentDate = function(){
    var now    = new Date();
    var year   = now.getFullYear();
    var month  = ('0' + (now.getMonth() + 1)).slice(-2);
    var date   = ('0' + now.getDate()).slice(-2);
    var hour   = ('0' + now.getHours()).slice(-2);
    var minute = ('0' + now.getMinutes()).slice(-2);
    var second = ('0' + now.getSeconds()).slice(-2);

    var currentDate = {
        'year'   : year,
        'month'  : month,
        'date'   : date,
        'hour'   : hour,
        'minute' : minute,
        'second' : second
    }
    return currentDate;
}

// 現在日付取得（フォーマット：yyyy/mm/dd HH:MM:SS）
exports.getCurrentDateFormat = function(){
    var current = this.getCurrentDate();
    return current.year + '/' + current.month + '/' + current.date + ' '
        + current.hour + ':' + current.minute + ':' + current.second;
}

// セッションがあるかどうかを判定
exports.isSession = function(req, res){
    if(!req.session.user_id) {
        res.redirect('/');
    }
}

exports.jvspr = function(target){
    var cipher = crypto.createCipher('aes192', prop.etwij);
    cipher.update(target, 'utf8', 'hex');
    return cipher.final('hex');
}