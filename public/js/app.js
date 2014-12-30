var trumperyApp = angular.module('trumperyApp', ['ngRoute', 'homeController', 'loginController']);

trumperyApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'homeController'});
        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'loginController'});

    }]);

