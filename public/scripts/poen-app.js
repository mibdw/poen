var app = angular.module('poenApp', ['ngRoute', 'poenControllers']);

app.controller('poenGlobal', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$rootScope.websiteTitle = "Poen";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Geld moet rollen";

		$rootScope.options = [
			{ name: "Maand", slug: "month", url: "/" },
			{ name: "Categoriën", slug: "categories", url: "/#/categories" },
			{ name: "Profiel", slug: "profile", url: "/#/profile" }
		];

		moment.lang('nl');
		$rootScope.currentDate = moment().format("ddd MM-DD-YYYY HH:mm:ss");
		$rootScope.currentMonth = moment().format("M");
		$rootScope.currentYear = moment().format("YYYY");
		
		$rootScope.newMoney = { balance: 'expense', recursion: 'once' };
		$rootScope.editMoney = {};

		$http.get('/category/list').success( function (categoryData) {
			$rootScope.categoryList = categoryData;
		});
	}
]);

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