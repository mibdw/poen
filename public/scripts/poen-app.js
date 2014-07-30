var app = angular.module('poenApp', ['ngRoute', 'poenControllers']);

app.controller('poenGlobal', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$rootScope.websiteTitle = "Poen";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Geld moet rollen";

		$rootScope.options = [
			{ name: "Maand", slug: "month", url: "/" },
			{ name: "Categoriën", slug: "categories", url: "/#/categories" },
			{ name: "Profiel", slug: "profile", url: "/#/profile" }
		];

		moment.lang('nl');
		$rootScope.currentDate = moment().format("ddd MM-DD-YYYY HH:mm:ss");
		$rootScope.currentMonth = moment().format("MMMM");
		$rootScope.currentYear = moment().format("YYYY");
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
		otherwise({
			redirectTo: '/'
		});
}]);