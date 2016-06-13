import moment from 'moment'

export default class Events {

    // shift =
    // {
    //     id: 1,
    //     userId: 1,
    //     startDate: new Date(),
    //     endDate: new Date()
    // }
    //
    // conflict =
    // {
    //     id: 1,
    //     placeId: 1,
    //     startDate: new Date(),
    //     endDate: new Date()
    // }


    shifts = [];
    conflicts = [];

    constructor() {}

    getShift(userId, date) {
        return this.shifts.find((element) => {
            return element.userId === userId && moment(element.startDate).isSame(date, 'day');
        });
    }

    getConflict(placeId, date) {
        return this.conflicts.find((element) => {
            return element.placeId === placeId && moment(element.startDate).isSame(date, 'day');
        });
    }
    
    loadData(startDate, endDate) {
        this.shifts = Events.__for_testing_getShifts();
        this.conflicts = Events.__for_testing_getConflicts();
    }
    
    static __for_testing_getShifts() {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let date = new Date,
            event,
            shifts = [],
            dateStart,
            id = 0;

        while (shifts.length <= 100) {

            id++;
            dateStart = moment(date).add(getRandomInt(1, 80) - 40, 'day').minute(0).second(0).toDate();

            event = {
                id: id,
                userId: getRandomInt(1, 10),
                startDate: moment(dateStart).hour(getRandomInt(7, 10)).toDate(),
                endDate: moment(dateStart).hour(getRandomInt(15, 20)).toDate()
            };

            shifts.push(event);
        }

        return shifts;
    }

    static __for_testing_getConflicts() {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let date = new Date,
            event,
            conflicts = [],
            dateStart,
            id = 0;

        while (conflicts.length <= 15) {

            id++;
            dateStart = moment(date).add(getRandomInt(1, 40) - 20, 'day').minute(0).second(0).toDate();

            event = {
                id: id,
                placeId: getRandomInt(1, 2),
                startDate: moment(dateStart).hour(getRandomInt(7, 11)).toDate(),
                endDate: moment(dateStart).hour(getRandomInt(13, 20)).toDate()
            };

            conflicts.push(event);
        }

        return conflicts;
    }
}