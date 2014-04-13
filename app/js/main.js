(function () {
    'use strict';

    angular.module('offlineApp', [])
    .controller('AppCtrl', ['$scope', '$window', function ($scope, $window) {

        $scope.online = navigator.onLine;

        $window.addEventListener("offline", function () {
            $scope.$apply(function() {
                $scope.online = false;
            });
        }, false);

        $window.addEventListener("online", function () {
            $scope.$apply(function() {
                $scope.online = true;
            });
        }, false);
    }]);

}());
