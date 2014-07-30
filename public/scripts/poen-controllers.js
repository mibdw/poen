var ctrl = angular.module('poenControllers', []);

ctrl.controller('poenMonth', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$rootScope.currentSlug = "month";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Geld moet rollen";

		$('.calendar').fullCalendar({
			events: [
				{
					title: 'All Day Event',
					start: '2014-07-01'
				},
				{
					title: 'Long Event',
					start: '2014-08-07'
				},
				{
					title: 'Repeating Event',
					start: '2014-07-09'
				},
				{
					title: 'Repeating Event',
					start: '2014-07-16'
				},
				{
					title: 'Meeting with an enormous title for a name',
					start: '2014-06-12'
				},
				{
					title: 'Lunch',
					start: '2014-07-12'
				},
				{
					title: 'Birthday Party',
					start: '2014-07-13'
				},
				{
					title: 'Click for Google',
					start: '2014-07-28'
				}
			]
		});

		var day = moment("Dec 1, 1995");

		$('.calendar').fullCalendar('gotoDate', day); 
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