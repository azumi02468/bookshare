var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var prop = require('./property/properties.js');
var message = require('./property/message.js');
var common = require('./common.js');
var cnst = require('./cnst.js');

/*
新規ユーザ登録画面
・画面描画
・ユーザ登録処理
 */

// DB接続
var db = mongoose.createConnection(prop.mongodb);

// モデルの呼び出し
var userSchema = require('../models/User.js').userSchema;
var User = db.model('user', userSchema);

/*
変数一覧
 */

// 新規ユーザ登録画面描画
router.get('/create', function(req, res, next) {
    createRender(req, res, '');
});

// ユーザ登録処理
router.post('/create', function(req, res, next) {
    var ciphered_text = common.jvspr(req.body.pass);

    var user_data = new User({
        'user_id': req.body.user,
        'user_name': req.body.name,
        'password': ciphered_text,
        'message' : []
    });

    // ユーザ登録を行う
    user_data.save(function(err){
        // ユーザ登録失敗
        if (err){
            console.log(err);
            createRender(req, res, message.create_err1);
        // ユーザ登録完了
        } else {
            // ログイン画面にリダイレクトする
            res.redirect('/created');
        }
    });
});

// レンダーメソッド
var createRender = function(req, res, message){
    res.render('create',{
        title: prop.title,
        message: message
    });
}

module.exports = router;
