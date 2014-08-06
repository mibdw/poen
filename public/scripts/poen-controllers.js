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
				$rootScope.newMoney.displayDate = date.format("D MMMM YYYY");
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

			} else if (moment($rootScope.newMoney.date).format('D') > 28 && $rootScope.newMoney.recursion == 'monthly') {

				alert('Maandelijkse kosten alleen tussen 1-28 alstublieft');
				$('.money-recursion').focus();

			} else {

				if ($rootScope.newMoney.amount.indexOf(',') > -1) { $rootScope.newMoney.amount = accounting.unformat($rootScope.newMoney.amount, ','); }		

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
				$rootScope.editMoney.amount = accounting.formatMoney($rootScope.editMoney.amount, '', '2', '', ',');

				$rootScope.editMoney.date = moment($rootScope.editMoney.date).format("YYYY-MM-DD");
				$rootScope.editMoney.displayDate = moment($rootScope.editMoney.date).format("D MMMM YYYY");

				highlightSelectedDate($rootScope.editMoney.date);
			});

		};

// UPDATE MONEY OBJECT

		$scope.updateMoney = function () {

			if (!$rootScope.editMoney.title) {

				alert('Titel invullen alstublieft');
				$('.money-title').focus();

			} else if (!$rootScope.editMoney.amount) {

				alert('Bedrag invullen alstublieft');
				$('.money-amount').focus();

			} else if (!$rootScope.editMoney.date) {

				alert('Datum invullen alstublieft');
				$('.money-date').focus();

			} else if (!$rootScope.editMoney.category) {

				alert('Categorie invullen alstublieft');
				$('.money-category').focus();

			} else if (!$rootScope.editMoney.recursion) {

				alert('Frequentie invullen alstublieft');
				$('.money-recursion').focus();

			} else if (!$rootScope.editMoney.balance) {

				alert('Inkomst/uitgave invullen alstublieft');
				$('.money-balance').focus();

			} else if (moment($rootScope.editMoney.date).format('D') > 28 && $rootScope.editMoney.recursion == 'monthly') {

				alert('Maandelijkse kosten alleen tussen 1-28 alstublieft');
				$('.money-recursion').focus();

			} else {

				if (!$rootScope.editMoney.note) { $rootScope.editMoney.note = "";}

				if ($rootScope.editMoney.amount.indexOf(',') > -1) { $rootScope.editMoney.amount = accounting.unformat($rootScope.editMoney.amount, ','); }

				$http.post('/money/edit', $rootScope.editMoney).success( function (data) {
					window.location.reload()			
				});
			}
		};

		$scope.deleteMoney = function () {

			if (confirm("Weet je het zeker?") == true) {
				
				$http.post('/money/delete', $rootScope.editMoney).success( function (data) {
					window.location.reload()			
				});
			} 
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
					moneyData[i].displayAmount = accounting.formatMoney(moneyData[i].amount, '', '2', '', ',');
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
			}

			$scope.moneyTotalDisplay = accounting.formatMoney($scope.moneyTotalDisplay, '', '2', '', ','); 


// CALENDAR RENDERING

			$('.calendar').fullCalendar({
				header: { left: 'title', center: '', right: '' },
				events: moneyData,
				dayClick: function(date, jsEvent, view) { 

					var sidebar = document.getElementsByClassName('sidebar');
					var scope = angular.element(sidebar).scope();
					var rootScope = scope.$root;

					scope.$apply (function() { 

						if (rootScope.currentSidebar.title == 'Bewerken') {
							rootScope.editMoney.date = date.format('YYYY-MM-DD');
							rootScope.editMoney.displayDate = date.format('D MMMM YYYY');
						} else {
							scope.sidebarNew(date); 
						}
						
					});

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
				},
				eventRender: function(event, element) {
					$(element).addClass(event._id);
					$(element).find('.fc-event-title').prepend('<span class="user-icon"><span>' + event.user.username.substring(0,1) + '</span></span>');
					$(element).find('.fc-event-title').prepend('<span class="category-icon ' + event.category.slug + '" title="' + event.category.name +'" style="background-color: ' + event.category.color + ';"></span>');
				}
			});

			$('.calendar').fullCalendar('gotoDate', displayDate);
		});

// HIGHLIGHT DATE IF NEW MONEY SIDEBAR IS ACTIVE

		if ($rootScope.newMoney.date && $rootScope.currentSidebar.title == $rootScope.sidebars[1].title) { 
			highlightSelectedDate($rootScope.newMoney.date); 
		}
	}
]);

ctrl.controller('poenProfile', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$rootScope.currentSlug = "profile";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Profile";
	}
]);

ctrl.controller('poenCategories', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$rootScope.currentSlug = "categories";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Categories";

// GET ALL CATEGORIES

		$http.get('/category/list').success( function (categoryData) {
			$rootScope.categoryList = categoryData;
		});

// SAVE NEW CATEGORY

		$scope.saveCategory = function () {
		
			if (!$scope.newCategory.name) {

				alert('Naam invullen alstublieft');

			} else if (!$scope.newCategory.color) {

				alert('Kleur invullen alstublieft');

			} else {

				$http.post('/category/new', $scope.newCategory).success( function (data) {
					if (data == 'error') {
						alert('Sorry, die kleur is al bezet');
					} else {
						window.location.reload();	
					}
					
				});

			}
		};
	}
]);

// HIGHLIGHT DATE ON SIDEBAR ACTIVATIONS

function highlightSelectedDate(date) {
	var selectedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
	$('td[data-date="' + selectedDate + '"]').addClass('active');
};

// CONVERT AMOUNT TO ACCOUNTING

$(document).on('focusout', '.money-amount', function () {

	var newAmount= $(this).val();

	if (newAmount.indexOf(',') > -1) {

		newAmount = accounting.unformat(newAmount, ',');
		newAmount = accounting.formatMoney(newAmount, '', '2', '', ',');
		$(this).val(newAmount);

	} else {
		
		newAmount = accounting.formatMoney(newAmount, '', '2', '', ',');
		$(this).val(newAmount);
	
	}

	
});

// HIGHLIGHT MONEY ACCROSS SECTION ON HOVER

$(document).on('mouseenter', '.balance-money', function () { $('.' + $(this).attr('id')).addClass("hover"); });
$(document).on('mouseleave', '.balance-money', function () { $('.' + $(this).attr('id')).removeClass("hover"); });