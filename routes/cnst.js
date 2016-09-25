/*
定数一覧
ルール
１．定数名は「型_定数名」で表現する
２．すべて大文字とする
３．型は以下の通り
・STR:string
・NUM:number

※本当は、const.jsにしたかったが、
  constという予約語と被るのを避けるため。
 */

// 共有
exports.STR_SHARE = "共有";

// プライベート
exports.STR_PRIVATE = "プライベート";

// isbn
exports.STR_ISBN = "isbn";

// manual
exports.STR_MANUAL = "manual";

// ナンバー
exports.NUMBERS = {
    "ZERO"  : 0,
    "ONE"   : 1,
    "TWO"   : 2,
    "THREE" : 3,
    "FOUR"  : 4,
    "FIVE"  : 5,
    "SIX"   : 6,
    "SEVEN" : 7,
    "EIGHT" : 8,
    "NINE"  : 9,
}

// CSVファイル名
exports.STR_CSVNAME = "search_result.csv";

// CSVヘッダ
exports.STR_CSVHEAD = "No.,所有者,ISBN,書籍名,著者,出版社,発売日,価格,冊数,備考";