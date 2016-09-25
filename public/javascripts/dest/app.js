angular.module("BookShare", [
    "registModule",// 書籍登録Module
    "bulkModule",// 書籍一括登録Module
    "updateModule",// 書籍更新削除Module
    "topModule",//TOPModule
    "searchModule" //書籍検索Module
    ])
    .controller("MainCtrl", ["$scope", function($scope){
    }])
    // 入力されたパスワードが再確認した値と一致しているか確認を行う。
    .directive("match", ["$parse", function($parse) {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(function() {
                    var target = $parse(attrs.match)(scope);  // 比較対象となるモデルの値
                    return !ctrl.$modelValue || target === ctrl.$modelValue;
                }, function(currentValue) {
                    ctrl.$setValidity('mismatch', currentValue);
                });
            }
        }
    }]);

$(function(){
    // 登録ボタン押下時
    $('#user_form').submit(function(){
        if (!confirm("入力した内容で登録します。よろしいですか。")){
            return false;
        }
    })
});
// 書籍一括登録Module
angular.module("bulkModule", [])
    .controller("BulkCtrl", ["$scope", function($scope){
        // 初期表示
        $scope.init = function(){
            $scope.count1 = 1;
            $scope.count2 = 1;
            $scope.count3 = 1;
            $scope.show_form1 = true;
        }
    }])
    .controller("BulkSubCtrl", ["$scope", function($scope){
        // ISBNにハイフンが含まれる場合、ハイフンを除いて返す
        $scope.change_isbn = function(){
            if ($scope.isbn1) {
                var str = $scope.isbn1;
                $scope.isbn1 = str.replace(/-/g, "");
            }
            if ($scope.isbn2) {
                var str = $scope.isbn2;
                $scope.isbn2 = str.replace(/-/g, "");
            }
            if ($scope.isbn3) {
                var str = $scope.isbn3;
                $scope.isbn3= str.replace(/-/g, "");
            }
        }
        // ISBNの13桁チェック(最大文字数)
        $scope.check_max_isbn = function(){
            var err = false;
            if ($scope.isbn1) {
                if ($scope.isbn1.length > 13) {
                    err = true;
                }
            }
            if ($scope.isbn2) {
                if ($scope.isbn2.length > 13) {
                    err = true;
                }
            }
            if ($scope.isbn3) {
                if ($scope.isbn3.length > 13) {
                    err = true;
                }
            }
            return err;
        }
    }])
// 書籍登録Module
angular.module("registModule", [])
    .controller("RegistCtrl", ["$scope", function($scope){
        // 初期表示
        $scope.i_count = 1;
        $scope.m_count = 1;
        $scope.isbn_flg = true;
        $scope.manual_flg = false;
        // 登録モードチェックボックス切り替え時の処理
        $scope.regist_change = function(){
            if ($scope.regist_type === "0") {
                $scope.isbn_flg = true;
                $scope.manual_flg = false;
            } else if ($scope.regist_type === "1") {
                $scope.isbn_flg = false;
                $scope.manual_flg = true;
            }
        }
        // ISBNにハイフンが含まれる場合、ハイフンを除いて返す
        $scope.change_isbn = function(){
            if ($scope.i_isbn) {
                var str = $scope.i_isbn;
                $scope.i_isbn = str.replace(/-/g, "");
            }
            if ($scope.m_isbn) {
                var str = $scope.m_isbn;
                $scope.m_isbn = str.replace(/-/g, "");
            }
        }
        // ISBNの13桁チェック(最大文字数)
        $scope.check_max_isbn = function(){
            var err = false;
            if ($scope.i_isbn) {
                if ($scope.isbn_flg === true && $scope.i_isbn.length > 13) {
                    err = true;
                }
            }
            if ($scope.m_isbn) {
                if ($scope.manual_flg === true && $scope.m_isbn.length > 13) {
                    err = true;
                }
            }
            return err;
        }
    }])
// 書籍検索Module
angular.module("searchModule", [])
    .controller("SearchCtrl", ["$scope", function($scope){
        $scope.c_owner = true;
        $scope.c_isbn = true;
        $scope.c_title = true;
        $scope.c_author = true;
        $scope.c_publisherName = true;
        $scope.c_salesDate = true;
        $scope.c_itemPrice = true;
        $scope.c_count = true;
        $scope.c_remark = true;

        var len = 10; // ページあたりの最大表示件数
        var start = 0; // 表示開始位置

        // ページャークリック時の処理
        $scope.pager = function(page) {
            start = len * page;
        }

        // 表示・非表示判定
        $scope.show = function(target) {
            if(start <= target && target < start + len) {
                return true;
            }
            return false;
        }

        // // 最大表示件数変更
        // $scope.len = function(length) {
        //     len = length;
        // }
    }])
    .controller("SearchSubCtrl", ["$scope", function($scope){
        // メッセージ送信ポップアップ
        console.log($scope);
    }])
// TOPModule
angular.module("topModule", [])
    .controller("TopCtrl", ["$scope", function($scope){
        var len = 5; // ページあたりの最大表示件数
        var start = 0; // 表示開始位置

        // ページャークリック時の処理
        $scope.pager = function(page) {
            start = len * page;
        }

        // 表示・非表示判定
        $scope.show = function(target) {
            if(start <= target && target < start + len) {
                return true;
            }
            return false;
        }

        // // 最大表示件数変更
        // $scope.len = function(length) {
        //     len = length;
        // }
    }])
// 書籍登録Module
angular.module("updateModule", [])
    .controller("UpdateCtrl", ["$scope", function($scope){
        var len = 10; // ページあたりの最大表示件数
        var start = 0; // 表示開始位置

        // ページャークリック時の処理
        $scope.pager = function(page) {
            start = len * page;
        }

        // 表示・非表示判定
        $scope.show = function(target) {
            if(start <= target && target < start + len) {
                return true;
            }
            return false;
        }

        // // 最大表示件数変更
        // $scope.len = function(length) {
        //     len = length;
        // }
    }])