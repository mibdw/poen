var app = angular.module('poenApp', ['ngRoute']);

app.config(['$routeProvider', 
	function ($routeProvider) {
		$routeProvider.
		otherwise({
			redirectTo: '/'
		});
	}
]);

app.controller('poenGlobal', ['$scope', '$http',
	function ($scope, $http) {
		moment.lang('nl');
		$scope.displayDate = moment();
		$scope.displayMonth = moment($scope.displayDate).format('MMMM YYYY');
		$scope.actualMonth = moment().format('MMMM YYYY');
		
		$scope.heading = "Poen";
		$scope.moniker = $scope.heading + " - " + $scope.displayMonth;

		$scope.newMoney = {};
		$scope.editMoney = {};

		$scope.gotoMonth = function (arg) {
			if (moment(arg).isValid()) {
				$scope.displayDate = moment(arg);
			} else if (arg == 'next') {
				$scope.displayDate = moment($scope.displayDate).add('1', 'month');
			} else if (arg == 'prev') {
				$scope.displayDate = moment($scope.displayDate).subtract('1', 'month');
			} else if (arg == 'today') {
				$scope.displayDate = moment();
			}
			$('.calendar-view').fullCalendar('gotoDate', $scope.displayDate);
			$scope.displayMonth = moment($scope.displayDate).format('MMMM YYYY');
			$scope.moniker = $scope.heading + " - " + $scope.displayMonth;

			$scope.calcDate()
			$scope.getUsers();
			$scope.getCategories();
		}

		$scope.sidebars = [
			{ title: 'Balans', url: '/sidebar/list' },
			{ title: 'Nieuw', url: '/sidebar/new' },
			{ title: 'Bewerken', url: '/sidebar/edit' }
		]

		if (!$scope.sidebar) { $scope.sidebar = $scope.sidebars[0] }

		$scope.sidebarClose = function () { 
			$scope.sidebar = $scope.sidebars[0]; 
			$('.fc-day, .fc-event').removeClass('active');
			$scope.mobileView = 'calendar';
		}

		$scope.sidebarNew = function (date) { 
			$scope.mobileView = 'sidebar';
			$scope.sidebar = $scope.sidebars[1]; 
			if (date) {
				$scope.newMoney.date = date.format("YYYY-MM-DD");
				$scope.newMoney.displayDate = date.format("D MMMM YYYY");
			}
		}

		$scope.saveMoney = function () {
			if ($scope.newMoney.amount.indexOf(',') > -1) $scope.newMoney.amount = accounting.unformat($scope.newMoney.amount, ','); 
			if (!$scope.newMoney.category) $scope.newMoney.category = $scope.categoryList[0]._id;	
			$http.post('/money/create', $scope.newMoney).success( function (data) {
				$scope.sidebar = $scope.sidebars[0]; 
				$scope.newMoney = {};
				$('.calendar-view').fullCalendar('refetchEvents');
				$scope.getUsers();
				$scope.getCategories();
				$('.fc-day, .fc-event').removeClass('active');
				$scope.mobileView = 'calendar';
			});
		}

		$scope.sidebarEdit = function (id) { 
			$scope.sidebar = $scope.sidebars[2]; 
			$scope.editID = id;
			$('.fc-day').removeClass('active');
			$http.post('/money/detail', { 'moneyID': id }).success( function (moneyDetail) {
				if (moneyDetail) {
					$scope.editMoney = moneyDetail;
					$scope.editMoney.amount = accounting.formatMoney($scope.editMoney.amount, '', '2', '', ',');
					$scope.editMoney.date = moment($scope.editMoney.date).format("YYYY-MM-DD");
					$scope.editMoney.displayDate = moment($scope.editMoney.date).format("D MMMM YYYY");

					$scope.mobileView = 'sidebar';
				} else {
					alert('Sorry, dit bestaat niet meer');
				}				
			});
		}

		$scope.updateMoney = function () {
			if (!$scope.editMoney.note) { $scope.editMoney.note = "" }
			if ($scope.editMoney.amount.indexOf(',') > -1) { 
				$scope.editMoney.amount = accounting.unformat($scope.editMoney.amount, ',')
			}
			if (!$scope.editMoney.category) $scope.editMoney.category = $scope.categoryList[0]._id;
			$http.post('/money/edit', $scope.editMoney).success( function (data) {
				$scope.sidebar = $scope.sidebars[0]; 
				$scope.editMoney = {};
				$('.calendar-view').fullCalendar('refetchEvents');
				$scope.getUsers();
				$scope.getCategories();	
				$('.fc-day, .fc-event').removeClass('active');
				$scope.mobileView = 'calendar';
			});
		}

		$scope.deleteMoney = function () {
			if (confirm("Weet je het zeker?") == true) {				
				$http.post('/money/remove', $scope.editMoney).success( function (data) {
					$scope.sidebar = $scope.sidebars[0]; 
					$('.calendar-view').fullCalendar('refetchEvents');
					$scope.getUsers();
					$scope.getCategories();
					$('.fc-day, .fc-event').removeClass('active');

					$scope.mobileView = 'calendar';
				});
			} 
		}

		setTimeout(function () {
			$('.calendar-view').fullCalendar({
				firstDay: 1,
				eventSources: [
					{
						url: '/money/list',
						method: 'POST',
						data: {
							categories: $scope.filterCategories,
							users: $scope.filterUsers
						},
						error: function() {
							alert('there was an error while fetching events!');
						}
					}
				],
				dayClick: function(date, jsEvent, view) { 
					var scope = angular.element('html').scope();
					
					scope.$apply (function () {		
						if (scope.sidebar == scope.sidebars[2]) {
							scope.editMoney.date = date.format("YYYY-MM-DD");
							scope.editMoney.displayDate = date.format("D MMMM YYYY");
						} else { 
							scope.sidebarNew(date);
						}
					});
										
					$('.fc-day, .fc-event').removeClass('active');
					$(this).addClass('active');

				},
				dayRender: function (date, cell) {
					var scope = angular.element('html').scope();
					scope.$apply (function () {		
						if (scope.sidebar == scope.sidebars[1] && moment(scope.newMoney.date).isSame(date, 'day')) {
							cell.addClass('active');
						} else if (scope.sidebar == scope.sidebars[2] && moment(scope.editMoney.date).isSame(date, 'day')) {
							cell.addClass('active');
						}
					});
				},
				eventClick: function(calEvent, jsEvent, view) { 
					var scope = angular.element('html').scope();
					scope.$apply (function () {	
						scope.sidebarEdit(calEvent._id);
					});

					$('.fc-day, .fc-event').removeClass('active');
					$(this).addClass('active');			
				},
				eventMouseover: function(calEvent, jsEvent, view) {
					$('.' + calEvent._id).css('background-color', 'black');
				},
				eventMouseout: function(calEvent, jsEvent, view) { 
					$('.' + calEvent._id).css('background-color', calEvent.category.color);					
				},
				eventRender: function(event, element) {
					element.css('background-color', event.category.color);
					element.attr('title', event.title + ' [' + event.category.name + '] = ' + event.amount)
					element.addClass(event._id);
					element.append('<span class="user" style=>' + event.user.username.substr(0, 1) + '</span>');	
				}
			});
		}, 1);
		$('.calendar-view').fullCalendar('gotoDate', $scope.displayDate);

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

		$(document).on('mouseenter', '.balance-money', function () { 
			$('.' + $(this).attr('id')).addClass("hover"); 
		});

		$(document).on('mouseleave', '.balance-money', function () { 
			$('.' + $(this).attr('id')).removeClass("hover"); 
		});

		$scope.calcNum = 24;
		$scope.calcChange = function (arg) {
			if (arg == 'plus') { $scope.calcNum = $scope.calcNum + 1 }
			if (arg == 'minus') { $scope.calcNum = $scope.calcNum - 1 }
			$scope.calcDate();
			$scope.getUsers();
			$scope.getCategories();
		}

		$scope.calcDate = function () {
			$scope.calcStart = moment($scope.displayDate).subtract('1', 'month').date($scope.calcNum);
			$scope.calcEnd = moment($scope.calcStart).add('1', 'month');
			$scope.dateRange = moment($scope.calcStart).add('1', 'day').format('DD/MM') + "\u2013" + moment($scope.calcEnd).format('DD/MM');
		}
		$scope.calcDate();		

		$scope.filterUsers = [];
		$scope.getUsers = function () {
			$http.post('/users/list').success( function (userData) {
				$scope.userList = userData;
				$scope.usersTotal = 0;
				var count = 0;

				angular.forEach($scope.userList, function (user) {
					$http.post('/users/expense', {
							id: user._id,
							start: $scope.calcStart,
							end: $scope.calcEnd 
						}).then(function (expense){
						if (expense.data.length > 0) {
							user.expense = expense.data[0].total;
						} else {
							user.expense = 0;
						}

						$http.post('/users/income', {
								id: user._id,
								start: $scope.calcStart,
								end: $scope.calcEnd 
							}).then(function (income){
							if (income.data.length > 0) {
								user.income = income.data[0].total;
							} else {
								user.income = 0;
							}
							user.total = user.income - user.expense;
							$scope.usersTotal = $scope.usersTotal + user.total;
							user.totalDisplay = accounting.formatMoney(user.total, '', '2', '', ',');
							if (user.total < 0) {
								user.totalDisplay = "\u2013 " + user.totalDisplay.substr(1);
							}

							count = count + 1;
							if (count == $scope.userList.length) {
								$scope.usersTotalDisplay = accounting.formatMoney($scope.usersTotal, '', '2', '', ',');
							}				
						});
					});
				});
			});
		}
		$scope.getUsers();

		$scope.userToggle = function (arg) {
			if (arg == 'all') {
				$scope.filterUsers.length = 0;
			} else if ($scope.filterUsers.indexOf(arg) > -1) {
				var index = $scope.filterUsers.indexOf(arg);
				$scope.filterUsers.splice(index, 1);
			} else if ($scope.filterUsers.indexOf(arg) == -1) {
				$scope.filterUsers.push(arg);
				if ($scope.filterUsers.length == $scope.userList.length) {
					$scope.filterUsers.length = 0;
				}
			}
			$('.calendar-view').fullCalendar('refetchEvents');
			$scope.getCategories();
		}

		$scope.filterCategories = [];
		$scope.getCategories = function () {
			$http.post('/category/list', { filter: $scope.filterCategories }).success( function (categoryData) {
				$scope.categoryList = categoryData;

				angular.forEach($scope.categoryList, function (category) {
					$http.post('/category/expense', {
						id: category._id, 
						users: $scope.filterUsers,
						start: $scope.calcStart,
						end: $scope.calcEnd
					}).then(function (expense){
						if (expense.data.length > 0) {
							category.expense = expense.data[0].total;
						} else {
							category.expense = 0;
						}

						$http.post('/category/income', {
							id: category._id, 
							users: $scope.filterUsers,
							start: $scope.calcStart,
							end: $scope.calcEnd
						}).then(function (income){
							if (income.data.length > 0) {
								category.income = income.data[0].total;
							} else {
								category.income = 0;
							}

							category.total = category.income - category.expense;
							category.totalDisplay = accounting.formatMoney(category.total, '', '2', '', ',');	
							if (category.total < 0) {
								category.totalDisplay = "\u2013 " + category.totalDisplay.substr(1);
							}			
						});
					});
				});
			});
		}
		$scope.getCategories();

		$scope.categoryToggle = function (arg) {
			if ($scope.filterCategories.indexOf(arg) > -1) {
				var index = $scope.filterCategories.indexOf(arg);
				$scope.filterCategories.splice(index, 1);
			} else if ($scope.filterCategories.indexOf(arg) == -1) {
				$scope.filterCategories.push(arg);
			}
			$('.calendar-view').fullCalendar('refetchEvents');
		}

		$scope.removeCategoryFilters = function () {
			$scope.filterCategories.length = 0;
			$('.calendar-view').fullCalendar('refetchEvents');
		}

		$scope.moveInclude = "/sidebar/move";
		$scope.editCategory = function (index) {
			$('tr#' + index + ' .normal').hide();
			$('tr#' + index + ' .update').show();
			$scope.categoryToggle($scope.categoryList[index]._id);
		}

		$scope.cancelEditCategory = function (index) {
			$('tr#' + index + ' .normal').show();
			$('tr#' + index + ' .update').hide();
		}

		$scope.newCategory = {};
		$scope.saveCategory = function () {					
			$http.post('/category/create', $scope.newCategory).success( function (data) {
				$scope.getCategories();
				$scope.createCategory = false;
			});
		};

		$scope.deleteCategory = function (index) {
			$('tr#' + index + ' .update .move').toggle();
			$('tr#' + index + ' .update .save').toggle();
		};

		$scope.moveCategory = function (index) {
			if (!$scope.categoryList[index].move) {
				alert('Een vervangende categorie invullen astublieft!');
			} else {
				$http.post('/category/remove', { '_id': $scope.categoryList[index]._id, 'move': $scope.categoryList[index].move }).success( function (data) {
					$('.calendar-view').fullCalendar('refetchEvents');
					$scope.getUsers();					
					$scope.getCategories();
				});
			}
		};

		$scope.updateCategory = function (index) {
			var updateCat = {
				'_id': $scope.categoryList[index]._id,
				'name': $scope.categoryList[index].name,
				'color': $scope.categoryList[index].color
			}
			$http.post('/category/edit', updateCat).success( function (data) {
				$('.calendar-view').fullCalendar('refetchEvents');
				$scope.getCategories();
			});
		}

		$scope.mobileView = 'calendar';
	}
]);