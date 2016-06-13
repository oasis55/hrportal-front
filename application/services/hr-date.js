import moment from 'moment'

export default class HRDate {
    
    static getDayHoursArray(date = new Date(), startHour = 8, endHour = 19, minHour = 6, maxHour = 21) {
        let array = [];

        for (let c = minHour; c <= maxHour; c++) {
            array.push({
                date: moment(date).hour(c).toDate(),
                active: c >= startHour && c <= endHour
            });
        }

        return array;
    }
    
    static getWeekArray(date = new Date()) {
        let array = [];

        for (let c = 1; c <= 7; c++) {
            array.push({
                date: moment(date).isoWeekday(c).toDate(),
                active: !(c === 6 || c === 7)
            });
        }

        return array;
    }

    static getMonthArray(date = new Date()) {
        let array = [];

        for (let c = 1, day; c <= moment(date).daysInMonth(); c++) {
            day = moment(date).date(c).toDate();
            array.push({
                date: day,
                active: (day !== 0 && day !== 6)
            });
        }

        return array;
    }

    static add(units, date, shift = 0) {
        return moment(date).add(shift, units).toDate();
    }

    static dateFormat(date, format) {
        return moment(date).format(format);
    }

    static time(units, date, currentDate = new Date) {
        if (moment(date).isBefore(currentDate, units)) return -1;
        if (moment(date).isSame(currentDate, units))   return 0;
        if (moment(date).isAfter(currentDate, units))  return 1;
    }

    static equal(units, date, currentDate = new Date) {
        return moment(date).isSame(currentDate, units);
    }

}