angular.module('NerdForm', [])
.controller('MainController', ["$scope", "$http", function($scope, $http){
  $scope.showThanks = false;
  $scope.submitFailed = false;
  $scope.submit = function() {
    
    $http({
      method: 'POST',
      url: '/sendEmail',
      data: {
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        email: $scope.email
      }
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
      console.log('success!');
      $scope.$emit('animateThanks');
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(response);
      $scope.submitFailed = true;
      $scope.$emit('animateFail');
    });
  }
}])
.directive('thankYou', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var rawDOM = element[0];
      var hiddenMsg = rawDOM.getElementsByClassName('hidden-message');
      var svgCheck = document.getElementById('check-stroke');
      var circle = rawDOM.getElementsByClassName('circle')[0];
      var success = new TimelineMax({paused: true});
      // var fail = new TimelineMax({paused: true});

      // fail
      //   .to(rawDOM, 0.1, {x: 50})
      //   .to(rawDOM, 0.3, {x: 0, ease: })

      success
        .to(rawDOM, 0.4, {opacity: 1, width: '100%', height:'100%', pointerEvents: 'auto'})
        .to(rawDOM, 0.2, {borderRadius: 0, ease: Power2.easeOut}, '0.15')
        .to(circle, 0.2, {opacity: 1, scale: 1, ease: Power2.easeOut})
        .to(hiddenMsg, 0.5, {opacity: 1, ease: Power2.easeOut})
        .to(svgCheck, 0.2, {strokeDashoffset: '0%', ease: Power2.easeIn});
      

      scope.$on('animateThanks', function(){
        success.play();
      });
      scope.$on('animateFail', function() {
        TweenMax.fromTo(rawDOM, 0.4, {x: '50px'}, {x: 0, ease: Elastic.easeOut.config(1.5, 0.3)});
      })
    }
  }
})
.directive('formContainer', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.$on('animateFail', function() {
        TweenMax.fromTo(element, 0.4, {x: '50px'}, {x: 0, ease: Elastic.easeOut.config(1.5, 0.3)});
      })
    }
  }
});;