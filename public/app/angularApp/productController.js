app.controller('productsController', ['$scope', '$http', '$rootScope', '$routeParams','$location','ngDialog','$route','FileUploader',
    function ($scope, $http, $rootScope,$routeParams, $location,ngDialog,$route,FileUploader) {
        // this configuration depends on your site.
        //debugger;
        $scope.visibility = true;
        $scope.per_page = 15;
        $scope.pagedata = [];
        $scope.divadd = true;
        $scope.divedit = true;
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
        $http.get('/products/getallproducts?page='+$scope.page).success(function(datax) {
                for (var x in datax) {
                  var price = String(datax[x].buy_price);
                  var price1 = price.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                  datax[x].buy_price = price1;
                  var price2 = String(datax[x].sell_price);
                  var price3 = price2.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                  datax[x].sell_price = price3;
                }

                $scope.albumList = datax;
            }
        );
        $http.get('/producttypes/getallproducttypes').success(function(data) {
                $scope.producttypes = data;
                $scope.product_type = data[0];
            }
        );
        $http.get('/productdetails/getallproductdetails').success(function(data) {
               $scope.productdetails = data;
            }
        );
        $http.get('/products/getmaxproductcode').success(function(data) {
            $scope.product_code_id = Number(data['maxordercode']) + 1;
            $scope.product_code = data['ordercode'];
            
        });
        $http.get('/register/getloginuser').success(function(data) {
            $scope.loginuser = data;
            
        });
        $http.get('/products/getcountproducts').success(function(data) {
            $scope.countcompany = data['numofcompany'];
            $scope.numpage = $scope.countcompany/$scope.per_page+1;
            for (var i=1; i<=$scope.numpage; i++) {
                $scope.pagedata.push(i);
            }
        });
        $scope.openaddproducts = function (size) {
           var modalInstance =  ngDialog.open({
            controller: 'productsController',
            templateUrl: '/products/addproducts',
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


        $scope.openeditproducts = function (id) {
            $scope.productsid = id;
            var modalInstance =  ngDialog.open({
            scope: $scope,
            controller: 'editproductsController',
            templateUrl: '/products/editproducts',
            resolve: {
              productsid: function () {
                return $scope.productsid;
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

        $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        $scope.saveproducts = function () {
            //console.log(uploader);
            var productdetail=[];
            for (var x in $scope.productdetails){
               
               var temp ={detail_name: $scope.productdetails[x]['name'],detail_value:$scope.productdetails[x]['value']}
               productdetail.push(temp);

            }
          if($scope.form.$valid){
            var Employee = {
                    product_code: $scope.product_code,
                    product_name: $scope.product_name,
                    product_type_id:$scope.product_type._id,
                    product_type_name: $scope.product_type.name,
                    buy_price:$scope.buy_price,
                    sell_price:$scope.sell_price,
                    count:$scope.count,
                    product_detail: productdetail,
                    product_code_id:$scope.product_code_id
            };
            
            if(uploader.queue.length>0){
                uploader.queue[0].upload();
                var Employee = {
                    product_code: $scope.product_code,
                    product_name: $scope.product_name,
                    product_type_id:$scope.product_type._id,
                    product_type_name: $scope.product_type.name,
                    buy_price:$scope.buy_price,
                    sell_price:$scope.sell_price,
                    count:$scope.count,
                    image_name:uploader.queue[0].file.name,
                    product_detail: productdetail,
                    product_code_id:$scope.product_code_id
                };
            }
            else{

            }
            $http({
                method: "post",
                url:'/products/addproductres',
                data:Employee,
                headers: { 'Content-Type': 'application/json'}
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
            //alert("Vui lòng kiểm tra lại thông tin");
          }  
        };

        $scope.saveandaddproducts = function () {
            var productdetail=[];
            for (var x in $scope.productdetails){
               
               var temp ={detail_name: $scope.productdetails[x]['name'],detail_value:$scope.productdetails[x]['value']}
               productdetail.push(temp);

            }
          if($scope.form.$valid){
            var Employee = {
                    product_code: $scope.product_code,
                    product_name: $scope.product_name,
                    product_type_id:$scope.product_type._id,
                    product_type_name: $scope.product_type.name,
                    buy_price:$scope.buy_price,
                    sell_price:$scope.sell_price,
                    count:$scope.count,
                    product_detail: productdetail,
                    product_code_id:$scope.product_code_id
            };
            
            if(uploader.queue.length>0){
                uploader.queue[0].upload();
                var Employee = {
                    product_code: $scope.product_code,
                    product_name: $scope.product_name,
                    product_type_id:$scope.product_type._id,
                    product_type_name: $scope.product_type.name,
                    buy_price:$scope.buy_price,
                    sell_price:$scope.sell_price,
                    count:$scope.count,
                    image_name:uploader.queue[0].file.name,
                    product_detail: productdetail,
                    product_code_id:$scope.product_code_id
                };
            }
            else{

            }
            $http({
                method: "post",
                url:'/products/addproductres',
                data:Employee,
                headers: { 'Content-Type': 'application/json'}
              }).success(function(result, status, headers, config) {
                if(result["result"]==0){
                    alert("Vui lòng nhập đầy đủ thông tin");
                } 
                else{
                    alert("Nhập sản phẩm thành công");
                    $scope.count = 0;
                    $http.get('/products/getmaxproductcode').success(function(data) {
                        $scope.product_code_id = Number(data['maxordercode']) + 1;
                        $scope.product_code = data['ordercode'];
                        
                    });
                    //ngDialog.close();
                    
                    //$route.reload();
                }       
              })
                  .error(function(data, status, headers, config) {
                      console.log(data);
            });
            
            
          }
          else{
            //alert("Vui lòng kiểm tra lại thông tin");
          }  
        };

        $scope.delUser = function(index) {
            var todel = index;
            if (confirm("Bạn muốn xóa đơn hàng?")) {
              $http({
                  method: "post",
                  url:'/products/delproductsres',
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
        var uploader = $scope.uploader = new FileUploader({
            url: '/products/upload'
        });

        // FILTERS
      
        // a sync filter
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
      
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //$scope.saveproducts();
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);   
        
}]);
app.controller('editproductsController', ['$scope', '$http', '$rootScope', '$routeParams','$location','ngDialog','$route','FileUploader',
    function ($scope, $http, $rootScope,$routeParams, $location,ngDialog,$route,FileUploader) {
        // this configuration depends on your site.
        //debugger;
        $http.get('/products/getproductsinfo/'+$scope.productsid).success(function(data) {
                $scope.productinfo = data;
                $scope.create_dateedit = data.products_code;
            }
      
        );
        $http.get('/producttypes/getallproducttypes').success(function(data) {
                $scope.product_detail_info = data;
                for (var x in data) {
                  if(data[x]._id==$scope.productinfo.product_type_id){
                      $scope.product_type = data[x];
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
        $scope.saveEditproducts  = function () {
            var productdetail=[];
            for (var x in $scope.productinfo.product_detail){
               var temp ={detail_name: $scope.productinfo.product_detail[x]['detail_name'],detail_value:$scope.productinfo.product_detail[x]['detail_value'],detail_id:$scope.productinfo.product_detail[x]['_id']}
               productdetail.push(temp);
            };
            var Employee = {
                product_id:$scope.productsid,
                product_name: $scope.productinfo.product_name,
                product_code:$scope.productinfo.product_code,
                product_type_id:$scope.product_type._id,
                product_type_name: $scope.product_type.name,
                buy_price:$scope.productinfo.buy_price,
                sell_price:$scope.productinfo.sell_price,
                count:$scope.productinfo.count,
                product_detail: productdetail
            };
            
            if(uploader.queue.length>0){
                uploader.queue[0].upload();
                var Employee = {
                    product_id:$scope.productsid,
                    product_name: $scope.productinfo.product_name,
                    product_code:$scope.productinfo.product_code,
                    product_type_id:$scope.product_type._id,
                    product_type_name: $scope.product_type.name,
                    buy_price:$scope.productinfo.buy_price,
                    sell_price:$scope.productinfo.sell_price,
                    count:$scope.productinfo.count,
                    image_name:uploader.queue[0].file.name,
                    product_detail: productdetail
                };
            }
            else{

            }


            console.log(Employee);
            $http({
                method: "post",
                url:'/products/editproductsres',
                data: Employee,
                 headers: { 'Content-Type': 'application/json'}
            }).success(function(result) {
                ngDialog.close();  
                $route.reload();  
          })
          .error(function(result) {

          }); 
        // FILTERS    
        };
        var uploader = $scope.uploader = new FileUploader({
            url: '/products/upload'
        });

        // FILTERS
      
        // a sync filter
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
      
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            //$scope.saveproducts();
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);
}]);
