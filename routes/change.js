var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var prop = require('./property/properties.js');
var message = require('./property/message.js');
var common = require('./common.js');
var cnst = require('./cnst.js');

/*
パスワード変更画面
・画面描画
・パスワード変更処理
 */

// DB接続
var db = mongoose.createConnection(prop.mongodb);

// モデルの呼び出し
var userSchema = require('../models/User.js').userSchema;
var User = db.model('user', userSchema);

/*
変数一覧
 */

// パスワード変更画面描画
router.get('/change', function(req, res, next) {
    // セッションが登録されていない場合、ログイン画面にリダイレクトする
    common.isSession(req, res);
    changeRender(req, res, '');
});

// パスワード変更処理
router.post('/change', function(req, res, next) {
    var current_text = common.jvspr(req.body.current_pass);
    var new_text = common.jvspr(req.body.new_pass);

    User.find({
        'user_id': req.session.user_id
    }, function(err, result){
        if (err){
            console.log(err);
            changeRender(req, res, message.change_err1);
        } else {
            if (result[0].password === current_text){
                User.update({
                    'user_id': req.session.user_id
                },{
                    $set: {'password': new_text}
                }, false, function(err){
                    if (err){
                        console.log(err);
                        changeRender(req, res, message.change_err1);
                    } else {
                        changeRender(req, res, message.change_info1);
                    }
                });
            } else {
                changeRender(req, res, message.change_err2);
            }
        }
    });
});

// レンダーメソッド
var changeRender = function(req, res, message){
    res.render('change', {
        title: prop.title,
        message: message
    });
}

module.exports = router;
