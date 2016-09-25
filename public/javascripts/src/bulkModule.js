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