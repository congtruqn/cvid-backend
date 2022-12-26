var app = angular.module('myApp', ['ngRoute','ngDialog','angularFileUpload','ng.ckeditor']);
app.config(['$routeProvider', '$locationProvider','ngDialogProvider', function ($routeprovider, $locationProvider,ngDialogProvider) {
    $routeprovider.
    when('/administrator/listuser', {
    	templateUrl:'/register/listuser',
        controller: 'userController' 	
    }).
     when('/administrator/listuser/:page', {
        templateUrl:'/register/listuser',
        controller: 'userController'   
    }).
    when('/administrator/listproducts', {
    	templateUrl: '/products/listproducts',
        controller: 'productsController'
    }).
    when('/administrator/listproducts/:page', {
        templateUrl: '/products/listproducts',
        controller: 'productsController'
    }).
    when('/administrator/addproduct', {
    	templateUrl: '/product/addproduct',
        controller: 'productController'
    }).
    when('/administrator/listorder', {
        templateUrl: '/order/listorder',
        controller: 'orderController'
    }).
    when('/administrator/listorder/:page', {
        templateUrl: '/order/listorder',
        controller: 'orderController'
    }).
    when('/administrator/listproducttypes', {
        templateUrl: '/producttypes/listproducttypes',
        controller: 'producttypesController'
    }).
    when('/administrator/listproducttypes/:page', {
        templateUrl: '/producttypes/listproducttypes',
        controller: 'producttypesController'
    }).
    when('/administrator/listproductdetails', {
        templateUrl: '/productdetails/listproductdetails',
        controller: 'productdetailsController'
    }).
    when('/administrator/listproductdetails/:page', {
        templateUrl: '/productdetails/listproductdetails',
        controller: 'productdetailsController'
    }).
    when('/administrator/listreportall', {
        templateUrl: '/report/listreportall',
        controller: 'listreportallController'
    }).
    when('/administrator/orderreport', {
        templateUrl: '/report/orderreport',
        controller: 'orderreportController'
    }).
    when('/administrator/newspages', {
        templateUrl: '/newspages/listpages',
        controller: 'newspagesController'
    }).
    when('/administrator/newnewspages', {
        templateUrl: '/newspages/addnewspages',
        controller: 'newspagesController'
    }).
    when('/administrator/editnewspages', {
        templateUrl: '/newspages/editnewspages',
        controller: ''
    }).
    when('/administrator/newscontents', {
        templateUrl: '/newscontents/listnewscontents',
        controller: 'newscontentsController'
    }).
    when('/administrator/newnewscontents', {
        templateUrl: '/newscontents/addnewscontents',
        controller: 'newscontentsController'
    }).
    when('/administrator/editnewscontents', {
        templateUrl: '/newscontents/editnewscontents',
        controller: ''
    }).
    when('/administrator/newscats', {
        templateUrl: '/newscats/listnewscats',
        controller: 'newscatsController'
    }).
    when('/administrator/listbannercats', {
        templateUrl: '/bannercats/listbannercats',
        controller: ''
    }).
    
    when('/administrator/newnewscats', {
        templateUrl: '/newscats/addnewscats',
        controller: 'newscatsController'
    }).
    when('/administrator/editnewscats', {
        templateUrl: '/newscats/editnewscats',
        controller: ''
    }).
    when('/administrator/newbannercats', {
        templateUrl: '/bannercats/addbannercats',
        controller: ''
    }).
    when('/administrator/editbannercats', {
        templateUrl: '/bannercats/editbannercats',
        controller: ''
    }).
    when('/administrator/banners', {
        templateUrl: '/banners/listbanners',
        controller: ''
    }).
    when('/administrator/test', {
        templateUrl: '/products/images',
        controller: 'productsController'
    }).
    when('/administrator/filemanager', {
        templateUrl: '/report/filemanager',
        controller: 'filemanagerController'
    }).
    when('/sales', {
        templateUrl: '/products/sales',
        controller: 'salesController'
    }).
    otherwise({
          redirectto: '/',
    });
    $locationProvider.html5Mode({
    	  enabled: true,
    	  requireBase: false
    });
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        preCloseCallback: function () {
          console.log('default pre-close callback');
        }
    });
}]);
app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});
