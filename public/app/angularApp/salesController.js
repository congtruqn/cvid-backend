app.controller('salesController', ['$scope', '$http', '$rootScope', '$routeParams','$location','ngDialog','$route','FileUploader',
    function ($scope, $http, $rootScope,$routeParams, $location,ngDialog,$route,FileUploader) {
        // this configuration depends on your site.
        //debugger;
        $scope.order ={};
        $scope.order.product =[];
        $scope.order.info = {};
        $scope.visibility = true;
        $scope.per_page = 15;
        $scope.pagedata = [];
        $scope.divadd = true;
        $scope.divedit = true;
        $scope.page=1;
        $scope.price=0;
        $scope.total_price =0;
        $scope.drop_price = 0;
        $scope.product_price = 0;
        $scope.input_price = 0;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        $scope.create_date = dd+'/'+mm+'/'+yyyy;
        if($routeParams['page']){
          $scope.page = $routeParams['page'];
        }
        $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
        });
        $scope.SearchInstant = function () {
          var keyword = $('#searchtext').val();
          //alert(keyword);
          //check the input != " " and != "  "
          if ((keyword != "")) {
              //check the keyword != null
              //keyword = keyword.trim();
              if (keyword != null) {
                  if (keyword.length >= 2) {

                    $http.get('/products/suggest/'+keyword).success(function(data) {
                        $scope.ProductList = data.hits.hits;
                        console.log(data.hits.hits);
                        
                    });

                    
                  } else {
                     
                  }
              }
          }
        };
        $scope.checkProductInOrder = function(productid,orders) {
          for (var x in orders) {
            if(orders[x]._id==productid){
              return x;
            }
          }
          return false;
        } 
        $scope.addToOrder = function (index) {
          var todel = index;
          
          //alert(todel);
          $http.get('/products/getstocksinfo/'+todel).success(function(data) {
                //$scope.productinfo = data;
                if(data.count>0){
                  if($scope.checkProductInOrder(data._id,$scope.order.product)){
                      var x = $scope.checkProductInOrder(data._id,$scope.order.product);
                      $scope.order.product[x].order_count = $scope.order.product[x].order_count+1;
                      $scope.total_price = $scope.total_price + data.sell_price;
                      $scope.input_price = $scope.input_price + data.buy_price;
                  }
                  else{
                    $scope.order.product.push(data);
                    $scope.total_price = $scope.total_price + data.sell_price;
                    $scope.input_price = $scope.input_price + data.buy_price;
                    data.order_count=1;
                  }
            
                }
            }
          );
          //console.log($scope.order);
        };
        $scope.finishorder = function (index) {
          var Employee = {
            total_monney: $scope.total_price,
            customer_phone: $scope.customer_phone,
            customer_name:$scope.customer_name,
            saleoff_monney: $scope.saleoff_monney,
            buy_monney:$scope.input_price 
          };
          $scope.order.info =Employee ;
          if($scope.order.product.length>0){
              $http({
                method: "post",
                url:'/orders/addorderres',
                data:$scope.order,
                headers: { 'Content-Type': 'application/json'}
            }).success(function(result, status, headers, config) {
            if(result){
                  alert("Xuất kho thành công");
                  $location.path("administrator/listreportall");
                  
            } 
            else{
                  document.getElementById('searchlucene').innerHTML="Không có kết quả phù hợp";
            } })
            .error(function(data, status, headers, config) {
              console.log(data);
            });
          }
          else{
            alert('Vui lòng chọn sản phẩm');
          }
            
    };
}]);