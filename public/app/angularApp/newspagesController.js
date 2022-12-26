app.controller('newspagesController', ['$scope', '$http', '$rootScope', '$routeParams','$location','ngDialog','$route','FileUploader',
    function ($scope, $http, $rootScope,$routeParams, $location,ngDialog,$route,FileUploader) {
        // this configuration depends on your site.
        //debugger;
        
        $scope.per_page = 15;
        $scope.pagedata = [];
        $scope.divadd = true;
        $scope.DivEditproductdetails = true;
        $http.get('/newspages/getallnewspage?page='+$routeParams['page']).success(function(data) {
            $scope.albumList = data;
            for (var x in data) {
                    var timestamp = data[x].create_date;
                    var date = new Date(timestamp);
                    var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                    data[x].bdatetime = datevalues;
                }
            }
        );
        $scope.openaddproducttypes = function (size) {
          $location.path("/administrator/newnewspages");
        };
        $scope.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        function remove_unicode(str) 
        {  
           str= str.toLowerCase();  
           str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
           str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
           str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
           str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
           str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
           str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
           str= str.replace(/đ/g,"d");  
           str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
           str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1- 
           str= str.replace(/^\-+|\-+$/g,"");
           return str;
        } 
        $scope.savenewspage = function () {
            
                var Employee = {
                    name: $scope.name,
                    desc: $scope.desc, 
                    title: $scope.title, 
                    keyword: $scope.keyword, 
                    description: $scope.description, 
                    seourl: $scope.seourl,
                    content: $scope.content,
                };
                if(uploader.queue.length>0){
                    uploader.queue[0].upload();
                    var Employee = {
                        name: $scope.name,
                        desc: $scope.desc,
                        image:uploader.queue[0].file.name,
                        title: $scope.title, 
                        keyword: $scope.keyword, 
                        description: $scope.description, 
                        seourl: $scope.seourl,
                        content: $scope.content,
                    };
                }
                else{

                }
                $http({
                    method: "post",
                    url:'/newspages/addnewspagesres',
                    data: $.param(Employee),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(result, status, headers, config) {
                    if(result["result"]==0){
                        alert("Vui lòng nhập đầy đủ thông tin");
                    } 
                    else{
                        $location.path("/administrator/newspages");
                    }       
                })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                });
            

            
        };
        $scope.delnewpages = function(index) {
            var todel = index;
            if (confirm("Bạn có muốn xóa coonh ty này ko?")) {
              $http({
                  method: "post",
                  url:'/newspages/delnewpages',
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
        $scope.changeurl = function (){
            $scope.seourl = remove_unicode($scope.name);
        }
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
app.controller('editnewspagesController', ['$scope', '$http', '$rootScope', '$routeParams','$location','ngDialog','$route','FileUploader',
    function ($scope, $http, $rootScope,$routeParams, $location,ngDialog,$route,FileUploader) {
        // this configuration depends on your site.
        //debugger;
        //


        $scope.divadd = true;
        $http.get('/newspages/getnewspageinfo?id='+$routeParams['id']).success(function(data) {
            //$route.reload();
            $scope.newpageinfo = data;
            $scope.content = data.detail[0].content;
        });
        function remove_unicode(str) 
        {  
           str= str.toLowerCase();  
           str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
           str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
           str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
           str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
           str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
           str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
           str= str.replace(/đ/g,"d");  
           str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
           str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1- 
           str= str.replace(/^\-+|\-+$/g,"");
           return str;
        } 
        $scope.saveeditnewspage = function () {
                var Employee = {
                    name: $scope.newpageinfo.detail[0].name,
                    desc: $scope.newpageinfo.detail[0].desc, 
                    title: $scope.newpageinfo.detail[0].title, 
                    keyword: $scope.newpageinfo.detail[0].keyword, 
                    description: $scope.newpageinfo.detail[0].description, 
                    seourl: $scope.newpageinfo.seo_url,
                    content: CKEDITOR.instances.editor1.getData(),
                    productdetailsid:$routeParams['id'],
                };
                if(uploader.queue.length>0){
                    uploader.queue[0].upload();
                    var Employee = {
                        name: $scope.newpageinfo.detail[0].name,
                        desc: $scope.newpageinfo.detail[0].desc, 
                        title: $scope.newpageinfo.detail[0].title, 
                        keyword: $scope.newpageinfo.detail[0].keyword, 
                        description: $scope.newpageinfo.detail[0].description, 
                        seourl: $scope.newpageinfo.seo_url,
                        content: CKEDITOR.instances.editor1.getData(),
                        image:uploader.queue[0].file.name,
                        productdetailsid:$routeParams['id'],
                    };
                }
                else{

                }
                $http({
                    method: "post",
                    url:'/newspages/editnewspagesres',
                    data: $.param(Employee),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(result, status, headers, config) {
                    if(result["result"]==0){
                        alert("Vui lòng nhập đầy đủ thông tin");
                    } 
                    else{
                        $location.path("/administrator/newspages");
                    }       
                })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                });


            
        };
        $scope.changeurl = function (){
            $scope.newpageinfo.seo_url = remove_unicode($scope.newpageinfo.detail[0].name);
        }
        var uploader = $scope.uploader = new FileUploader({
            url: '/products/upload'
        });
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
