app.controller('listreportallController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
      $scope.per_page = 20;
      $scope.pagedata = [];

      $scope.DivViewReport = true;
      $scope.page=1;
      if($routeParams['page']){
          $scope.page = $routeParams['page'];
      }

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var firstDay = '01/'+mm+'/'+yyyy;
      var lastDayofMonth = new Date(yyyy, mm, 0);
      var dayEndMonth = lastDayofMonth.getDate();
      var lastDay = dayEndMonth+'/'+mm+'/'+yyyy;

      $scope.fromdate = $scope.all_from_date;
      $scope.todate = $scope.all_to_date;

      if($routeParams['fromdate']){
          $scope.fromdate = $routeParams['fromdate'];
      }
      if($routeParams['todate']){
          $scope.todate = $routeParams['todate'];
      }


      if($scope.fromdate==undefined||$scope.todate==undefined){
          $scope.fromdate = firstDay;
          $scope.todate = lastDay;
      }

      $http.get('/orders/getcountproductsorderbydate?fromdate='+$scope.fromdate+'&todate='+$scope.todate).success(function(data) {
        $scope.countcompany = data['numofcompany'];
        $scope.numpage = $scope.countcompany/$scope.per_page+1;
        for (var i=1; i<=$scope.numpage; i++) {
            $scope.pagedata.push(i);
        }
      });

      $http.get('/orders/getallreport?fromdate='+$scope.fromdate+'&todate='+$scope.todate+'&page='+$scope.page).success(function(data) {   
                for (var x in data) {
                  $scope.profit= (Number(data[x].sell_price) - Number(data[x].buy_price))*Number(data[x].count);
                  if(typeof data[x].surcharge_price== 'number'){
                      $scope.surchargeprice= Number($scope.surchargeprice) + Number(data[x].surcharge_price);
                  }
                  if(typeof data[x].driver_price== 'number'){
                      $scope.driverprice = Number($scope.driverprice) + Number(data[x].driver_price);
                  }
                  if(typeof data[x].pickup_price== 'number'){
                      $scope.pickupprice = Number($scope.pickupprice) + Number(data[x].pickup_price);
                  }
                  if(typeof data[x].drop_price== 'number'){
                      $scope.dropprice = Number($scope.dropprice) + Number(data[x].drop_price);
                  }
                  data[x].profit = $scope.profit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                  var timestamp = data[x].create_date;
                  var date = new Date(timestamp);
                  var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                  data[x].bdatetime = datevalues;

                }
                $scope.albumList = data;
            }
      );
      $scope.reloadreportall = function () {
        $scope.albumList = '';


        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var firstDay = '01/'+mm+'/'+yyyy;
        var lastDayofMonth = new Date(yyyy, mm, 0);
        var dayEndMonth = lastDayofMonth.getDate();
        var lastDay = dayEndMonth+'/'+mm+'/'+yyyy;

        $scope.fromdate = $scope.all_from_date;
        $scope.todate = $scope.all_to_date;

        if($routeParams['fromdate']){
            $scope.fromdate = $routeParams['fromdate'];
        }
        if($routeParams['todate']){
            $scope.todate = $routeParams['todate'];
        }


        if($scope.fromdate==undefined||$scope.todate==undefined){
            $scope.fromdate = firstDay;
            $scope.todate = lastDay;
        }
        $http.get('/orders/getallreport?fromdate='+$scope.fromdate+'&todate='+$scope.todate+'&page='+$scope.page).success(function(data) {
                $scope.albumList = data;
                for (var x in data) {
                  $scope.profit= Number(data[x].buy_price) - Number(data[x].sell_price);
                  if(typeof data[x].driver_price== 'number'){
                      $scope.driverprice = Number($scope.driverprice) + Number(data[x].driver_price);
                  }
                  if(typeof data[x].pickup_price== 'number'){
                      $scope.pickupprice = Number($scope.pickupprice) + Number(data[x].pickup_price);
                  }
                  if(typeof data[x].drop_price== 'number'){
                      $scope.dropprice = Number($scope.dropprice) + Number(data[x].drop_price);
                  }
                  $scope.profit= Number(data[x].sell_price) - Number(data[x].buy_price);
                  data[x].profit = $scope.profit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                }
                
            }
        );
        //$location.path('/administrator/listreportall');
      }

        // this configuration depends on your site.
}]);
app.controller('orderreportController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {
      $scope.per_page = 20;
      $scope.pagedata = [];
      $scope.divadd = true;
      $scope.divedit = true;
      $scope.page=1;
      $scope.DivViewReport = true;

      $scope.all_discount = 0;
      $scope.all_buy_price = 0;
      $scope.all_sell_price = 0;
      $scope.all_profit = 0;

      if($routeParams['page']){
          $scope.page = $routeParams['page'];
      }

      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var firstDay = '01/'+mm+'/'+yyyy;
      var lastDayofMonth = new Date(yyyy, mm, 0);
      var dayEndMonth = lastDayofMonth.getDate();
      var lastDay = dayEndMonth+'/'+mm+'/'+yyyy;

      $scope.fromdate = $scope.all_from_date;
      $scope.todate = $scope.all_to_date;

      if($routeParams['fromdate']){
          $scope.fromdate = $routeParams['fromdate'];
      }
      if($routeParams['todate']){
          $scope.todate = $routeParams['todate'];
      }


      if($scope.fromdate==undefined||$scope.todate==undefined){
          $scope.fromdate = firstDay;
          $scope.todate = lastDay;
      }

      $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
      });
      $http.get('/register/getallusernotpage').success(function(data) {
                $scope.alluser = data;
            }
      );
      $http.get('/orders/getcountorderbydate?fromdate='+$scope.fromdate+'&todate='+$scope.todate).success(function(data) {
        $scope.countcompany = data['numofcompany'];
        $scope.numpage = $scope.countcompany/$scope.per_page+1;
        for (var i=1; i<=$scope.numpage; i++) {
            $scope.pagedata.push(i);
        }
      });

      $http.get('/orders/getsumallprofit?fromdate='+$scope.fromdate+'&todate='+$scope.todate).success(function(data) {
        $scope.sumall = data;
        $scope.all_discount = data['saleoff_monney'];
        $scope.all_buy_price = data['buy_monney'];
        $scope.all_sell_price = data['total_monney'];
        $scope.all_profit = Number($scope.all_sell_price) - Number($scope.all_buy_price) -Number($scope.all_discount);
      });
     

      $http.get('/orders/getallorderbydate?fromdate='+$scope.fromdate+'&todate='+$scope.todate+'&page='+$scope.page).success(function(data) {
                for (var x in data) {
                  $scope.profit= (Number(data[x].total_monney) - Number(data[x].buy_monney));
                  if(typeof data[x].saleoff_monney== 'number'){
                      $scope.profit = (Number(data[x].total_monney) - Number(data[x].buy_monney) - Number(data[x].saleoff_monney));
                      
                  }
                  //$scope.all_profit = Number($scope.all_profit) + Number($scope.profit);
                  data[x].profit = $scope.profit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                  var timestamp = data[x].create_date;
                  var date = new Date(timestamp);
                  var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                  data[x].bdatetime = datevalues;
                  

                }
                $scope.all_profit = $scope.all_profit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                $scope.albumList = data;
            }
      );
      $scope.reloaduserreport = function () {
        $scope.all_profit = 0;
        $scope.albumList = '';
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var firstDay = '01/'+mm+'/'+yyyy;
        var lastDay = '00/'+Number(mm+1)+'/'+yyyy;
        $scope.fromdate = $scope.user_from_date;
        $scope.todate = $scope.user_to_date;
        $scope.reporttype =$scope.report_type;
        if($scope.fromdate==undefined||$scope.todate==undefined){
            $scope.fromdate = firstDay;
            $scope.todate = lastDay;
        }
        $http.get('/orders/getcountorderbydate?fromdate='+$scope.fromdate+'&todate='+$scope.todate).success(function(data) {
          $scope.countcompany = data['numofcompany'];
          $scope.numpage = $scope.countcompany/$scope.per_page+1;
          for (var i=1; i<=$scope.numpage; i++) {
              $scope.pagedata.push(i);
          }
        });

        $http.get('/orders/getsumallprofit?fromdate='+$scope.fromdate+'&todate='+$scope.todate).success(function(data) {
          $scope.sumall = data;
          $scope.all_discount = data['saleoff_monney'];
          $scope.all_buy_price = data['buy_monney'];
          $scope.all_sell_price = data['total_monney'];
          $scope.all_profit = Number($scope.all_sell_price) - Number($scope.all_buy_price) -Number($scope.all_discount);
        });

        $http.get('/orders/getallorderbydate?fromdate='+$scope.fromdate+'&todate='+$scope.todate+'&page='+$scope.page).success(function(data) {
          for (var x in data) {
                  $scope.profit= (Number(data[x].total_monney) - Number(data[x].buy_monney));
                  if(typeof data[x].saleoff_monney== 'number'){
                      $scope.profit = (Number(data[x].total_monney) - Number(data[x].buy_monney) - Number(data[x].saleoff_monney));
                      
                  }
                  //$scope.all_profit = Number($scope.all_profit) + Number($scope.profit);

                  data[x].profit = $scope.profit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                  var timestamp = data[x].create_date;
                  var date = new Date(timestamp);
                  var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                  data[x].bdatetime = datevalues;
                 

                }
                $scope.all_profit = $scope.all_profit.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                $scope.albumList = data;
          }
        );
        //$location.path('/administrator/listreportall');
      }
      $scope.returnOrder = function(index) {
            var todel = index;
            if (confirm("Bạn có chắc muốn xuất trả đơn hàng?")) {
              $http({
                  method: "post",
                  url:'/orders/returnorder',
                  data: $.param({id:todel}),
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
              }).success(function(result, status, headers, config) {
                //alert(result);
                $route.reload();

              })
              .error(function(data, status, headers, config) {
                  $route.reload();
              });
            }
            
        };
}]);
app.controller('listreportcompanyController', ['$scope', '$http', '$rootScope', '$routeParams','$location','fileUpload','ngDialog','$route',
    function ($scope, $http, $rootScope,$routeParams, $location,fileUpload,ngDialog,$route) {

      $http.get('/order/getcompanybyuser').success(function(data) {
                $scope.companybyuser = data;
            }
      );

      $scope.DivViewReport = true;
      $scope.transportprice =0;
      $scope.surchargeprice =0;
      $scope.driverprice =0;
      $scope.pickupprice =0;
      $scope.dropprice =0;
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var firstDay = '01/'+mm+'/'+yyyy;
      var lastDay = '00/'+Number(mm+1)+'/'+yyyy;
      $scope.fromdate = $scope.all_from_date;
      $scope.todate = $scope.all_to_date;
      if($scope.fromdate==undefined||$scope.todate==undefined){
          $scope.fromdate = firstDay;
          $scope.todate = lastDay;
      }
      $scope.reloadreportall = function () {
        $scope.albumList = '';
        $scope.transportprice =0;
        $scope.surchargeprice =0;
        $scope.driverprice =0;
        $scope.pickupprice =0;
        $scope.dropprice =0;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var firstDay = '01/'+mm+'/'+yyyy;
        var lastDay = '00/'+Number(mm+1)+'/'+yyyy;
        $scope.fromdate = $scope.user_from_date;
        $scope.todate = $scope.user_to_date;
        $scope.reporttype =$scope.report_type;
        if($scope.fromdate==undefined||$scope.todate==undefined){
            $scope.fromdate = firstDay;
            $scope.todate = lastDay;
        }
        $http.get('/order/getcompanyreport?fromdate='+$scope.fromdate+'&todate='+$scope.todate+'&type='+$scope.reporttype+'&company_id='+$scope.report_company).success(function(data) {
                $scope.albumList = data;
                for (var x in data) {
                  if(typeof data[x].surcharge_price== 'number'){
                      $scope.surchargeprice= Number($scope.surchargeprice) + Number(data[x].surcharge_price);
                  }
                  if(typeof data[x].driver_price== 'number'){
                      $scope.driverprice = Number($scope.driverprice) + Number(data[x].driver_price);
                  }
                  if(typeof data[x].pickup_price== 'number'){
                      $scope.pickupprice = Number($scope.pickupprice) + Number(data[x].pickup_price);
                  }
                  if(typeof data[x].drop_price== 'number'){
                      $scope.dropprice = Number($scope.dropprice) + Number(data[x].drop_price);
                  }
                  $scope.transportprice = Number($scope.transportprice) + Number(data[x].price);
                  data[x].price = data[x].price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                }
                $scope.transportprice = $scope.transportprice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                $scope.surchargeprice = $scope.surchargeprice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                $scope.driverprice = $scope.driverprice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                $scope.pickupprice = $scope.pickupprice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                $scope.dropprice = $scope.dropprice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            }
        );
        //$location.path('/administrator/listreportall');
      }
        // this configuration depends on your site.
}]);
