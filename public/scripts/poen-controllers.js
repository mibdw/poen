var ctrl = angular.module('poenControllers', []);

ctrl.controller('poenCalendar', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {
		$rootScope.currentSlug = "calendar";

// WHAT MONTH TO DISPLAY?

		$scope.checkMonth = moment().add('months', 1).format('YYYY/MM');

		if ($routeParams.displayYear && $routeParams.displayMonth) {

			var processDate = $routeParams.displayYear + "-" + $routeParams.displayMonth;
			$rootScope.displayDate = moment(processDate, "YYYY-MM");
		}

// CALENDAR MONTH NAVIGATION

		$scope.nextMonth = moment($rootScope.displayDate).add('months', 1).format('YYYY/MM');
		$scope.prevMonth = moment($rootScope.displayDate).subtract('months', 1).format('YYYY/MM');

// CALENDAR PAGE TITLE

		$rootScope.currentTitle = $rootScope.websiteTitle + " - " + moment($rootScope.displayDate).format('MMMM YYYY');

// SIDEBAR INCLUDES

		$rootScope.sidebars = [
			{ title: 'Balans', url: '/partials/calendar-list' },
			{ title: 'Nieuw', url: '/partials/calendar-new' },
			{ title: 'Bewerken', url: '/partials/calendar-edit' },
			{ title: 'Filter', url: '/partials/calendar-filter' }
		];

		if (!$rootScope.currentSidebar) {
			$rootScope.currentSidebar = $rootScope.sidebars[0];
		}

// SIDEBAR CONTROLS

		$scope.sidebarClose = function () { 
			$rootScope.currentSidebar = $rootScope.sidebars[0]; 
			$('.fc-day, .fc-event').removeClass('active');
		};

// SIDEBAR FILTER	

		$scope.sidebarFilter = function () { 
			if ($rootScope.currentSidebar.title == "Filter") {
				$rootScope.currentSidebar = $rootScope.sidebars[0];
			} else {
				$rootScope.currentSidebar = $rootScope.sidebars[3];
			}	
			 
			$('.fc-day, .fc-event').removeClass('active');
		};

// WATCH FILTERS

		$rootScope.$watch('filterCategories', function () { $scope.filteringCategories(); }, true);

		$rootScope.$watch('filterUsers', function () { $scope.filteringUsers(); }, true);

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

				$http.post('/money/create', $rootScope.newMoney).success( function (data) {
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

				if (moneyDetail) {
					$rootScope.editMoney = moneyDetail;
					$rootScope.editMoney.amount = accounting.formatMoney($rootScope.editMoney.amount, '', '2', '', ',');

					$rootScope.editMoney.date = moment($rootScope.editMoney.date).format("YYYY-MM-DD");
					$rootScope.editMoney.displayDate = moment($rootScope.editMoney.date).format("D MMMM YYYY");

					highlightSelectedDate($rootScope.editMoney.date);
				} else {
					alert('Sorry, dit bestaat niet meer');
				}
				
			});

		};

// EDIT SOURCE OF MONEY OBJECT

		$scope.sourceEdit = function () {
			$scope.sidebarEdit($rootScope.editMoney.originID);
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
				
				$http.post('/money/remove', $rootScope.editMoney).success( function (data) {

					window.location.reload()			
				});
			} 
		};

// LOAD MONEY OBJECTS

		var moneyCriteria = {
			'month': moment($rootScope.displayDate).format('MM'),
			'year': moment($rootScope.displayDate).format('YYYY')
		}

		$http.post('/money/' + $routeParams.displayYear + '/' + $routeParams.displayMonth, moneyCriteria).success( function (moneyData) {

			$scope.moneyList = [];

			for (i in moneyData) {

				if (moment($rootScope.displayDate).format('M') == moment(moneyData[i].date).format('M')) {
					moneyData[i].displayAmount = accounting.formatMoney(moneyData[i].amount, '', '2', '', ',');
					$scope.moneyList.push(moneyData[i]);	
				}				
			}
			
// CALENDAR RENDERING
		
			$('.calendar-view').fullCalendar({
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

					scope.$apply (function() { 

						scope.sidebarEdit(calEvent._id);
					});

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
					$(element).addClass(event.category.slug);
					$(element).addClass(event.user.username);
					$(element).find('.fc-event-title').prepend('<span class="user-icon"><span>' + event.user.username.substring(0,1) + '</span></span>');
					$(element).find('.fc-event-title').prepend('<span class="category-icon ' + event.category.slug + '" title="' + event.category.name +'" style="background-color: ' + event.category.color + ';"></span>');
				}
			});

			$('.calendar-view').fullCalendar('gotoDate', $rootScope.displayDate);

			$scope.filteringCategories();
			$scope.filteringUsers();
		});

		$scope.moneySum = function () {

			var filteredList = $filter('moneyFiltering')($scope.moneyList);
			$scope.moneyTotal = calculateTotal(filteredList);
			var sum = totalDisplay($scope.moneyTotal);

			return sum;
		}

// HIGHLIGHT DATE IF NEW MONEY SIDEBAR IS ACTIVE

		if ($rootScope.newMoney.date && $rootScope.currentSidebar.title == $rootScope.sidebars[1].title) { 
			highlightSelectedDate($rootScope.newMoney.date); 
		}

		$scope.filteringCategories = function () {

			if ($rootScope.filterCategories.length > 0) {
				$('.fc-event').show();

				if ($rootScope.filterUsers.length == 0) {
					
					$('.fc-event').hide();
					for (i in $rootScope.filterCategories) { 
						$('.fc-event.' + $rootScope.filterCategories[i]).show(); 
					}

				} else if ($rootScope.filterUsers.length > 0) {
					
					$('.fc-event').hide();
					for (i in $rootScope.filterCategories) { 
						for (j in $rootScope.filterUsers) {
							$('.fc-event.' + $rootScope.filterCategories[i] + "." + $rootScope.filterUsers[j]).show();
						} 
					}
				}

			} else {

				$('.fc-event').show();

				if ($rootScope.filterUsers.length > 0) {
					
					$('.fc-event').hide();
					for (j in $rootScope.filterUsers) {
						$('.fc-event.' + $rootScope.filterUsers[i]).show();
					} 
				} 
			}
		}

		$scope.filteringUsers = function () {

			if ($rootScope.filterUsers.length > 0) {
				$('.fc-event').show();

				if ($rootScope.filterCategories.length == 0) {
					
					$('.fc-event').hide();
					for (i in $rootScope.filterUsers) { 
						$('.fc-event.' + $rootScope.filterUsers[i]).show(); 
					}

				} else if ($rootScope.filterCategories.length > 0) {
					
					$('.fc-event').hide();
					for (i in $rootScope.filterUsers) { 
						for (j in $rootScope.filterCategories) {
							$('.fc-event.' + $rootScope.filterUsers[i] + "." + $rootScope.filterCategories[j]).show();
						} 
					}
				}

			} else {

				$('.fc-event').show();

				if ($rootScope.filterCategories.length > 0) {
					
					$('.fc-event').hide();
					for (j in $rootScope.filterCategories) {
						$('.fc-event.' + $rootScope.filterCategories[i]).show();
					} 
				} 
			}
		}

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

		// CALCULATE TOTAL

		function calculateTotal (items) {
			var total = 0;

			for (i in items) {
				if (items[i].balance == 'income') {
					total = total + items[i].amount;
				} else if (items[i].balance == 'expense') {
					total = total - items[i].amount;
				}
			}
			return total;
		}

		function totalDisplay (amount) {

			if (amount < 0) {
				var displayAmount = amount.toString().substring(1);
			} else if (amount > 0) {
				displayAmount = amount;
			}

			return accounting.formatMoney(displayAmount, '', '2', '', ','); 
		}
	}
]);

ctrl.controller('poenStats', ['$scope', '$rootScope', '$routeParams', '$http', '$filter',
	function ($scope, $rootScope, $routeParams, $http, $filter) {
		$rootScope.currentSlug = "stats";

// WHAT MONTH TO DISPLAY?

		$scope.checkMonth = moment().add('months', 1).format('YYYY/MM');

		if ($routeParams.displayYear && $routeParams.displayMonth) {

			var processDate = $routeParams.displayYear + "-" + $routeParams.displayMonth;
			$rootScope.displayDate = moment(processDate, "YYYY-MM");
		}

// DATEPICKER

// CALENDAR MONTH NAVIGATION

		$scope.nextMonth = moment($rootScope.displayDate).add('months', 1).format('YYYY/MM');
		$scope.prevMonth = moment($rootScope.displayDate).subtract('months', 1).format('YYYY/MM');
		$scope.currentMonth = moment($rootScope.displayDate).format('MMMM YYYY');

		$rootScope.currentTitle = $rootScope.websiteTitle + " - " + $scope.currentMonth + ", Statistiek";
		
		var chartOptions = {
			animation: false,
			showScale: true,
			scaleLineColor: '#ddd',
			scaleShowLabels: true,
			scaleLabel: '<%=value%>',
			scaleFontFamily: 'sans-serif',
			scaleFontSize: 12,
			scaleFontStyle: 'normal',
			scaleFontColor: '#999',
			responsive: true,
			maintainAspectRatio: true,
			showTooltips: true,
			tooltipEvents: ['mousemove', 'touchstart', 'touchmove'],
			tooltipFillColor: '#000',
			tooltipFontFamily: 'sans-serif',
			tooltipFontSize: 14,
			tooltipFontStyle: 'normal',
			tooltipFontColor: '#fff',
			tooltipTitleFontFamily: 'sans-serif',
			tooltipTitleFontSize: 14,
			tooltipTitleFontStyle: 'bold',
			tooltipTitleFontColor: '#fff',
			tooltipYPadding: 10,
			tooltipXPadding: 10,
			tooltipCaretSize: 8,
			tooltipCornerRadius: 0,
			tooltipXOffset: 10,
			multiTooltipTemplate: '<%= value %>'
		}

		$scope.statsView = 1;

		var randomScalingFactor = function(){ return Math.round(Math.random()*100)};

		var expenseLineData = {
			labels : ["January","February","March","April","May","June","July"],
			datasets : [
				{
				strokeColor : "red",
				pointColor : "red",
				pointStrokeColor : "white",
				fillColor : "transparent",
				data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				},
				{
				strokeColor : "mediumseagreen",
				pointColor : "mediumseagreen",
				pointStrokeColor : "white",
				fillColor : "transparent",
				data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				}
			]
		};

		var expenseLineContext = document.getElementById("expenseLine").getContext("2d");
		var incomeLineContext = document.getElementById("incomeLine").getContext("2d");

		window.expenseLine = new Chart(expenseLineContext).Line(expenseLineData, chartOptions);
		window.incomeLine = new Chart(incomeLineContext).Line(expenseLineData, chartOptions);

		var doughnutData = [
			{
				value: 300,
				color:"#F7464A",
				label: "Red"
			},
			{
				value: 50,
				color: "#46BFBD",
				label: "Green"
			},
			{
				value: 100,
				color: "#FDB45C",
				label: "Yellow"
			},
			{
				value: 40,
				color: "#949FB1",
				label: "Grey"
			},
			{
				value: 120,
				color: "#4D5360",
				label: "Dark Grey"
			}
		];

		var expenseDonutContext = document.getElementById("expenseDonut").getContext("2d");
		var expenseDonutContext2 = document.getElementById("expenseDonut2").getContext("2d");
		var incomeDonutContext = document.getElementById("incomeDonut").getContext("2d");
		var incomeDonutContext2 = document.getElementById("incomeDonut2").getContext("2d");

		window.expenseDonut = new Chart(expenseDonutContext).Doughnut(doughnutData, chartOptions);
		window.expenseDonut2 = new Chart(expenseDonutContext2).Doughnut(doughnutData, chartOptions);
		window.incomeDonut = new Chart(incomeDonutContext).Doughnut(doughnutData, chartOptions);
		window.incomeDonut2 = new Chart(incomeDonutContext2).Doughnut(doughnutData, chartOptions);


		$(function() {
			$( "#from" ).datepicker({
				changeMonth: true,
				numberOfMonths: 1,
				onClose: function( selectedDate ) {
					$( "#to" ).datepicker( "option", "minDate", selectedDate );
				}
			});

			$( "#to" ).datepicker({
				changeMonth: true,
				numberOfMonths: 1,
				onClose: function( selectedDate ) {
					$( "#from" ).datepicker( "option", "maxDate", selectedDate );
				}
			});
		});
	}
]);

ctrl.controller('poenSettings', ['$scope', '$rootScope', '$http',
	function ($scope, $rootScope, $http) {
		$rootScope.currentSlug = "settings";
		$rootScope.currentTitle = $rootScope.websiteTitle + " - Instellingen";

// SAVE NEW CATEGORY

		$scope.saveCategory = function () {
		
			if (!$scope.newCategory.name) {

				alert('Naam invullen alstublieft');

			} else if (!$scope.newCategory.color) {

				alert('Kleur invullen alstublieft');

			} else {

				$http.post('/category/create', $scope.newCategory).success( function (data) {
					if (data == 'error') {
						alert('Sorry, die kleur is al bezet');
					} else {
						window.location.reload();	
					}
				});
			}
		};

		$scope.deleteCategory = function (index) {
			$('.' + $rootScope.categoryList[index].slug + ' .move-category').toggleClass('active');
		};

		$scope.moveCategory = function (index) {

			$http.post('/category/remove', $rootScope.categoryList[index]).success( function (data) {
				
				if (data == 'error') {
					alert('Oh God, dit gaat helemaal mis');
				} else {
					window.location.reload();	
				} 
			});
		};

		$scope.updateCategory = function (index) {

			if (!$rootScope.categoryList[index].name) {

				alert('Naam invullen alstublieft');

			} else if (!$rootScope.categoryList[index].color) {

				alert('Kleur invullen alstublieft');

			} else {

				$http.post('/category/edit', $rootScope.categoryList[index]).success( function (data) {

					if (data == 'error') {
						alert('Dit gaat helemaal de verkeerde kant op!');
					} else if (data == 'success') {
						// DO NOTHING	
					} else {

						alert("Dat kan niet!");
						$rootScope.categoryList[index].name = data.name;
						$rootScope.categoryList[index].color = data.color;
					}
				});
			}
		}
	}
]);
