var ctrl = angular.module('poenControllers', []);

ctrl.controller('poenMonth', ['$scope', '$rootScope', '$routeParams',
	function ($scope, $rootScope, $routeParams) {
		$rootScope.currentSlug = "month";

		var displayDate = moment();

		if ($routeParams.displayYear && $routeParams.displayMonth) {

			var processDate = $routeParams.displayYear + "-" + $routeParams.displayMonth;
			displayDate = moment(processDate, "YYYY-MM");
		}

		$scope.nextMonth = moment(displayDate).add('months', 1).format('YYYY/MM');
		$scope.prevMonth = moment(displayDate).subtract('months', 1).format('YYYY/MM');

		$rootScope.currentTitle = $rootScope.websiteTitle + " - " + moment(displayDate).format('MMMM YYYY');

		$('.calendar').fullCalendar({
			header: { left: 'title', center: '', right: '' },
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

		$('.calendar').fullCalendar('gotoDate', displayDate);
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