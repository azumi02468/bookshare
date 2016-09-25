var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var prop = require('./property/properties.js');
var message = require('./property/message.js');
var common = require('./common.js');
var cnst = require('./cnst.js');

// API呼び出し用
var https = require('https');
var async = require('async');

/*
書籍登録画面（画面名：本棚に登録）
・画面描画(確認・登録)
・書籍登録確認処理(ISBN/手動)
・書籍登録処理
 */

// DB接続
var db = mongoose.createConnection(prop.mongodb);

// モデルの呼び出し
var bookSchema = require('../models/Book.js').bookSchema;
var Book = db.model('book', bookSchema);

/*
変数一覧
*/

// 書籍登録画面描画
router.get('/regist', function(req, res, next) {
    // セッションが登録されていない場合、ログイン画面にリダイレクトする
    common.isSession(req, res);
    registRender(req, res, '');
});

// ISBN登録確認処理
router.post('/confirm/isbn', function(req, res, next) {
    i_post_waterfall(req, res);
});

// 手動登録確認処理
router.post('/confirm/manual', function(req, res, next){
    // 確認画面に渡すデータを作成する
    var data = {
        'title': req.body.m_title ? req.body.m_title : "",
        'author': req.body.m_author ? req.body.m_author : "",
        'publisherName': req.body.m_publisherName ? req.body.m_publisherName : "",
        'salesDate': req.body.m_salesDate ? req.body.m_salesDate : "",
        'itemPrice': req.body.m_itemPrice ? req.body.m_itemPrice : ""
    };

    var disp_mode = "";
    if (req.body.m_mode === String(cnst.NUMBERS.ZERO)){
        disp_mode = cnst.STR_SHARE;
    } else {
        disp_mode = cnst.STR_PRIVATE;
    }

    var target = {
        'isbn' : req.body.m_isbn ? req.body.m_isbn : "",
        'remark': req.body.m_remark ? req.body.m_remark : "",
        'mode': disp_mode,
        'count': req.body.m_count ? req.body.m_count : "",
        'im_flg': req.body.m_flg,
        'data' : data
    };

    confirmRender(req, res, target);
});

// 書籍登録処理
router.post('/regist', function(req, res, next) {
    var book_data = new Book({
        'isbn': req.body.isbn,
        'owner_id': req.session.user_id,
        'owner_name': req.session.user_name,
        'title': req.body.title,
        'author': req.body.author,
        'publisherName': req.body.publisherName,
        'salesDate': req.body.salesDate,
        'itemPrice': req.body.itemPrice,
        'private': req.body.mode === cnst.STR_PRIVATE ? true : false,
        'count': req.body.count,
        'remark': req.body.remark,
        'im_flg': req.body.im_flg === cnst.STR_MANUAL ? true : false
    });

    // 登録を行う
    book_data.save(function(err){
        // 書籍登録失敗
        if (err){
            console.log(err);
            registRender(req, res, message.regist_err1);
        // 書籍登録完了
        } else {
            registRender(req, res, message.regist_info1);
        }
    });
});

/*
以下の流れで同期処理を行う。
1. WEB-APIを叩き、書籍データを取得する。
2. 書籍データをレンダリングする。
※同期処理にしなければ、データ取得の前にレンダリングが行われてしまう。
 */
var i_post_waterfall = function(req, res){
    var isbn = req.body.i_isbn;
    var url = prop.booksearch_url;
    url += prop.app_id;
    url += '&isbn=' + isbn;

    async.waterfall([
        function(callback){
            var ret = '';
            https.get(url, function(response){
                var body = '';
                response.setEncoding('utf8');
                response.on('data', function(chunk){
                    body += chunk;
                });
                response.on('end', function(response){
                    ret = JSON.parse(body);
                    callback(null, ret);
                });
            }).on('error', function(e){
                console.log(e.message); //エラー時
            });
        }
    ], function(err, arg1){
        if (err) {
            console.log(err);
            registRender(req, res, message.regist_err2);
        }

        var disp_mode = "";
        if (req.body.i_mode === String(cnst.NUMBERS.ZERO)){
            disp_mode = cnst.STR_SHARE;
        } else {
            disp_mode = cnst.STR_PRIVATE;
        }

        if (arg1.count > cnst.NUMBERS.ZERO){
            var target = {
                'isbn' : isbn,
                'remark': req.body.i_remark,
                'mode': disp_mode,
                'count': req.body.i_count,
                'im_flg': req.body.i_flg,
                'data' : arg1.Items[0]
            };
            confirmRender(req, res, target);
        } else {
            registRender(req, res, message.regist_err2 + "ISBN:" + isbn);
        }
    })
};

// レンダーメソッド(登録画面)
var registRender = function(req, res, message){
    res.render('regist', {
        title: prop.title,
        message: message
    });
}

// レンダーメソッド(登録確認画面)
var confirmRender = function(req, res, target){
    res.render('confirm', {
        'title': prop.title,
        'isbn' : target.isbn,
        'remark': target.remark,
        'mode': target.mode,
        'count': target.count,
        'im_flg': target.im_flg,
        'data' : target.data
    });
}

module.exports = router;
