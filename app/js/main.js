(function () {
    'use strict';

    angular.module('offlineApp', [])
    .controller('AppCtrl', ['$scope', function ($scope) {
        $scope.online = Offline.state || false;
        Offline.on("up", function () {
            $scope.$apply(function() {
                $scope.online = false;
            });
        }, this);
        Offline.on("down", function () {
            $scope.$apply(function() {
                $scope.online = true;
            });
        }, this);
    }]);

}());
