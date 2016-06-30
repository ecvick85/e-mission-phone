'use strict';

angular.module('emission.controllers', [])

.controller('RootCtrl', function($scope) {})

.controller('DashCtrl', function($scope) {})

.controller('SplashCtrl', function($scope, $ionicPlatform, $state, $interval, $rootScope) {
  console.log('SplashCtrl invoked');
  // alert("attach debugger!");
  // Currently loads main or intro based on whether onboarding is complete.
  // But easily extensible to storing the last screen that the user was on, 
  // or the users' preferred screen
  var changeState = function(destState) {
    console.log("loading "+destState);
    $state.go(destState);
    $interval.cancel(currPromise);
  };

  var loadPreferredScreen = function() {
    console.log("Checking to see whether we are ready to load the screen");
    if (window.plugins && window.plugins.appPreferences && window.Logger) {
      var prefs = plugins.appPreferences;
        window.Logger.log(window.Logger.LEVEL_INFO, "About to set theme from preference")
        prefs.fetch('dark_theme').then(function(value) {
          window.Logger.log(window.Logger.LEVEL_INFO, "preferred dark_theme = "+value)
          if (value == true) {
            $rootScope.dark_theme = true;
          } else {
            $rootScope.dark_theme = false;
          }
          window.Logger.log(window.Logger.LEVEL_INFO, "set dark_theme = "+$rootScope.dark_theme)
        });
        window.Logger.log(window.Logger.LEVEL_INFO, "About to navigate to preferred tab")
        prefs.fetch('setup_complete').then(function(value) {
          window.Logger.log(window.Logger.LEVEL_DEBUG, 'setup_complete result '+value);
          if (value == true) {
              window.Logger.log(window.Logger.LEVEL_INFO, 'changing state to root.main.diary');
              changeState('root.main.diary');
          } else {
              window.Logger.log(window.Logger.LEVEL_INFO, 'changing state to root.intro');
              changeState('root.intro');
          }
        }, function(error) {
          window.Logger.log(window.Logger.LEVEL_ERROR, "error "+error+" loading root.intro");
          changeState('root.intro');
        });
    } else {
      console.log("appPreferences plugin not installed, waiting...");
    }
  }
  var currPromise = $interval(loadPreferredScreen, 1000);
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    console.log("Finished changing state from "+JSON.stringify(fromState)
        + " to "+JSON.stringify(toState));
  });
  console.log('SplashCtrl invoke finished');
})


.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
