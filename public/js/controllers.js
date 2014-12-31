var homeController = function ($scope, $location) {
    $scope.gotoLogin = function () {
        $location.path('/login');
    };
};

var loginController = function ($scope, $location) {
    $scope.cancel = function () {
        $location.path('/');
    };
};
