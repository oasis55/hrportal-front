import moment from 'github:moment/moment@2.13.0';
// import * as dateJS from 'github:datejs/Datejs@master/build/date';

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

        for (let c = 1; c <= Schedule.getDaysInMonth(date); c++) {
            array.push(new Date(date.getFullYear(), date.getMonth(), c));
            day = array[array.length - 1].getDay();
            array[array.length - 1].active = (day !== 0 && day !== 6);
        }

        return array;
    }

    static getDate(date, shift = 0) {
        // return date.addDays(shift);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + shift);
    }

    static getWeek(date, shift = 0) {
        date = new Date(+date);
        date.setHours(0, 0, 0);
        date.setDate(date.getDate() - date.getDay() + 1 + 7 * shift);
        return date;
    }
    
    static getMonth(date, shift = 0) {
        return new Date(date.getFullYear(), date.getMonth() + shift, 1);
    }

    static dateFormat(date, format) {
        return moment(date).format(format);
    }

    static isThisDay(date, currentDate = new Date) {
        return (new Date(date.getFullYear(), date.getMonth(), date.getDate())).valueOf() -
               (new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())).valueOf();
    }

    static isThisWeek(date, currentDate = new Date) {
        let currentWeek = Schedule.getWeekNumber(currentDate),
            week = Schedule.getWeekNumber(date);

        if (currentWeek[0] === week[0]) {

            if (currentWeek[1] === week[1]) {
                return 0
            }

            if (currentWeek[1] < week[1]) {
                return 1;
            }

            if (currentWeek[1] > week[1]) {
                return -1;
            }

        }

        if (currentWeek[0] < week[0]) {
            return 1;
        }

        if (currentWeek[0] > week[0]) {
            return -1;
        }

        return null;
    }

    static isThisMonth(date, currentDate = new Date) {
        
        if (currentDate.getFullYear() === date.getFullYear()) {
            
            if (currentDate.getMonth() === date.getMonth()) {
                return 0;
            }
            
            if (currentDate.getMonth() < date.getMonth()) {
                return 1;
            }
            
            if (currentDate.getMonth() > date.getMonth()) {
                return -1;
            }
            
        }
        
        if (currentDate.getFullYear() < date.getFullYear()) {
            return 1;
        }

        if (currentDate.getFullYear() > date.getFullYear()) {
            return -1;
        }
    }

    static getWeekNumber(date) {
        // Copy date so don't modify original
        date = new Date(+date);
        date.setHours(0, 0, 0);

        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        date.setDate(date.getDate() + 4 - (date.getDay() || 7));

        // Get first day of year
        let yearStart = new Date(date.getFullYear(), 0, 1);

        // Calculate full weeks to nearest Thursday
        let weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1) / 7);

        // Return array of year and week number
        return [date.getFullYear(), weekNo];
    }

    static getDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }
    
}