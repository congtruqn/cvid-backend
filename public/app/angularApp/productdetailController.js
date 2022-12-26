app.controller('productdetailsController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.per_page = 15;
        $scope.pagedata = [];
        $scope.divadd = true;
        $scope.DivEditproductdetails = true;
        $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
        });
        $http.get('/productdetails/getallproductdetails?page='+$routeParams['page']).success(function(data) {
                $scope.albumList = data;
            }
        );
        $scope.openaddproductdetails = function (size) {
           var modalInstance =  ngDialog.open({
            controller: 'productdetailsController',
            templateUrl: '/productdetails/addproductdetails',
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
        $scope.openeditproductdetails = function (id) {
            $scope.productdetailsid = id;
            var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'editproductdetailsController',
            templateUrl: '/productdetails/editproductdetails',
            resolve: {
              productdetailsid: function () {
                return $scope.productdetailsid;
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
        $scope.saveproductdetails = function () {
            var Employee = {
                name: $scope.name, 
            };
            $http({
                method: "post",
                url:'/productdetails/addproductdetailsres',
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
        $scope.delproductdetails = function(index) {
            var todel = index;
            if (confirm("Bạn có muốn xóa coonh ty này ko?")) {
              $http({
                  method: "post",
                  url:'/productdetails/dellproductdetailsres',
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
app.controller('editproductdetailsController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.divedit = true;
        $http.get('/productdetails/getproductdetailsinfo/'+$scope.productdetailsid).success(function(data) {
                $scope.userinfo = data;
            }
      
        );
        $scope.saveeditproductdetails = function () {
            var Employee = {
                name: $scope.userinfo.name,
                productdetailsid:$scope.productdetailsid
            };
            $http({
                method: "post",
                url:'/productdetails/editproductdetailsres',
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