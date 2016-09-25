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