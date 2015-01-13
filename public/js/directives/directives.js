angular.module('progressBar', []).directive('progressBar', function(){
  return {
    link:function($scope, element, attrs) {
      element.bind('.question-slider-progress', function() {
        element.height = calculateHeight($scope.potentialPoints, $scope.initialPoints);
      });
    }
  }

  var calculateHeight= function(potentialPoints, maximumPoints) {
    return (potentialPoints/maximumPoints)*100
  }
});
