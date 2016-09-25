var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var prop = require('./property/properties.js');
var message = require('./property/message.js');
var common = require('./common.js');
var cnst = require('./cnst.js');

/*
ログイン画面
・画面描画
・ログイン処理
・ログアウト処理
 */

// DB接続
var db = mongoose.createConnection(prop.mongodb);

// モデルの呼び出し
var userSchema = require('../models/User.js').userSchema;
var User = db.model('user', userSchema);

/*
変数一覧
*/
// 現在のユーザ数
exports.user_count = 0;

// ログイン画面
router.get('/', function(req, res, next) {
    indexRender(req, res, '');
});

// ログイン画面(ユーザ作成後)
router.get('/created', function(req, res, next) {
    createdRender(req, res, message.index_info2);
});

// ログアウト処理
router.get('/logout', function(req, res, next){
    req.session.destroy();
    indexRender(req, res, message.index_info1);
});

// ログイン処理
router.post('/login', function(req, res, next) {
    var ciphered_text = common.jvspr(req.body.pass);

    User.find({
        'user_id': req.body.user,
        'password': ciphered_text
    }, function(err, result){
        if (err){
            console.log(err);
            indexRender(req, res, message.index_err1);
        } else {
            if (result.length > cnst.NUMBERS.ZERO){
                req.session.user_id = result[0].user_id;
                req.session.user_name = result[0].user_name;
                res.redirect('/top');
            } else {
                indexRender(req, res, message.index_err1);
            }
        }
    });
});

// レンダーメソッド
var indexRender = function(req, res, message){
    User.find({}, function(err, result){
        if (err){
            console.log(err);
            res.render('error', {
                title: prop.title,
                message: message.index_err2
            });
        } else {
            user_count = result.length;
            res.render('index', {
                title: prop.title,
                version: prop.version,
                message: message,
                user_count: user_count
            });
        }
    });
}

// ユーザ作成後のレンダー
var createdRender = function(req, res, message){
    User.find({}, function(err, result){
        if (err){
            console.log(err);
        } else {
            user_count = result.length;
            res.render('index', {
                title: prop.title,
                version: prop.version,
                message: message,
                user_count: user_count
            });
        }
    });
}

module.exports = router;
