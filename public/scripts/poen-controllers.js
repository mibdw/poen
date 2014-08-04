var ctrl = angular.module('poenControllers', []);

ctrl.controller('poenMonth', ['$scope', '$rootScope', '$routeParams', '$http',
function ($scope, $rootScope, $routeParams, $http) {
		$rootScope.currentSlug = "month";

// WHAT MONTH TO DISPLAY?

		var displayDate = moment();
		$scope.checkMonth = moment().add('months', 1).format('YYYY/MM');

		if ($routeParams.displayYear && $routeParams.displayMonth) {

			var processDate = $routeParams.displayYear + "-" + $routeParams.displayMonth;
			displayDate = moment(processDate, "YYYY-MM");
		}

// CALENDAR MONTH NAVIGATION

		$scope.nextMonth = moment(displayDate).add('months', 1).format('YYYY/MM');
		$scope.prevMonth = moment(displayDate).subtract('months', 1).format('YYYY/MM');

// CALENDAR PAGE TITLE

		$rootScope.currentTitle = $rootScope.websiteTitle + " - " + moment(displayDate).format('MMMM YYYY');

// SIDEBAR INCLUDES

		$rootScope.sidebars = [
			{ title: 'Balans', url: '/partials/money-list' },
			{ title: 'Nieuw', url: '/partials/money-new' },
			{ title: 'Bewerken', url: '/partials/money-edit' }
		];

		if (!$rootScope.currentSidebar) {
			$rootScope.currentSidebar = $rootScope.sidebars[0];
		}

// SIDEBAR CONTROLS

		$scope.sidebarClose = function () { 
			$rootScope.currentSidebar = $rootScope.sidebars[0]; 
			$('.fc-day, .fc-event').removeClass('active');
		};

// NEW MONEY OBJECT

		$scope.sidebarNew = function (date) { 
			$rootScope.currentSidebar = $rootScope.sidebars[1]; 
			
			if (date) {
				$rootScope.newMoney.date = date.format("YYYY-MM-DD");
			} else {
				highlightSelectedDate($rootScope.newMoney.date);
			}
		};

// SAVE NEW MONEY OBJECT

		$scope.saveMoney = function () {

			if (!$rootScope.newMoney.title) {

				alert('Titel invullen alstublieft');
				$('.money-title').focus();

			} else if (!$rootScope.newMoney.amount) {

				alert('Bedrag invullen alstublieft');
				$('.money-amount').focus();

			} else if (!$rootScope.newMoney.date) {

				alert('Datum invullen alstublieft');
				$('.money-date').focus();

			} else if (!$rootScope.newMoney.category) {

				alert('Categorie invullen alstublieft');
				$('.money-category').focus();

			} else if (!$rootScope.newMoney.recursion) {

				alert('Frequentie invullen alstublieft');
				$('.money-recursion').focus();

			} else if (!$rootScope.newMoney.balance) {

				alert('Inkomst/uitgave invullen alstublieft');
				$('.money-balance').focus();

			} else {

				$http.post('/money/new', $rootScope.newMoney).success( function (data) {
					window.location.reload()			
				});
			}
		};

// EDIT MONEY OBJECT

		$scope.sidebarEdit = function (id) { 
			$rootScope.currentSidebar = $rootScope.sidebars[2]; 
			$rootScope.editID = id;
			$('.fc-day').removeClass('active');

			var moneyID = { 'moneyID': id };

			$http.post('/money/detail', moneyID).success( function (moneyDetail) {
				$rootScope.editMoney = moneyDetail;
			});
		};

// CONVERT ENTERED AMOUNT INTO VALID MONEY AMOUNT

		$scope.newMoneyAmount = function (amount) {
			$rootScope.newMoney.amount = accounting.formatMoney(amount, '', '2', '', '.');
		};

// LOAD MONEY OBJECTS

		var moneyCriteria = {
			'month': moment(displayDate).format('MM'),
			'year': moment(displayDate).format('YYYY')
		}

		$http.post('/money/' + $routeParams.displayYear + '/' + $routeParams.displayMonth, moneyCriteria).success( function (moneyData) {

			$scope.moneyList = [];

			for (i in moneyData) {

				if (moment(displayDate).format('M') == moment(moneyData[i].date).format('M')) {
					$scope.moneyList.push(moneyData[i]);	
				}				
			}

// CALCULATE MONEY TOTAL

			$scope.moneyTotal = 0;

			for (i in $scope.moneyList) {
				if ($scope.moneyList[i].balance == 'income') {
					$scope.moneyTotal = $scope.moneyTotal + $scope.moneyList[i].amount;
				} else if ($scope.moneyList[i].balance == 'expense') {
					$scope.moneyTotal = $scope.moneyTotal - $scope.moneyList[i].amount;
				}
			}

			if ($scope.moneyTotal < 0) {
				$scope.moneyTotalDisplay = $scope.moneyTotal.toString().substring(1);
			} else if ($scope.moneyTotal > 0) {
				$scope.moneyTotalDisplay = $scope.moneyTotal;
			} else if ($scope.moneyTotal == 0) {
				$scope.moneyTotalDisplay == '';
			}

// CALENDAR RENDERING

			$('.calendar').fullCalendar({
				header: { left: 'title', center: '', right: '' },
				events: moneyData,
				dayClick: function(date, jsEvent, view) { 

					var sidebar = document.getElementsByClassName('sidebar');
					var scope = angular.element(sidebar).scope();
					var rootScope = scope.$root;

					scope.$apply (function() { scope.sidebarNew(date); });

					$('.fc-day, .fc-event').removeClass('active');
					$(this).addClass('active');

				},
				eventClick: function(calEvent, jsEvent, view) { 

					var sidebar = document.getElementsByClassName('sidebar');
					var scope = angular.element(sidebar).scope();

					scope.$apply (function() { scope.sidebarEdit(calEvent._id); });

					$('.fc-event').removeClass('active');
					$(this).addClass('active');			
				},
				eventMouseover: function(calEvent, jsEvent, view) { 
					$('tr.balance-money#'+ calEvent._id).addClass('active');
				},
				eventMouseout: function(calEvent, jsEvent, view) { 
					$('tr.balance-money#'+ calEvent._id).removeClass('active');
				}
			});

			$('.calendar').fullCalendar('gotoDate', displayDate);
		});

// HIGHLIGHT DATE IF NEW MONEY SIDEBAR IS ACTIVE

		if ($rootScope.newMoney.date && $rootScope.currentSidebar.title == $rootScope.sidebars[1].title) { 
			highlightSelectedDate($rootScope.newMoney.date); 
		}

// CONVERT AMOUNT TO ACCOUNTING

		$(document).on('focusout', '.money-amount', function () {
		
			var sidebar = document.getElementsByClassName('sidebar');
			var scope = angular.element(sidebar).scope();
			var rootScope = scope.$root;
			var amount = $(this).val();

			scope.$apply (function() { scope.newMoneyAmount(amount); });
		});
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

function highlightSelectedDate(date) {
	var selectedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
	$('td[data-date="' + selectedDate + '"]').addClass('active');
};