var services = angular.module('services', []);
services.factory('scoresService', ['$http', '$location', '$q', scoresService]);

angular.module('homeController', []).controller('homeController', ['$scope', '$location', homeController]);
angular.module('loginController', []).controller('loginController', ['$scope', '$location', '$http', '$timeout', loginController]);
angular.module('createTeamController', []).controller('createTeamController', ['$scope', '$location', '$http', createTeamController]);
angular.module('leaderBoardController', []).controller('leaderBoardController', ['$scope', '$http', '$timeout', '$location', leaderBoardController]);
angular.module('playGameController', []).controller('playGameController', ['$scope', '$location','$http','$timeout', '$interval', 'scoresService', playGameController]);
angular.module('chooseGameController', []).controller('chooseGameController', ['$scope', '$location','$http', '$timeout', chooseGameController]);
angular.module('adminController', []).controller('adminController', ['$scope', '$http', adminController]);



var trumperyApp = angular.module('trumperyApp', ['ngAnimate', 'ngRoute', 'services', 'homeController', 'loginController', 'leaderBoardController', 'createTeamController', 'playGameController', 'adminController', 'chooseGameController']);

trumperyApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'homeController'});
        $routeProvider.when('/join', {templateUrl: 'partials/join.html', controller: 'loginController'});
        $routeProvider.when('/leaderboard', {templateUrl: 'partials/leaderboard.html', controller: 'leaderBoardController'});
        $routeProvider.when('/joinWatch', {templateUrl: 'partials/joinWatch.html', controller: 'loginController'});
        $routeProvider.when('/createTeam', {templateUrl: 'partials/createTeam.html', controller: 'createTeamController'});
        $routeProvider.when('/chooseGame', {templateUrl: 'partials/chooseGame.html', controller: 'chooseGameController'});
        $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'adminController'});
        $routeProvider.when('/play', {templateUrl: 'partials/play.html', controller: 'playGameController'});
    }]);

