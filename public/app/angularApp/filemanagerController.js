app.controller('filemanagerController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,$route) {
        // this configuration depends on your site.
        $scope.DivViewReport = true;
        $scope.DivViewUserReport = true;
        $scope.DivViewCompanyReport = true;
}]);
<script type="text/javascript">
angular.module('FileManagerApp').config(['fileManagerConfigProvider', function (config) {
  var defaults = config.$get();
  config.set({
    appName: 'angular-filemanager',
    pickCallback: function(item) {
      var msg = 'Picked %s "%s" for external use'
        .replace('%s', item.type)
        .replace('%s', item.fullPath());
      window.alert(msg);
    },

    allowedActions: angular.extend(defaults.allowedActions, {
      pickFiles: true,
      pickFolders: false,
    }),
  });
}]);
</script>

