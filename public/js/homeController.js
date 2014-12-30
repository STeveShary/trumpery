var homeController = angular.module('homeController', []);

homeController.controller('homeController', ['$scope', '$location', function ($scope, $location) {

    $scope.gotoLogin = function () {
        $location.path('/login');

    };
}]);