
angular.module('homeController', []).controller('homeController', ['$scope', '$location', homeController]);
angular.module('loginController', []).controller('loginController', ['$scope', '$location', '$http', '$timeout', loginController]);
angular.module('createTeamController', []).controller('createTeamController', ['$scope', '$location', '$http', createTeamController]);
angular.module('leaderBoardController', []).controller('leaderBoardController', ['$scope', '$location', leaderBoardController]);
angular.module('adminController', []).controller('adminController', ['$scope', '$http', adminController]);


var trumperyApp = angular.module('trumperyApp', ['ngRoute', 'homeController', 'loginController', 'leaderBoardController', 'createTeamController', 'adminController']);

trumperyApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'homeController'});
        $routeProvider.when('/join', {templateUrl: 'partials/join.html', controller: 'loginController'});
        $routeProvider.when('/leaderboard', {templateUrl: 'partials/leaderboard.html', controller: 'leaderBoardController'});
        $routeProvider.when('/joinWatch', {templateUrl: 'partials/joinWatch.html', controller: 'loginController'});
        $routeProvider.when('/createTeam', {templateUrl: 'partials/createTeam.html', controller: 'createTeamController'});
        $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'adminController'});
    }]);

