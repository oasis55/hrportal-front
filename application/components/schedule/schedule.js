import HRDate from '../../services/hr-date'
import Events from '../../services/events'
import Color  from '../../services/color'
import $      from 'jquery'
import _      from 'lodash'

export class Shedule {
    
    date                = new Date();
    selectedDate        = new Date();
    isCurrentDate       = true;
    period              = null;
    dateArray           = [];
    employersJSONArray  = [
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
    dateFormat          = HRDate.dateFormat;
    events              = null;
    event               = null;

    indent              = 16;
    cellWidth           = null;
    hourCellWidth       = 36;
    dayInWeekCellWidth  = 96;
    dayInMonthCellWidth = 30;
    panelWidth          = 275;
    translateX          = 0;
    height              = null;
    width               = null;
    screenHeight        = null;
    screenWidth         = null;
    animate             = true;

    schedule;
    $schedule;

    constructor() {

        this.events = new Events;
        this.events.loadData();

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
            .inflate(this.selectedDate)
            .setAnimate(false)
            .toCenter()
            .checkCurrentDate();

        return this;
    }

    move(step) {

        let vm = this;

        function left(addUnits, getterArray, equalUnits) {

            let date              = HRDate.add(addUnits, this.dateArray[0][0], -1),
                centerIndex       = Math.floor(this.dateArray.length / 2),
                centerBlockWidth  = this.dateArray[centerIndex].length * this.cellWidth + this.indent,
                previousBockWidth = this.dateArray[centerIndex - 1].length * this.cellWidth + this.indent,
                newBlockWidth;

            this.selectedDate = this.dateArray[centerIndex - 1][0];
            this.dateArray.unshift(HRDate[getterArray](date));
            this.dateArray[0].time = HRDate.time(equalUnits, date);
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

            let date = HRDate.add(addUnits, this.dateArray[this.dateArray.length - 1][0], 1),
                centerIndex      = Math.floor(this.dateArray.length / 2),
                centerBlockWidth = this.dateArray[centerIndex].length * this.cellWidth + this.indent,
                nextBockWidth    = this.dateArray[centerIndex + 1].length * this.cellWidth + this.indent;

            this.selectedDate = this.dateArray[centerIndex + 1][0];
            this.dateArray.push(HRDate[getterArray](date));
            this.dateArray[this.dateArray.length - 1].time = HRDate.time(equalUnits, date);
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

            this.checkCurrentDate();
        }

        if (step === 1)  choose.call(this, right);
        if (step === -1) choose.call(this, left);

        return this;
    }

    inflate(current = this.date) {
        this.dateArray = [];
        this.width = 0;

        let n = 0,
            date;

        function inflate(addUnits, getterArray, equalUnits, limit = 8) {
            let n = 0, date;

            this.dateArray.push(HRDate[getterArray](current));
            this.dateArray[this.dateArray.length - 1].time = HRDate.time(equalUnits, current);
            this.width = this.dateArray[0].length * this.cellWidth + this.indent;

            while (this.width < this.screenWidth) {
                n++;

                date = HRDate.add(addUnits, current, -n);
                this.dateArray.unshift(HRDate[getterArray](date));
                this.dateArray[0].time = HRDate.time(equalUnits, date);
                this.width += this.dateArray[0].length * this.cellWidth + this.indent;

                date = HRDate.add(addUnits, current, n);
                this.dateArray.push(HRDate[getterArray](date));
                this.dateArray[this.dateArray.length - 1].time = HRDate.time(equalUnits, date);
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

    toCurrent() {
        this
            .inflate(this.date)
            .setAnimate(false)
            .toCenter()
        this.selectedDate = this.date;
        this.isCurrentDate = true;
    }

    setAnimate(value) {
        this.animate = value;
        return this;
    }

    getEvent(userId, date) {
        this.event = this.events.getEvent(userId, date);
        return this.event;
    }
    
    checkCurrentDate() {

        switch (this.period) {
            case 'day':
                this.isCurrentDate = HRDate.equal('day', this.selectedDate, this.date);
                break;

            case 'week':
                this.isCurrentDate = HRDate.equal('isoWeek', this.selectedDate, this.date);
                break;

            case 'month':
                this.isCurrentDate = HRDate.equal('month', this.selectedDate, this.date);
                break;
        }

        return this;
    }

}
