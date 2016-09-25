var mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
    'user_id': {
        type: String,
        unique: true
    },
    'user_name': String,
    'password': String,
    'message': [{
        'current': String,
        'from_id': String,
        'from_name': String,
        'target_book': String,
        'ms_body': String
    }]
});

/*
テーブル定義
・user_id：ユーザID、一意制約あり
・user_name：ユーザ名
・password：パスワード
 */