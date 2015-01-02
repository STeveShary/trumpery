
angular.module('homeController', []).controller('homeController', ['$scope', '$location', homeController]);
angular.module('loginController', []).controller('loginController', ['$scope', '$location', loginController]);
angular.module('leaderBoardController', []).controller('leaderBoardController', ['$scope', '$location', leaderBoardController]);


var trumperyApp = angular.module('trumperyApp', ['ngRoute', 'homeController', 'loginController', 'leaderBoardController']);

trumperyApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'homeController'});
        $routeProvider.when('/join', {templateUrl: 'partials/join.html', controller: 'loginController'});
        $routeProvider.when('/leaderboard', {templateUrl: 'partials/leaderboard.html', controller: 'leaderBoardController'});
        $routeProvider.when('/joinWatch', {templateUrl: 'partials/joinWatch.html', controller: 'loginController'});
    }]);

