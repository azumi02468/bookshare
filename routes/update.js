var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var prop = require('./property/properties.js');
var message = require('./property/message.js');
var common = require('./common.js');
var cnst = require('./cnst.js');

/*
書籍更新画面（画面名：本棚を整理）
・画面描画
・書籍更新処理
・書籍削除処理
 */

// DB接続
var db = mongoose.createConnection(prop.mongodb);

// モデルの呼び出し
var bookSchema = require('../models/Book.js').bookSchema;
var Book = db.model('book', bookSchema);
var userSchema = require('../models/User.js').userSchema;
var User = db.model('user', userSchema);

/*
変数一覧
*/
// 検索結果を格納する変数
var data = "";

// 書籍更新画面描画
router.get('/update', function(req, res, next) {
    // セッションが登録されていない場合、ログイン画面にリダイレクトする
    common.isSession(req, res);
    updateRender(req, res, '');
});

// 書籍更新処理
router.post('/update', function(req, res, next){
    var update_data = {
        'title': req.body.u_title,
        'author': req.body.u_author,
        'publisherName': req.body.u_publisherName,
        'salesDate': req.body.u_salesDate,
        'itemPrice': req.body.u_itemPrice,
        'private': req.body.u_mode === String(cnst.NUMBERS.ZERO) ? false : true,
        'count': req.body.u_count,
        'remark': req.body.u_remark
    }

    Book.update({
        'isbn': req.body.u_isbn,
        'owner_id': req.session.user_id,
        'owner_name': req.session.user_name
    },{
        $set: update_data
    }, function(err){
        if (err){
            console.log(err);
            updateRender(req, res, message.update_err1);
        } else {
            updateRender(req, res, message.update_info1);
        }
    });
});

// 書籍削除処理
router.post('/delete', function(req, res, next){
    Book.remove({
        'isbn': req.body.d_isbn,
        'owner_id': req.session.user_id
    }, function(err){
        if (err){
            console.log(err);
            updateRender(req, res, message.update_err2);
        } else {
            updateRender(req, res, message.update_info2);
        }
    });
});

var updateRender = function(req, res, message) {
    var query = {
        'owner_id': req.session.user_id
    };

    // 全件取得
    Book.find(query, function(err, result){
        if (err){
            console.log(err);
        } else {
            console.log("クエリ：" + JSON.stringify(query));
            console.log("クエリ結果:"+result);
            for(var i=cnst.NUMBERS.ZERO; i<result.length; i++){
                if (result[i].private){
                    result[i].disp_mode = cnst.STR_PRIVATE;
                } else {
                    result[i].disp_mode = cnst.STR_SHARE;
                }
            }
            res.render('update', {
                title: prop.title,
                message: message,
                data: result
            });
        }
    });
}

module.exports = router;
