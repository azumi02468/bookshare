var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var prop = require('./property/properties.js');
var message = require('./property/message.js');
var common = require('./common.js');
var cnst = require('./cnst.js');

/*
書籍検索画面（画面名：本棚を閲覧）
・画面描画
・書籍検索処理
・メッセージ送信
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

// 書籍検索画面描画
router.get('/search', function(req, res, next) {
    data = "";

    // セッションが登録されていない場合、ログイン画面にリダイレクトする
    common.isSession(req, res);
    searchRender(req, res, '');
});

// CSV出力機能
router.get('/search/csv', function(req, res, next){
    // セッションが登録されていない場合、ログイン画面にリダイレクトする
    common.isSession(req, res);

    if (data){
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-disposition', 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(cnst.STR_CSVNAME));
        res.write(convertToCSV(data));
        res.end();
    }
    res.end();
});

// 書籍検索処理
router.post('/search', function(req, res, next){
    var query = {};
    var self_query = {};
    var other_query = {};
    var all = new RegExp(".*");

    // 自分の本は共有・プライベートにかかわらず取得する
    self_query.owner_id = req.session.user_id;
    // ISBN
    self_query.isbn = req.body.isbn ? req.body.isbn : all;
    // 書籍名
    self_query.title = req.body.title ? addRegexp(req.body.title, req.body.t_search_type) : all;
    // 著者
    self_query.author = req.body.author ? addRegexp(req.body.author, null) : all;
    // 出版社
    self_query.publisherName = req.body.publisherName ? addRegexp(req.body.publisherName, null) : all;
    // 所有者
    self_query.owner_name = req.body.owner_name ? addRegexp(req.body.owner_name, null) : all;

    // 他人のプライベートな本は対象外とする
    other_query.private = false;
    // ISBN
    other_query.isbn = req.body.isbn ? req.body.isbn : all;
    // 書籍名
    other_query.title = req.body.title ? addRegexp(req.body.title, req.body.t_search_type) : all;
    // 著者
    other_query.author = req.body.author ? addRegexp(req.body.author, null) : all;
    // 出版社
    other_query.publisherName = req.body.publisherName ? addRegexp(req.body.publisherName, null) : all;
    // 所有者
    other_query.owner_name = req.body.owner_name ? addRegexp(req.body.owner_name, null) : all;

    // 条件をORでつなぐ
    query.$or = [self_query, other_query];

    // 検索実行
    Book.find(query, function(err, result){
        if (err){
            console.log(err);
            searchRender(req, res, message.search_err1);
        } else {
            // 検索条件と検索結果のクエリはログに残す
            console.log("クエリ：" + JSON.stringify(query));
            console.log("クエリ結果:" + result);
            data = result
            searchRender(req, res, message.search_info1);
        }
    });
});

// メッセージ送信機能
router.post('/search/message', function(req, res, next){
    var formatted_current = common.getCurrentDateFormat();
    User.update({
        'user_id': req.body.to_user
    },{
        $push: {'message': {
            'current': formatted_current,
            'from_id': req.session.user_id,
            'from_name': req.session.user_name,
            'target_book': req.body.target_book,
            'ms_body': req.body.ms_body
        }}
    }, false, function(err){
        if (err){
            console.log(err);
            searchRender(req, res, message.search_err2);
        } else {
            searchRender(req, res, message.search_info2);
        }
    });
});

// 正規表現を付加した文字列を返す
var addRegexp = function(str, type){
    var regex_start = "^";
    var regex_end = "$";
    var regex_all = ".*";

    if (!type) {
        // あいまい検索
        return new RegExp(regex_all + str + regex_all);
    } else if (type === String(cnst.NUMBERS.ZERO)) {
        // 前方一致
        return new RegExp(regex_start + str + regex_all);
    } else if (type === String(cnst.NUMBERS.ONE)) {
        // 後方一致
        return new RegExp(regex_all + str + regex_end);
    } else {
        // 完全一致
        return str;
    }
}

// 検索結果をCSV形式に変換する
var convertToCSV = function(data){
    var new_line = "\n"
    var comma = ",";
    var csv_header = cnst.STR_CSVHEAD + new_line;
    var csv_body = "";
    for (var i=0; i < Object.keys(data).length; i++){
        csv_body += (i + cnst.NUMBERS.ONE) + comma + data[i].owner_name + comma + data[i].isbn + comma + data[i].title + comma
            + data[i].author + comma + data[i].publisherName + comma + data[i].salesDate + comma
            + data[i].itemPrice + comma + data[i].count + comma + data[i].remark.replace(/(^\s+)|(\s+$)/g, "") + new_line;
    }
    return csv_header + csv_body;
}

// レンダーメソッド
var searchRender = function(req, res, message){
    var user_list = [];
    User.find({}, function(err, result){
        if (err) {
            console.log(err);
            res.render('search', {
                title: prop.title,
                message: message.search_err3,
                data: data,
                user_list: user_list
            });
        } else {
            for (var i=0; i<result.length; i++) {
                user_list.push(result[i].user_name);
            }
            res.render('search', {
                title: prop.title,
                message: message,
                data: data,
                user_list: user_list
            });
        }
    });
}

module.exports = router;
