import {HttpClient} from 'aurelia-fetch-client';
import HRDate       from '../../services/hr-date'
import Events       from '../../services/events'
import Color        from '../../services/color'
import $            from 'jquery'
import _            from 'lodash'

export class Schedule {

    currentDate         = new Date;
    isCurrentDate       = true;
    selectedDate        = new Date;
    selectedTime        = 0;

    period              = '';
    periodClass         = '';
    periodDayClass      = 'schedule__days';
    periodWeekClass     = 'schedule__weeks';
    periodMonth         = 'schedule__months';

    cellWidth           = null;
    cellHourWidth       = 36;
    cellWeekWidth       = 96;
    cellMonthWidth      = 30;

    height              = 0;
    width               = 0;
    screenHeight        = 0;
    screenWidth         = 0;
    indent              = 16;
    panelWidth          = 275;
    translateX          = 0;
    markCurrentLeft     = 0;

    dateArray           = [];
    employersArray      = [];
    // shiftArray          = [];
    barsArray           = [];

    animate             = true;
    inflated            = false;

    schedule;
    $schedule;

    eventsService;
    dateFormat          = HRDate.dateFormat;

    newWorkShiftData;
    conflictShiftData;

    intervalId;

    http;
    
    context             = this;

    constructor() {
        window.__s = this;
        this.http = new HttpClient();
        this.http
            .fetch('application/__for_testing_data/employersJSONArray.json')
            .then(response => response.json())
            .then(data => {
                this.employersArray = data;

                _.forEach(this.employersArray, function(l) {
                    _.forEach(l.employers, function (l) {
                        l.colorCode = Color.getColorIndex(l.role);
                    });
                });
            });


        this.eventsService = new Events;
        this.eventsService.loadData(new Date, new Date);
    }

    attached() {
        this.$schedule    = $(this.schedule);
        this.screenWidth  = this.$schedule.width();
        this.screenHeight = this.$schedule.height();
        this.setPeriod('day');

        this.intervalId = setInterval(::this.update, 30000);
        $(window).on('resize.schedule', ::this.resize);
    }

    detached() {
        clearInterval(this.intervalId);
        $(window).off('resize.schedule');
    }

    resize() {
        this.screenWidth = this.$schedule.width();
        this.screenHeight = this.$schedule.height();
        this
            .setAnimate(true)
            .toCenter();
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
            .markCurrentSync();
        this.selectedDate = this.date;
        this.isCurrentDate = true;
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

    setPeriod(period = 'day') {
        switch (period) {
            case 'day':
                this.period = 'day';
                this.periodClass = this.periodDayClass;
                this.cellWidth = this.cellHourWidth;
                break;

            case 'week':
                this.period = 'week';
                this.periodClass = this.periodWeekClass;
                this.cellWidth = this.cellWeekWidth;
                break;

            case 'month':
                this.period = 'month';
                this.periodClass = this.periodMonth;
                this.cellWidth = this.cellMonthWidth;
                break;
        }

        this
            .inflate(this.selectedDate)
            .setAnimate(false)
            .toCenter()
            .markCurrentSync()
            .checkCurrentDate();

        return this;
    }

    setAnimate(value) {
        this.animate = value;
        return this;
    }

    move(step) {
        let vm = this;

        function left(addUnits, getterArray, equalUnits) {

            let date              = HRDate.add(addUnits, this.dateArray[0].dateArray[0].date, -1),
                centerIndex       = Math.floor(this.dateArray.length / 2),
                centerBlockWidth  = this.dateArray[centerIndex].dateArray.length * this.cellWidth + this.indent,
                previousBockWidth = this.dateArray[centerIndex - 1].dateArray.length * this.cellWidth + this.indent,
                newBlockWidth;

            this.selectedDate = this.dateArray[centerIndex - 1].dateArray[0].date;
            this.selectedTime = HRDate.time(equalUnits, this.selectedDate);
            this.dateArray.unshift({
                time: HRDate.time(equalUnits, date),
                dateArray: HRDate[getterArray](date)
            });
            newBlockWidth = this.dateArray[0].dateArray.length * this.cellWidth + this.indent;
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
                vm.markCurrentSync();
            }, 200);
        }

        function right(addUnits, getterArray, equalUnits) {

            let date = HRDate.add(addUnits, this.dateArray[this.dateArray.length - 1].dateArray[0].date, 1),
                centerIndex      = Math.floor(this.dateArray.length / 2),
                centerBlockWidth = this.dateArray[centerIndex].dateArray.length * this.cellWidth + this.indent,
                nextBockWidth    = this.dateArray[centerIndex + 1].dateArray.length * this.cellWidth + this.indent;

            this.selectedDate = this.dateArray[centerIndex + 1].dateArray[0].date;
            this.selectedTime = HRDate.time(equalUnits, this.selectedDate);
            this.dateArray.push({
                time: HRDate.time(equalUnits, date),
                dateArray: HRDate[getterArray](date)
            });
            this.width += this.dateArray[this.dateArray.length - 1].dateArray.length * this.cellWidth + this.indent;
            this.setAnimate(true);
            this.translateX -= (centerBlockWidth + nextBockWidth) / 2;

            setTimeout(() => {
                let oldBlockWidth = vm.dateArray[0].dateArray.length * vm.cellWidth + vm.indent;

                vm.dateArray.shift();
                vm.width -= oldBlockWidth;
                vm.setAnimate(false);
                vm.translateX += oldBlockWidth;
                vm.markCurrentSync();

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

        if (step === 1)  choose.call(this, right);
        if (step === -1) choose.call(this, left);

        this.checkCurrentDate();

        return this;
    }

    inflate(current = this.date) {
        this.inflated = false;
        this.dateArray = [];
        this.shiftArray = [];
        this.width = 0;

        function inflate(addUnits, arrayGetter, equalUnits, limit = 8) {
            let n = 0,
                date;

            this.dateArray.push({
                time: HRDate.time(equalUnits, current),
                dateArray: HRDate[arrayGetter](current)
            });
            this.width = this.dateArray[0].dateArray.length * this.cellWidth + this.indent;

            while (this.width < this.screenWidth) {
                n++;

                date = HRDate.add(addUnits, current, -n);
                this.dateArray.unshift({
                    time: HRDate.time(equalUnits, date),
                    dateArray: HRDate[arrayGetter](date)
                });
                this.width += this.dateArray[0].dateArray.length * this.cellWidth + this.indent;

                date = HRDate.add(addUnits, current, n);
                this.dateArray.push({
                    time: HRDate.time(equalUnits, date),
                    dateArray: HRDate[arrayGetter](date)
                });
                this.width += this.dateArray[this.dateArray.length - 1].dateArray.length * this.cellWidth + this.indent;

                if (n > limit) break;
            }

            // for (let placeIndex = 0; placeIndex < this.employersArray.length; placeIndex++) {
            //     this.shiftArray.push([]);
            //     for (let employerIndex = 0; employerIndex < this.employersArray[placeIndex].employers.length; employerIndex++) {
            //         this.shiftArray[placeIndex].push([]);
            //         for (let dateLevel1 = 0; dateLevel1 < this.dateArray.length; dateLevel1++) {
            //             this.shiftArray[placeIndex][employerIndex].push([]);
            //             if (this.period === 'day') {
            //                 this.shiftArray[placeIndex][employerIndex][dateLevel1]
            //                     .push(this.eventsService.getShift(
            //                         this.employersArray[placeIndex].employers[employerIndex].id,
            //                         this.dateArray[dateLevel1].dateArray[0]
            //                     ));
            //             } else {
            //                 for (let dateLevel2 = 0; dateLevel2 < this.dateArray[dateLevel1].dateArray.length; dateLevel2++) {
            //                     this.shiftArray[placeIndex][employerIndex][dateLevel1]
            //                         .push(this.eventsService.getShift(
            //                             this.employersArray[placeIndex].employers[employerIndex].id,
            //                             this.dateArray[dateLevel1].dateArray[dateLevel2].date
            //                         ));
            //                 }
            //             }
            //         }
            //     }
            // }
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

        this.inflated = true;
        return this;
    }

    openWorkShiftDialog(place, employer, date, shift) {
        this.newWorkShiftData = {
            context: this,
            place: place,
            employer: employer,
            date: date,
            shift: shift
        };

        return this;
    }

    openConflictShiftDialog(place, date) {
        this.conflictShiftData = {
            place: place,
            date: date
        };
        
        return this;
    };

    getShift(employerId, date) {
        return this.eventsService.getShift(employerId, date);
    }

    getConflict(placeId, date) {
        return this.eventsService.getConflict(placeId, date);
    }

    markCurrentSync() {
        let n = -1;

        if (this.period === 'week' || this.period === 'month' ||
            !this.dateArray.find((element) => {
                n++;
                return element.time === 0;
            })) {
            this.markCurrentLeft = -10;
        } else {
            let left = 0,
                start = moment(this.dateArray[n].dateArray[0].date).startOf('hour').valueOf(),
                end = moment(this.dateArray[n].dateArray[this.dateArray[n].dateArray.length - 1].date).add(1, 'hour').startOf('hour').valueOf();

            if (end <= this.currentDate.valueOf() || start >= this.currentDate.valueOf()) {
                this.markCurrentLeft = -10;
                return this;
            }

            if (n > 0) {
                left = (this.dateArray[0].dateArray.length * this.cellWidth + this.indent) * n + this.indent / 2;
            }

            left += (this.currentDate.valueOf() - start) / (end - start) * this.dateArray[n].dateArray.length * this.cellWidth;

            this.markCurrentLeft = left;
        }

        return this;
    }

    update() {
        this.currentDate = new Date;
        this.markCurrentSync();
        return this;
    }
    
}
