import moment from 'moment'

export default class Schedule {
    
    static getDayHoursArray(date = new Date(), startHour = 8, endHour = 19, minHour = 6, maxHour = 21) {
        let array = [];

        for (let c = minHour; c <= maxHour; c++) {
            array.push(new Date(date.getFullYear(), date.getMonth(), date.getDate(), c));
            array[array.length - 1].active = (c >= startHour && c <= endHour);
        }

        return array;
    }
    
    static getWeekArray(date = new Date()) {
        let array = [],
            date_;

        for (let c = 0; c < 7; c++) {
            date_ = new Date(+date);
            date_.setHours(0, 0, 0);
            date_.setDate(date.getDate() - date.getDay() + c + 1);
            array.push(date_);
            array[array.length - 1].active = (c !== 5 && c !== 6);
        }

        return array;
    }

    static getMonthArray(date = new Date()) {
        let array = [],
            day;

        for (let c = 1; c <= moment(date).daysInMonth(); c++) {
            array.push(new Date(date.getFullYear(), date.getMonth(), c));
            day = array[array.length - 1].getDay();
            array[array.length - 1].active = (day !== 0 && day !== 6);
        }

        return array;
    }

    static add(units, date, shift = 0) {
        return moment(date).add(shift, units).toDate();
    }

    static dateFormat(date, format) {
        return moment(date).format(format);
    }

    static equal(units, date, currentDate = new Date) {
        if (moment(date).isBefore(currentDate, units)) return -1;
        if (moment(date).isSame(currentDate, units)) return 0;
        if (moment(date).isAfter(currentDate, units)) return 1;
    }

}