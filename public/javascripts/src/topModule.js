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