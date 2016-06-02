import Schedule from 'services/schedule'
import Events from  'services/events'
import Color from 'services/color'
import $ from 'jquery'
import _ from 'lodash'

// function c(m) {
//     window.console.log(m);
// }

export class App {

    schedule;
    $schedule;
    date = new Date();
    period = '';
    dateArray = [];
    employersJSONArray = [
        {
            id: 1,
            name: 'Салон «Московский»',
            employers: [
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
            ]
        },
        {
            id: 2,
            name: 'Салон «Суворовский»',
            employers: [
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
                }
            ]
        }
    ];
    dateFormat = Schedule.dateFormat;
    animate = true;
    events = Events;

    indent              = 16;
    cellWidth           = null;
    hourCellWidth       = 36;
    dayInWeekCellWidth  = 96;
    dayInMonthCellWidth = 30;
    panelWidth          = 275;
    translateX          = 0;
    height              = null;
    screenHeight        = null;
    width               = null;
    screenWidth         = null;

    constructor() {
        
        _.forEach(this.employersJSONArray, function(level1) {
            _.forEach(level1.employers, function (level2) {
                level2.colorCode = Color.getColorIndex(level2.role);
            });
        });

    }

    attached() {
        this.$schedule = $(this.schedule);
        this.screenWidth = this.$schedule.width();
        this.screenHeight = this.$schedule.height();
        this.setPeriod();

        $(window).bind('resize', $.proxy(this.resize, this));
    }

    detached() {
        $(window).unbind('resize', this.resize);
    }

    resize() {
        this.screenWidth = this.$schedule.width();
        this.screenHeight = this.$schedule.height();
        this
            .inflate()
            .setAnimate(true)
            .toCenter();
        return this;
    }

    setPeriod(period) {
        switch (period) {
            case 'day':
                this.period = 'day';
                this.cellWidth = this.hourCellWidth;
                break;
            case 'week':
                this.period = 'week';
                this.cellWidth = this.dayInWeekCellWidth;
                break;
            case 'month':
                this.period = 'month';
                this.cellWidth = this.dayInMonthCellWidth;
                break;
            default:
                this.period = 'day';
                this.cellWidth = this.hourCellWidth;
                break;
        }

        this
            .inflate()
            .setAnimate(false)
            .toCenter();

        return this;
    }

    setAnimate(value) {
        this.animate = value;
        return this;
    }

    move(step) {

        let vm = this;

        function left(addUnits, getterArray, equalUnits) {

            let date              = Schedule.add(addUnits, this.dateArray[0][0], -1),
                centerIndex       = Math.floor(this.dateArray.length / 2),
                centerBlockWidth  = this.dateArray[centerIndex].length * this.cellWidth + this.indent,
                previousBockWidth = this.dateArray[centerIndex - 1].length * this.cellWidth + this.indent,
                newBlockWidth;

            this.dateArray.unshift(Schedule[getterArray](date));
            this.dateArray[0].time = Schedule.equal(equalUnits, date);
            newBlockWidth = this.dateArray[0].length * this.cellWidth + this.indent;
            this.width += newBlockWidth;
            this.setAnimate(false);
            this.translateX -= newBlockWidth;

            setTimeout(() => {
                vm.setAnimate(true);
                this.translateX += (centerBlockWidth + previousBockWidth) / 2;
            }, 1);

            setTimeout(() => {
                vm.width -= vm.dateArray[vm.dateArray.length - 1].length * vm.cellWidth + vm.indent;
                vm.dateArray.pop();
            }, 200);
        }

        function right(addUnits, getterArray, equalUnits) {

            let date = Schedule.add(addUnits, this.dateArray[this.dateArray.length - 1][0], 1),
                centerIndex      = Math.floor(this.dateArray.length / 2),
                centerBlockWidth = this.dateArray[centerIndex].length * this.cellWidth + this.indent,
                nextBockWidth    = this.dateArray[centerIndex + 1].length * this.cellWidth + this.indent;

            this.dateArray.push(Schedule[getterArray](date));
            this.dateArray[this.dateArray.length - 1].time = Schedule.equal(equalUnits, date);
            this.width += this.dateArray[this.dateArray.length - 1].length * this.cellWidth + this.indent;
            this.setAnimate(true);
            this.translateX -= (centerBlockWidth + nextBockWidth) / 2;

            setTimeout(() => {
                let oldBlockWidth = vm.dateArray[0].length * vm.cellWidth + vm.indent;

                vm.dateArray.shift();
                vm.width -= oldBlockWidth;
                vm.setAnimate(false);
                vm.translateX += oldBlockWidth;

            }, 200);
        }

        function choose(fn) {
            switch (this.period) {
                case 'day':
                    fn.call(this, 'days', 'getDayHoursArray', 'day');
                    break;

                case 'week':
                    fn.call(this, 'weeks', 'getWeekArray', 'isoWeek');
                    break;

                case 'month':
                    fn.call(this, 'months', 'getMonthArray', 'month');
                    break;
            }
        }

        if (step > 0) {

            choose.call(this, right);

        } else {

            choose.call(this, left);

        }

        return this;
    }

    inflate(current = this.date) {
        this.dateArray = [];
        this.width = 0;

        let n = 0,
            date;

        function inflate(addUnits, getterArray, equalUnits, limit = 8) {
            let n = 0, date;

            this.dateArray.push(Schedule[getterArray](current));
            this.dateArray[this.dateArray.length - 1].time = Schedule.equal(equalUnits, current);
            this.width = this.dateArray[0].length * this.cellWidth + this.indent;

            while (this.width < this.screenWidth) {
                n++;

                date = Schedule.add(addUnits, current, -n);
                this.dateArray.unshift(Schedule[getterArray](date));
                this.dateArray[0].time = Schedule.equal(equalUnits, date);
                this.width += this.dateArray[0].length * this.cellWidth + this.indent;

                date = Schedule.add(addUnits, current, n);
                this.dateArray.push(Schedule[getterArray](date));
                this.dateArray[this.dateArray.length - 1].time = Schedule.equal(equalUnits, date);
                this.width += this.dateArray[this.dateArray.length - 1].length * this.cellWidth + this.indent;

                if (n > limit) break;
            }

        }

        switch (this.period) {
            case 'day':
                inflate.call(this, 'days', 'getDayHoursArray', 'day');
                break;

            case 'week':
                inflate.call(this, 'weeks', 'getWeekArray', 'isoWeek');
                break;

            case 'month':
                inflate.call(this, 'months', 'getMonthArray', 'month', 4);
                break;
        }

        return this;
    }

    toCenter() {

        this.translateX = (this.screenWidth - this.width + this.panelWidth) / 2;
        return this;
    }
    
    // todo: for test
    random() {
        return Math.random();
    }
    
}
