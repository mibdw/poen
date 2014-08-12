var app = angular.module('poenApp', ['ngRoute', 'poenControllers']);

// ROUTE PROVIDER

app.config(['$routeProvider', function ($routeProvider) {
	
	$routeProvider.
		when('/', {
			templateUrl: 'partials/calendar',
			controller: 'poenCalendar'
		}).
		when('/stats', {
			templateUrl: 'partials/stats',
			controller: 'poenStats'
		}).
		when('/settings', {
			templateUrl: 'partials/settings',
			controller: 'poenSettings'
		}).
		when('/:displayYear/:displayMonth', {
			templateUrl: 'partials/calendar',
			controller: 'poenCalendar'
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
			{ name: "Kalender", slug: "calendar", url: "/" },
			{ name: "Statistiek", slug: "stats", url: "/#/stats" },
			{ name: "Instellingen", slug: "settings", url: "/#/settings" }
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

// TOGGLE FILTERS

		$rootScope.toggleFilterCategory = function (slug) { 

			if ($rootScope.filterCategories.indexOf(slug) < 0) {

				$rootScope.filterCategories.push(slug);

			} else {
				var pos = $rootScope.filterCategories.indexOf(slug);
				$rootScope.filterCategories.splice(pos, 1);
			}
		};

		$rootScope.toggleFilterUsers = function (user) { 

			if ($rootScope.filterUsers.indexOf(user) < 0) {

				$rootScope.filterUsers.push(user);

			} else {
				var pos = $rootScope.filterUsers.indexOf(user);
				$rootScope.filterUsers.splice(pos, 1);
			}
		};

// REMOVE FILTERS

		$rootScope.removeCatFilters = function () { $rootScope.filterCategories =[]; };

		$rootScope.removeUserFilters = function () { $rootScope.filterUsers =[]; };

	}
]);

// CUSTOMER FILTER

app.filter('moneyFiltering', function ($rootScope) {

	return function (items) {

		return items.filter(function (item) {

			if ($rootScope.filterCategories.length > 0) {

				if ($rootScope.filterUsers.length > 0) {

					for (i in $rootScope.filterCategories) {
						for (j in $rootScope.filterUsers) {
							if (item.category.slug == $rootScope.filterCategories[i] && item.user.username == $rootScope.filterUsers[j]) {
								return item;
							}
						}					
					}
				} else if (!$rootScope.filterUsers || $rootScope.filterUsers.length == 0) {
					for (i in $rootScope.filterCategories) {
						if (item.category.slug == $rootScope.filterCategories[i]) {
							return item;
						}					
					}
				} 
			} else if (!$rootScope.filterCategories || $rootScope.filterCategories.length == 0) {

				if ($rootScope.filterUsers.length > 0) {
					
					for (i in $rootScope.filterUsers) {
						if (item.user.username == $rootScope.filterUsers[i]) {
							return item;
						}					
					}
				} else if (!$rootScope.filterUsers || $rootScope.filterUsers.length == 0) { return item; }
			} else if ($rootScope.filterUsers.length > 0) {

				if ($rootScope.filterCategories.length > 0) {

					for (i in $rootScope.filterUsers) {
						for (j in $rootScope.filterCategories) {
							if (item.user.username == $rootScope.filterUsers[i] && item.category.slug == $rootScope.filterCategories[j]) {
								return item;
							}
						}					
					}
				} else if (!$rootScope.filterCategories || $rootScope.filterCategories.length == 0) {
					for (i in $rootScope.filterUsers) {
						if (item.user.username == $rootScope.filterUsers[i]) {
							return item;
						}					
					}
				} 
			} else if (!$rootScope.filterUsers || $rootScope.filterUsers.length == 0) {

				if ($rootScope.filterCategories.length > 0) {
					
					for (i in $rootScope.filterCategories) {
						if (item.category.slug == $rootScope.filterCategories[i]) {
							return item;
						}					
					}
				} else if (!$rootScope.filterCategories || $rootScope.filterCategories.length == 0) { return item; }
			}			
		});
	};
});