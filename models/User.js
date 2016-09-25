var mongoose = require('mongoose');

// ユーザモデル
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
コレクション定義
・user_id：ユーザID、一意制約あり
・user_name：ユーザ名
・password：パスワード
・message:メッセージ、以下のオブジェクトを配列で持つ
 -current:送信日時
 -from_id:送信者ID
 -from_name:送信者名
 -target_book:対象書籍
 -ms_body:メッセージ内容
 */