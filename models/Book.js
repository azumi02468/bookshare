var mongoose = require('mongoose');

exports.bookSchema = new mongoose.Schema({
    'isbn': String,
    'owner_id': String,
    'owner_name': String,
    'title': String,
    'author': String,
    'publisherName': String,
    'salesDate': String,
    'itemPrice': String,
    'private': Boolean,
    'count': Number,
    'remark': String,
    'im_flg': Boolean
});

this.bookSchema.index({isbn: 1, owner_id: 1}, {unique: true});

/*
テーブル定義
・isbn：書籍のISBNコード(13桁)
・title：書籍名
・author：著者
・publisherName：出版社
・salesDate：発売日
・itemPrice：価格
・count：冊数
・private：書籍の閲覧権限(false:共有、true：プライベート)
・remark：備考
 */