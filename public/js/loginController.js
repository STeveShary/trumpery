var loginController = angular.module('loginController', []);

loginController.controller('loginController', ['$scope', '$location', function ($scope, $location) {

    $scope.cancel = function () {
        $location.path('/');
    };
}]);