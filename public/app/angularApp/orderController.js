app.controller('orderController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.visibility = true;
  
        $scope.per_page = 15;
        $scope.pagedata = [];
        $scope.DivOrderUser = true;
        $scope.DivEditOrder = true;
        $scope.DivFinishUser = true;
        $scope.DivViewOrder = true;
        $scope.page=1;
        $scope.price=0;
        $scope.pickup_price =0;
        $scope.drop_price = 0;
        $scope.product_price = 0;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        $scope.create_date = dd+'/'+mm+'/'+yyyy;
        if($routeParams['page']){
          $scope.page = $routeParams['page'];
        }
        $http.get('/order/getallorder?page='+$scope.page).success(function(datax) {
          
                for (var x in datax) {
                  var price = String(datax[x].transport_price);
                  var price1 = price.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                  datax[x].transport_price = price1;
                }

                $scope.albumList = datax;
            }
        );
        $http.get('/order/getallcity').success(function(data) {
               $scope.allprovince = data;
            }
        );
        $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
        });
        $http.get('/order/getcountorder').success(function(data) {
            $scope.countcompany = data['numofcompany'];
            $scope.numpage = $scope.countcompany/$scope.per_page+1;
            for (var i=1; i<=$scope.numpage; i++) {
                $scope.pagedata.push(i);
            }
        });
        $http.get('/order/getmaxordercodea').success(function(data) {
            $scope.order_code = Number(data['maxordercode']) + 1;
            $scope.ordercode = data['ordercode'];
            
        });
        $scope.openaddOrder = function (size) {
           var modalInstance =  ngDialog.open({
            controller: 'orderController',
            templateUrl: '/order/addorder',
            size: size,
            resolve: {
              items: function () {
                return $scope.items;

              }
            },
            closeByDocument: false,
            height: 700,
            width: 1000,
            showClose: true,

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

        $scope.openProcessOrder = function (id) {
            $scope.orderid = id;
            var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'processorderController',
            templateUrl: '/order/processorder',
            resolve: {
              companyid: function () {
                return $scope.companyid;
              }
            },
            closeByDocument: false,
            height: 830,
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

        $scope.openEditOrder = function (id) {
            $scope.orderid = id;
            var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'editorderController',
            templateUrl: '/order/editorder',
            resolve: {
              companyid: function () {
                return $scope.companyid;
              }
            },
            closeByDocument: false,
            height: 700,
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

        $scope.openfinishOrder = function (id) {
            $scope.orderid = id;
            var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'processorderController',
            templateUrl: '/order/finishorder',
            resolve: {
              companyid: function () {
                return $scope.companyid;
              }
            },
            closeByDocument: false,
            height: 830,
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

        $scope.openViewOrder = function (id) {
            $scope.orderid = id;
            var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'processorderController',
            templateUrl: '/order/vieworder',
            resolve: {
              companyid: function () {
                return $scope.companyid;
              }
            },
            closeByDocument: false,
            height: 830,
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

        $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        $scope.saveOrder = function () {
          if($scope.form.$valid){
            var Employee = {
                company: JSON.stringify($scope.company),
                pickup_province: JSON.stringify($scope.pickup_province),
                delivery_province: JSON.stringify($scope.delivery_province),
                pickup_phone:$scope.pickup_phone,
                address: $scope.address,
                delivery_address: $scope.delivery_address,
                delivery_phone: $scope.delivery_phone,
                count: $scope.count,
                mass: $scope.mass,
                volume: $scope.volume,
                price:$scope.price,
                product_name:$scope.product_name,
                order_id:$scope.order_code,
                order_code:$scope.ordercode,
                advance_price:$scope.advance_price,
                pickup_price:$scope.pickup_price,
                drop_price:$scope.drop_price,
                unit:$scope.unit,
                unit_number:$scope.unit_number,
                transport_price:$scope.transport_price,
                product_price:$scope.product_price,
                surcharge_fee:$scope.surcharge_fee,
                create_date:$scope.create_date,
            };
            $http({
                method: "post",
                url:'/order/addorderres',
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
            
            
          }
          else{
            alert("Vui lòng kiểm tra lại thông tin");
          }  
        };
        $scope.delUser = function(index) {
            var todel = index;
            if (confirm("Bạn muốn xóa đơn hàng?")) {
              $http({
                  method: "post",
                  url:'/order/delorderres',
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
app.controller('editorderController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.DivEditOrder = true;

        $http.get('/order/getorderinfo/'+$scope.orderid).success(function(data) {
                $scope.userinfo = data;
                $scope.create_dateedit = data.order_code;
            }
      
        );
        $http.get('/order/getcompanybyuser').success(function(data) {
                $scope.companybyuser = data;
                for (var x in data) {
                  if(data[x]._id==$scope.userinfo.company_id){
                      $scope.company = data[x];
                  }
                  
                }
                
            }
        );
        $http.get('/order/getallcity').success(function(data) {
                $scope.alleprovince = data;
                for (var x in data) {
                  if(data[x]._id==$scope.userinfo.pickup_province_id){
                      $scope.pickup_province = data[x];
                  }
                  if(data[x]._id==$scope.userinfo.delivery_province_id){
                      $scope.delivery_province = data[x];
                  }
                }
                
            }
        );
         $scope.changeeditprice = function (){
          if($scope.userinfo.surcharge_fee=='1'){
            $scope.userinfo.price = Number($scope.userinfo.product_price);
            $scope.userinfo.transport_price = Number($scope.userinfo.product_price) - Number($scope.userinfo.pickup_price) - Number($scope.userinfo.drop_price);
          }
          else{
            $scope.userinfo.price = Number($scope.userinfo.product_price) + Number($scope.userinfo.drop_price) + Number($scope.userinfo.pickup_price);
            $scope.userinfo.transport_price = Number($scope.userinfo.product_price);
          }
        }
        $scope.saveEditOrder  = function () {
          if($scope.form.$valid){
            var Employee = {
                company: JSON.stringify($scope.company),
                pickup_province: JSON.stringify($scope.pickup_province),
                delivery_province: JSON.stringify($scope.delivery_province),
                pickup_phone:$scope.userinfo.pickup_phone,
                address: $scope.userinfo.address,
                delivery_address: $scope.userinfo.delivery_address,
                delivery_phone: $scope.userinfo.delivery_phone,
                count: $scope.userinfo.count,
                mass: $scope.userinfo.mass,
                volume: $scope.userinfo.volume,
                price:$scope.userinfo.price,
                product_name:$scope.userinfo.product_name,
                order_id:$scope.userinfo.order_code,
                order_code:$scope.userinfo.ordercode,
                advance_price:$scope.userinfo.advance_price,
                pickup_price:$scope.userinfo.pickup_price,
                drop_price:$scope.userinfo.drop_price,
                unit:$scope.userinfo.unit,
                unit_number:$scope.userinfo.unit_number,
                transport_price:$scope.userinfo.transport_price,
                product_price:$scope.userinfo.product_price,
                surcharge_fee:$scope.userinfo.surcharge_fee,
                order_id:$scope.orderid,
                create_date:$scope.create_dateedit,
            };
            $http({
                method: "post",
                url:'/order/editorderres',
                data: $.param(Employee),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(result) {
                ngDialog.close();  
                $route.reload();  
          })
          .error(function(result) {

          }); 
        }else{
          alert("Vui lòng kiểm tra lại thông tin");
        }      
    };
}]);
app.controller('processorderController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.DivProcessUser = true;
        $scope.DivFinishUser = true;
        $scope.DivViewOrder = true;
        $http.get('/order/getorderinfo/'+$scope.orderid).success(function(data) {
                $scope.userinfo = data;
            }
      
        );
        $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
        });
        $scope.saveProcessOrder = function () {
          if($scope.form.$valid){
            var Employee = {
                driver: JSON.stringify($scope.driver),
                driver_price:$scope.driver_price,
                pair_price:$scope.pair_price,
                order_id:$scope.orderid,
                surcharge_price:$scope.surcharge_price,
            };
            $http({
                method: "post",
                url:'/order/processorderres',
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
          }
          else{
            alert("Bạn vui lòng nhập đầy đủ thông tin");
          }
      };
      $scope.finishOrder = function () {
            var Employee = {      
                order_id:$scope.orderid,
                driver_price:$scope.userinfo.driver_price,
                pair_price:$scope.userinfo.pair_price,
                surcharge_price:$scope.userinfo.surcharge_price,
            };
            $http({
                method: "post",
                url:'/order/finishorderres',
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
}]);