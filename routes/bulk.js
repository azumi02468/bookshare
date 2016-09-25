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
書籍一括登録画面
・画面描画
・書籍登録処理
・書籍登録完了/エラー処理
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
router.get('/bulk', function(req, res, next) {
    // セッションが登録されていない場合、ログイン画面にリダイレクトする
    common.isSession(req, res);
    bulkRender(req, res, '');
});

// 一括登録処理
router.post('/bulk', function(req, res, next) {
    bulk_post(req, res);
});

/*
以下の流れで同期処理を行う。
1. WEB-APIを叩き、書籍データを取得する。
2. 書籍データをレンダリングする。
※同期処理にしなければ、データ取得の前にレンダリングが行われてしまう。
 */
var bulk_post = function(req, res){
    // APIの同時リクエスト件数は３件までのため。
    var isbns = [
        {
            "isbn": req.body.isbn1,
            "mode": req.body.mode1,
            "count": req.body.count1,
            "remark": req.body.remark1
        }
    ];

    if(req.body.isbn2){
        isbns.push({
            "isbn": req.body.isbn2,
            "mode": req.body.mode2,
            "count": req.body.count2,
            "remark": req.body.remark2
        });
    }
    if(req.body.isbn3){
        isbns.push({
            "isbn": req.body.isbn3,
            "mode": req.body.mode3,
            "count": req.body.count3,
            "remark": req.body.remark3
        });
    }
    var url = prop.booksearch_url + prop.app_id;
    var error_list = [];
    var err_str = "";

    async.each(
        isbns,
        function(target, callback){
            var ret = '';
            var req_url = url + '&isbn=' + target.isbn;
            https.get(req_url, function(response){
                var body = '';
                response.setEncoding('utf8');
                response.on('data', function(chunk){
                    body += chunk;
                });
                response.on('end', function(response){
                    ret = JSON.parse(body);
                    registBook(req, res, ret, target, error_list);
                    callback();
                });
            }).on('error', function(e){
                console.log(e.message); //エラー時
            });
        },
        function(err){
        if (err) {
            console.log(err);
            bulkRender(req, res, message.bulk_err1);
        }

        if (error_list.length > 0) {
            for (var i=0; i<error_list.length; i++){
                err_str += error_list[i];
                err_str += ",";
            }
            bulkRender(req, res, err_str + message.bulk_err2);
        }

        bulkRender(req, res, message.bulk_info1);
    });
};

// レンダーメソッド
var bulkRender = function(req, res, message){
    res.render('bulk', {
        title: prop.title,
        message: message
    });
}

// 書籍登録メソッド
var registBook = function(req, res, data, target, error_list){
    var book_data = new Book();
    // データをオブジェクトに格納
    if (data.count > cnst.NUMBERS.ZERO){
        book_data = new Book({
            'isbn': data.Items[0].isbn,
            'owner_id': req.session.user_id,
            'owner_name': req.session.user_name,
            'title': data.Items[0].title,
            'author': data.Items[0].author,
            'publisherName': data.Items[0].publisherName,
            'salesDate': data.Items[0].salesDate,
            'itemPrice': data.Items[0].itemPrice,
            'private': target.mode === cnst.STR_PRIVATE ? true : false,
            'count': target.count,
            'remark': target.remark,
            'im_flg': req.body.im_flg === cnst.STR_MANUAL ? true : false
        });
    }

    // 登録を行う
    book_data.save(function(err){
        // 書籍登録失敗
        if (err){
            console.log(err);
            return error_list.push(data.Items[0].isbn);
        // 書籍登録完了
        } else {
            return;
        }
    });
}

module.exports = router;
