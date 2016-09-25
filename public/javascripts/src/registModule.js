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