app.controller('userController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.per_page = 15;
        $scope.pagedata = [];
        $scope.DivNewUser = true;
        $scope.DivEditUser = true;
        $http.get('/register/getalluser?page='+$routeParams['page']).success(function(data) {
                $scope.albumList = data;
            }
        );
        $http.get('/register/getcountuser').success(function(data) {
            $scope.countcompany = data['numofcompany'];
            $scope.numpage = $scope.countcompany/$scope.per_page+1;
            for (var i=1; i<=$scope.numpage; i++) {
                $scope.pagedata.push(i);
            }
        });
        $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
        });
        $scope.openaddUser = function (size) {
           var modalInstance =  ngDialog.open({
            controller: 'userController',
            templateUrl: '/register/adduser',
            size: size,
            resolve: {
              items: function () {
                return $scope.items;
              }
            },
            closeByDocument: false,
            height: 600,
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
        $scope.openeditUser = function (id) {
            $scope.userid = id;
            var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'edituserController',
            templateUrl: '/register/edituser',
            resolve: {
              companyid: function () {
                return $scope.companyid;
              }
            },
            closeByDocument: false,
            height: 600,
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
        $scope.saveUser = function () {
          if($scope.form.$valid){
            var Employee = {
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                username:$scope.username,
                address:$scope.address,
                password:$scope.password,
                type:$scope.usertype,    
            };
            if($scope.password!=$scope.repassword){
              alert("Mật khẩu phải giống nhau");
            }
            else{
              $http({
                method: "post",
                url:'/register/adduserres',
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
            
          }
          else{
            alert("Bạn vui lòng nhập đầy đủ thông tin");
          }
            
            
        };
        $scope.delUser = function(index) {
            var todel = index;
            if (confirm("Bạn có muốn xóa user này ko?")) {
              $http({
                  method: "post",
                  url:'/register/deluserres',
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
app.controller('edituserController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
        // this configuration depends on your site.
        //debugger;
        $scope.DivEditUser = true;
        $scope.typeuser = [{id:1,value:'Administrator'},{id:2,value:'Moderator'},{id:3,value:'User'}];
        $scope.statususer = [{id:1,value:'Hoạt động'},{id:0,value:'Khóa'}];

        $http.get('/register/getuserinfo/'+$scope.userid).success(function(data) {
                $scope.userinfo = data;
                $scope.userstatus = data['status'];
                $scope.usertype = data['type'];
            }
      
        );
        $scope.saveEditUser  = function () {
          alert($scope.usertype);
            var Employee = {
                name: $scope.userinfo.name,
                username: $scope.userinfo.username,
                password: $scope.password,
                repassword: $scope.repassword,
                email: $scope.userinfo.email,
                phone:$scope.userinfo.phone,
                address:$scope.userinfo.address,
                type:$scope.usertype,
                status:$scope.userstatus,
                userid:$scope.userid
            };
            $http({
                method: "post",
                url:'/register/edituserres',
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