var app = angular.module('poenApp', ['ngRoute', 'poenControllers']);

// ROUTE PROVIDER

app.config(['$routeProvider', function ($routeProvider) {
	
	$routeProvider.
		when('/', {
			templateUrl: 'partials/month',
			controller: 'poenMonth'
		}).
		when('/profile', {
			templateUrl: 'partials/profile',
			controller: 'poenProfile'
		}).
		when('/categories', {
			templateUrl: 'partials/categories',
			controller: 'poenCategories'
		}).
		when('/:displayYear/:displayMonth', {
			templateUrl: 'partials/month',
			controller: 'poenMonth'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);

// GLOBAL CONTROLLER

app.controller('poenGlobal', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {

// WEBSITE TITLE

		$rootScope.websiteTitle = "Poen";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Geld moet rollen";

// MENU OPTIONS

		$rootScope.options = [
			{ name: "Maand", slug: "month", url: "/" },
			{ name: "Categoriën", slug: "categories", url: "/#/categories" },
			{ name: "Profiel", slug: "profile", url: "/#/profile" }
		];

// DATE FORMATS

		moment.lang('nl');
		$rootScope.currentDate = moment().format("ddd MM-DD-YYYY HH:mm:ss");
		$rootScope.currentMonth = moment().format("M");
		$rootScope.currentYear = moment().format("YYYY");

// MONEY OBJECT DEFAULT VALUES
		
		$rootScope.newMoney = { balance: 'expense', recursion: 'once' };
		$rootScope.editMoney = {};

// CATEGORY LIST LOADING

		$http.get('/category/list').success( function (categoryData) {
			$rootScope.categoryList = categoryData;
		});

		$rootScope.filterCategories = [];

// USERS LIST LOADING

		$http.get('/users/list').success( function (users) {
			$rootScope.userList = users;
		});

		$rootScope.filterUsers = [];
	}
]);

// CUSTOMER FILTER

app.filter('moneyFiltering', function ($rootScope) {

	return function (items) {

		return items.filter(function (item) {

			if (!$rootScope.filterCategories || $rootScope.filterCategories.length == 0) {

				return item;

			} else if ($rootScope.filterCategories.length > 0) {

				for (i in $rootScope.filterCategories) {
				
					if (item.category.slug == $rootScope.filterCategories[i]) {

						return item;
					}					
				}
			}				
		});
	};
});