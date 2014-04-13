Offline.options = {
    checkOnLoad: true,
    checks: {xhr: {url: 'check-online.gif'}}
};

(function () {
    'use strict';

    angular.module('offlineApp', [])
    .controller('AppCtrl', ['$scope', function ($scope) {
        $scope.online = Offline.state || false;
        Offline.on("up", function () {
            $scope.$apply(function() {
                $scope.online = true;
            });
        }, this);
        Offline.on("down", function () {
            $scope.$apply(function() {
                $scope.online = false;
            });
        }, this);
    }]);

}());
