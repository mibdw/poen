var ctrl = angular.module('poenControllers', []);

ctrl.controller('poenMonth', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$rootScope.currentSlug = "month";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Geld moet rollen";
	}
]);

ctrl.controller('poenProfile', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$rootScope.currentSlug = "profile";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Profile";
	}
]);

ctrl.controller('poenCategories', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$rootScope.currentSlug = "categories";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Categories";
	}
]);