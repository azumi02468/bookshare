var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var prop = require('./property/properties.js');
var message = require('./property/message.js');
var common = require('./common.js');
var cnst = require('./cnst.js');

/*
TOP画面処理
・画面描画(メニュー、メッセージ)
・メッセージ削除機能
 */

// DB接続
var db = mongoose.createConnection(prop.mongodb);

// モデルの呼び出し
var userSchema = require('../models/User.js').userSchema;
var User = db.model('user', userSchema);

// 変数一覧

// TOP画面
router.get('/top', function(req, res, next) {
    // セッションが登録されていない場合、ログイン画面にリダイレクトする
    common.isSession(req, res);
    User.findOne({
        'user_id': req.session.user_id
    }, function(err, result){
        if (err){
            console.log(err);
            res.redirect('/');
        } else {
            var messages = result.message.sort(function(a, b){
                return (a.current < b.current ? 1 : -1);
            });
            console.log("メッセージはこちら:" +messages);
            topRender(req, res, '', messages);
        }
    });
});

// メッセージ削除機能
router.post('/ms_delete', function(req, res, next){
    var delete_target = {
        'current': req.body.del_current,
        'from_id': req.body.del_from_id,
        'from_name': req.body.del_from_name,
        'target_book': req.body.del_target_book,
        'ms_body': req.body.del_ms_body
    }

    User.findOne({
        'user_id': req.session.user_id
    }, function(err, result){
        if (err){
            console.log(err);
            topRender(req, res, message.top_err1, result.message);
        } else {
            var messages = result.message;
            var target_index = -1;
            for(var i=0; i<messages.length; i++){
                var compare_message = {
                    'current': messages[i].current,
                    'from_id': messages[i].from_id,
                    'from_name': messages[i].from_name,
                    'target_book': messages[i].target_book,
                    'ms_body': messages[i].ms_body
                }
                if (JSON.stringify(compare_message) === JSON.stringify(delete_target)){
                    target_index = i;
                    break;
                }
            }
            if (target_index >= 0){
                messages.splice(target_index, 1);
                messages.sort(function(a, b){
                    return (a.current < b.current ? 1 : -1);
                });
                User.update({
                    'user_id': req.session.user_id
                },{
                    $set: {
                        'message': messages
                    }
                }, function(err){
                    if (err){
                        console.log(err);
                        topRender(req, res, message.top_err1, result.message);
                    } else {
                        topRender(req, res, message.top_info1, messages);
                    }
                });
            } else {
                topRender(req, res, message.top_err1, result.message);
            }
        }
    });
});

// レンダーメソッド
var topRender = function(req, res, message, ms_data){
    res.render('top', {
        title: prop.title,
        message: message,
        name : req.session.user_name,
        ms_data: ms_data
    });
}

module.exports = router;