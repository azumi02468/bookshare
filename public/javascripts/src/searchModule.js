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