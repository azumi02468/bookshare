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

        // クリックイベント
        $scope.click = function(data){
            console.log("クリックされたのは、" + data.title);
            $scope.u_title = data.title;
            $scope.u_author = data.author;
            $scope.u_publisherName = data.publisherName;
            $scope.u_salesDate = data.salesDate;
            $scope.u_itemPrice = data.itemPrice;
            $scope.u_count = data.count;
            $scope.u_remark = data.remark;
        }
    }])