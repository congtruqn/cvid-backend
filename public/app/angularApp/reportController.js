app.controller('reportController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        $scope.DivViewReport = true;
        $scope.DivViewUserReport = true;
        $scope.DivViewCompanyReport = true;
        
        $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
        });
        $http.get('/register/getallusernotpage').success(function(data) {
                $scope.alluser = data;
            }
        );
        $scope.openreportall = function (size) {
          $scope.fromdate = $scope.all_from_date;
          $scope.todate = $scope.all_to_date;
           var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'reportallController',
            templateUrl: '/report/viewreportall',
            size: size,
            resolve: {
              items: function () {
                return $scope.items;
              }
            },
            closeByDocument: false,
            height: 800,
            width: 1000,
            showClose: true
          });
        
          modalInstance.opened.then(function () {
              $scope.modalOpen = true;
          });
          
          modalInstance.result.then(function (selectedItem) {
               $scope.modalOpen = false;
          }, function () {
              $scope.modalOpen = false;
          });
        };
       
        $scope.openuserreport = function (size) {
          $scope.fromdate = $scope.user_from_date;
          $scope.todate = $scope.user_to_date;
          $scope.reportuser = $scope.report_user
           var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'userreportController',
            templateUrl: '/report/viewuserreport',
            size: size,
            resolve: {
              items: function () {
                return $scope.items;
              }
            },
            closeByDocument: false,
            height: 800,
            width: 1000,
            showClose: true
          });
        
          modalInstance.opened.then(function () {
              $scope.modalOpen = true;
          });
          
          modalInstance.result.then(function (selectedItem) {
               $scope.modalOpen = false;
          }, function () {
              $scope.modalOpen = false;
          });
        };    
}]);
app.controller('userreportController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.DivViewUserReport = true;
        $scope.transportprice =0;
        $http.get('/orders/getuserreport?fromdate='+$scope.fromdate+'&todate='+$scope.todate+'&user_id='+$scope.reportuser._id).success(function(data) {
                $scope.albumList = data;
                for (var x in data) {
                  $scope.transportprice = Number($scope.transportprice) + Number(data[x].price);
                  data[x].price = data[x].price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                }
            }
        );
    
}]);
app.controller('reportallController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.DivViewReport = true;
        $scope.transportprice =0;
        $http.get('/orders/getallreport?fromdate='+$scope.fromdate+'&todate='+$scope.todate).success(function(data) {
                $scope.albumList = data;
                for (var x in data) {
                  $scope.transportprice = Number($scope.transportprice) + Number(data[x].price);
                  data[x].price = data[x].price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                }
            }
        ); 
}]);
