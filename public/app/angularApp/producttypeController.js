app.controller('producttypesController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.per_page = 15;
        $scope.pagedata = [];
        $scope.divadd = true;
        $scope.DivEditproducttypes = true;
        $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
        });
        $http.get('/producttypes/getallproducttypes?page='+$routeParams['page']).success(function(data) {
                $scope.albumList = data;
            }
        );
        $scope.openaddproducttypes = function (size) {
           var modalInstance =  ngDialog.open({
            controller: 'producttypesController',
            templateUrl: '/producttypes/addproducttypes',
            size: size,
            resolve: {
              items: function () {
                return $scope.items;
              }
            },
            closeByDocument: false,
            height: 500,
            width: 800,
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
        $scope.openeditproducttypes = function (id) {
            $scope.producttypesid = id;
            var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'editproducttypesController',
            templateUrl: '/producttypes/editproducttypes',
            resolve: {
              producttypesid: function () {
                return $scope.producttypesid;
              }
            },
            closeByDocument: false,
            height: 500,
            width: 800,
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


        $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        $scope.saveproducttypes = function () {
            var Employee = {
                name: $scope.name, 
            };
            $http({
                method: "post",
                url:'/producttypes/addproducttypesres',
                data: $.param(Employee),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(result, status, headers, config) {
                if(result["result"]==0){
                    alert("Vui lòng nhập đầy đủ thông tin");
                } 
                else{
                    ngDialog.close();
                    $route.reload();
                }       
            })
                .error(function(data, status, headers, config) {
                    console.log(data);
            });
            
        };
        $scope.delproducttypes = function(index) {
            var todel = index;
            if (confirm("Bạn có muốn xóa coonh ty này ko?")) {
              $http({
                  method: "post",
                  url:'/producttypes/dellproducttypesres',
                  data: $.param({id:todel}),
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
              }).success(function(result, status, headers, config) {
                //alert(result);
                $route.reload();

              })
              .error(function(data, status, headers, config) {
                  alert(data);
              });
            }
            
        };
        
}]);
app.controller('editproducttypesController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.divedit = true;
        $http.get('/producttypes/getproducttypesinfo/'+$scope.producttypesid).success(function(data) {
                $scope.userinfo = data;
            }
      
        );
        $scope.saveeditproducttypes = function () {
            var Employee = {
                name: $scope.userinfo.name,
                producttypesid:$scope.producttypesid
            };
            $http({
                method: "post",
                url:'/producttypes/editproducttypesres',
                data: $.param(Employee),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(result) {
                //alert(result);
                ngDialog.close();  
                $route.reload();  
        })
        .error(function(result) {
            alert(result);
         });       
    };
}]);