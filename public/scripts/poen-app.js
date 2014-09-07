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
		}

		$scope.sidebarNew = function (date) { 
			$scope.sidebar = $scope.sidebars[1]; 
			if (date) {
				$scope.newMoney.date = date.format("YYYY-MM-DD");
				$scope.newMoney.displayDate = date.format("D MMMM YYYY");
			}
		}

		$scope.saveMoney = function () {
			if ($scope.newMoney.amount.indexOf(',') > -1) { 
				$scope.newMoney.amount = accounting.unformat($scope.newMoney.amount, ',')
			}		
			$http.post('/money/create', $scope.newMoney).success( function (data) {
				$scope.sidebar = $scope.sidebars[0]; 
				$scope.newMoney = {};
				$('.calendar-view').fullCalendar('refetchEvents');
				$scope.getUsers();
				$scope.getCategories();
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
				} else {
					alert('Sorry, dit bestaat niet meer');
				}				
			});
		}

		$scope.updateMoney = function () {
			if (!$scope.editMoney.note) { $scope.editMoney.note = "" }
			if ($scope.editMoney.amount.indexOf(',') > -1) { 
				$scope.editMoney.amount = accounting.unformat($scope.editMoney.amount, ','); 
			}
			$http.post('/money/edit', $scope.editMoney).success( function (data) {
				$scope.sidebar = $scope.sidebars[0]; 
				$scope.editMoney = {};
				$('.calendar-view').fullCalendar('refetchEvents');
				$scope.getUsers();
				$scope.getCategories();		
			});
		}

		$scope.deleteMoney = function () {
			if (confirm("Weet je het zeker?") == true) {				
				$http.post('/money/remove', $scope.editMoney).success( function (data) {
					$scope.sidebar = $scope.sidebars[0]; 
					$('.calendar-view').fullCalendar('refetchEvents');
					$scope.getUsers();
					$scope.getCategories();
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
					var hoverColor = morphColor(calEvent.category.color, -20);
					$('.' + calEvent._id).css('background-color', 'black');
				},
				eventMouseout: function(calEvent, jsEvent, view) { 
					$('.' + calEvent._id).css('background-color', calEvent.category.color);					
				},
				eventRender: function(event, element) {
					element.css('background-color', event.category.color);
					element.attr('title', event.title + ' [' + event.category.name + ']')
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

		$scope.calcStartDate = 25;
		$scope.calcStartChange = function (arg) {
			if (arg == 'plus') { $scope.calcStartDate = $scope.calcStartDate + 1 }
			if (arg == 'minus') { $scope.calcStartDate = $scope.calcStartDate - 1 }
		}

		$scope.filterUsers = [];
		$scope.getUsers = function () {
			$http.post('/users/list').success( function (userData) {
				$scope.userList = userData;
				$scope.usersTotal = 0;
				var count = 0;

				angular.forEach($scope.userList, function (user) {
					$http.post('/users/expense', {id: user._id}).then(function (expense){
						user.expense = expense.data[0].total;

						$http.post('/users/income', {id: user._id}).then(function (income){
							user.income = income.data[0].total;
							user.total = user.income - user.expense;
							$scope.usersTotal = $scope.usersTotal + user.total;
							user.total = accounting.formatMoney(user.total, '', '2', '', ',');

							count = count + 1;
							if (count == $scope.userList.length) {
								$scope.usersTotal = accounting.formatMoney($scope.usersTotal, '', '2', '', ',');
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
					$http.post('/category/expense', {id: category._id, users: $scope.filterUsers}).then(function (expense){
						if (expense.data.length > 0) {
							category.expense = expense.data[0].total;
						} else {
							category.expense = 0;
						}

						$http.post('/category/income', {id: category._id, users: $scope.filterUsers}).then(function (income){
							if (income.data.length > 0) {
								category.income = income.data[0].total;
							} else {
								category.income = 0;
							}

							category.total = category.income - category.expense;
							category.total = accounting.formatMoney(category.total, '', '2', '', ',');				
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

		$scope.saveCategory = function () {		
			if (!$scope.newCategory.name) {;
				alert('Naam invullen alstublieft');
			} else if (!$scope.newCategory.color) {
				alert('Kleur invullen alstublieft');
			} else {
				$http.post('/category/create', $scope.newCategory).success( function (data) {
					if (data == 'error') {
						alert('Sorry, die kleur is al bezet');
					} else {
						$http.get('/category/list').success( function (categoryData) {
							$scope.categoryList = categoryData;
						});	
					}
				});
			}
		};

		$scope.deleteCategory = function (index) {
			$('.' + $scope.categoryList[index].slug + ' .move-category').toggleClass('active');
		};

		$scope.moveCategory = function (index) {
			$http.post('/category/remove', $scope.categoryList[index]).success( function (data) {
				if (data == 'error') {
					alert('Oh God, dit gaat helemaal mis');
				} else {
					$http.get('/category/list').success( function (categoryData) {
						$scope.categoryList = categoryData;
					});	
				} 
			});
		};

		$scope.updateCategory = function (index) {
			if (!$scope.categoryList[index].name) {
				alert('Naam invullen alstublieft');
			} else if (!$scope.categoryList[index].color) {
				alert('Kleur invullen alstublieft');
			} else {
				$http.post('/category/edit', $scope.categoryList[index]).success( function (data) {
					if (data == 'error') {
						alert('Dit gaat helemaal de verkeerde kant op!');
					} else if (data == 'success') {
						// DO NOTHING	
					} else {
						alert("Dat kan niet!");
						$scope.categoryList[index].name = data.name;
						$scope.categoryList[index].color = data.color;
					}
				});
			}
		}

		function morphColor (col, amt) {
			var usePound = false;
			if (col[0] == "#") {
				col = col.slice(1);
				usePound = true;
			}
			var num = parseInt(col,16);
			var r = (num >> 16) + amt;
			if (r > 255) r = 255;
			else if  (r < 0) r = 0;
			var b = ((num >> 8) & 0x00FF) + amt;
			if (b > 255) b = 255;
			else if  (b < 0) b = 0;
			var g = (num & 0x0000FF) + amt;
			if (g > 255) g = 255;
			else if (g < 0) g = 0;
			return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
		}
	}
]);