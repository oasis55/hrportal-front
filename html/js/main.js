angular
    .module('hrportal', [])
    .controller('mainCtrl', ['$scope', function ($scope) {
        
        // for testing: start
        $scope.showGroup1 = true;
        $scope.showGroup2 = true;
        
        // for testing: end

        $scope.now = new Date();
        $scope.users = [
            {
                id: 1,
                name: 'Ирина Величко',
                role: 'менеджер'
            },
            {
                id: 2,
                name: 'Петр петров',
                role: 'продавец'
            },
            {
                id: 3,
                name: 'Иван Иванов',
                role: 'продавец'
            },
            {
                id: 4,
                name: 'Владимир Пак',
                role: 'продавец'
            },
            {
                id: 5,
                name: 'Светлана Назарова',
                role: 'технолог'
            },
            {
                id: 6,
                name: 'Кирилл Веселый',
                role: 'мерчандайзер'
            },
            {
                id: 7,
                name: 'Ким Ли',
                role: 'саппорт'
            }

        ];
        $scope.employment = [
            {
                id: 1,
                type: 1,
                start: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 9),
                end: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 19)
            },
            {
                id: 2,
                type: 0,
                start: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate() - 3),
                end: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate() + 3)
            },
            {
                id: 3,
                type: 1,
                start: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 8),
                end: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 20)
            },
            {
                id: 4,
                type: 1,
                start: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 9),
                end: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 20)
            },
            {
                id: 5,
                type: 1,
                start: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 8),
                end: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 19)
            },
            {
                id: 6,
                type: 1,
                start: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 9),
                end: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 17)
            },
            {
                id: 7,
                type: 1,
                start: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 9),
                end: new Date($scope.now.getFullYear(), $scope.now.getMonth(), $scope.now.getDate(), 20)
            }
        ];

        console.log($scope.employment);
        
        $scope.setPeriod = function (period) {
            switch (period) {
                case 'day':
                    $scope.period = 'day';
                    $scope.repeatArray = $scope.getHoursArray();
                    break;
                case 'week':
                    $scope.period = 'week';
                    $scope.repeatArray = $scope.getWeekArray();
                    break;
                case 'month':
                    $scope.period = 'month';
                    $scope.repeatArray = $scope.getMonthArray();
                    break;
                default:
                    $scope.period = 'day';
                    $scope.repeatArray = $scope.getHoursArray();
                    break;
            }
        };
        
        $scope.getHoursArray = function (minHour, maxHour, startHour, endHour) {
            minHour   = minHour   || 6;
            maxHour   = maxHour   || 21;
            startHour = startHour || 8;
            endHour   = endHour   || 19;

            var array = [];

            for (var c = minHour; c <= maxHour; c++) {
                array.push({
                    hour: c,
                    minute: 0,
                    active: (c >= startHour) && (c <= endHour)
                });
            }
            
            return array;
        };
        
        $scope.getWeekArray = function (date) {
            var array = [];

            for (var c = 0; c < 7; c++) {
                array.push((new Date(date.valueOf())).setDate(date.getDate() - date.getDay() + c + 1));
            }
            
            return array;            
        };
        
        $scope.getMonthArray = function (date) {
            var array = [];

            for (var c = 0; c < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); c++) {
                array.push({
                    // active:
                });
            }

            return array;
        };
        
        $scope.getDate = function (date, shift) {
            var newDate = new Date();
            newDate.setDate(date.getDate() + shift);
            return newDate;
        };
        
        $scope.move = function ($event) {
            switch ($event.keyCode) {

                // <-
                case 37:
                    $scope.now = $scope.getDate($scope.now, -1);
                    break;

                // ->
                case 39:
                    $scope.now = $scope.getDate($scope.now, 1);
                    break;

                default:
                    break;
            }
        };
        
        // init
        $scope.repeatArray = $scope.getHoursArray();
        $scope.setPeriod();
        angular.element(document).on('keydown', function (e) {
            $scope.move(e);
            $scope.$digest();
        });

    }]);
