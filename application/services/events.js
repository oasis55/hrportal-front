import moment from 'moment'
import _      from 'lodash'

export default class Events {

    // shift =
    // {
    //     id: 1,
    //     employerId: 1,
    //     startDate: new Date(),
    //     endDate: new Date(),
    //     show: true
    // }
    //
    // conflict =
    // {
    //     id: 1,
    //     placeId: 1,
    //     startDate: new Date(),
    //     endDate: new Date()
    // }

    shiftsArray = [];
    conflictsArray = [];

    constructor() {}

    getShift(employerId, date) {
        return this.shiftsArray.find((element) => {
            return element.employerId === employerId && moment(element.startDate).isSame(date, 'day');
        });
    }
    
    addShift(employerId, startDate, endDate) {
        let index = _.findLastIndex(this.shiftsArray, e => {return e.id_ >= 0}),
            id_   = index > 0 ? this.shiftsArray[index].id_ + 1 : 0;

        this.shiftsArray.push({
            id:         null,
            id_:        id_,
            employerId: employerId,
            startDate:  startDate,
            endDate:    endDate,
            show:       true
        });

        return id_;
    }
    
    sendShift(shiftId_) {
        let shift = this.shiftsArray.find(e => {return e.id_ === shiftId_});

        if (shift) {
            shift.id = Events.__for_testing_getId(this.shiftsArray);
            delete shift.id_;
        }
    }
    
    changeShift(shiftId, startDate, endDate) {
        Events.__for_testing_changeShift(shiftId, startDate, endDate, this.shiftsArray)
    }

    deleteShift(shiftId, shiftId_) {
        if (shiftId) {
            this.shiftsArray = Events.__for_testing_deleteShift(shiftId, this.shiftsArray);
        } else {
            let index = this.shiftsArray.findIndex(e => {return e.id_ === shiftId_});

            if (index > 0) {
                this.shiftsArray.splice(index, 1);
            }
        }
    }

    displayShift(shiftId, show) {
        let shift = this.shiftsArray.find((element) => {
            return element.id === shiftId;
        });

        if (shift) {
           shift.show = show;
        }
    }

    getConflict(placeId, date) {
        return this.conflictsArray.find((element) => {
            return element.placeId === placeId && moment(element.startDate).isSame(date, 'day');
        });
    }
    
    loadData(startDate, endDate) {
        this.shiftsArray = Events.__for_testing_getShifts();
        this.conflictsArray = Events.__for_testing_getConflicts();
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
                employerId: getRandomInt(1, 10),
                startDate: moment(dateStart).hour(getRandomInt(7, 10)).toDate(),
                endDate: moment(dateStart).hour(getRandomInt(15, 20)).toDate(),
                show: true
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

    static __for_testing_deleteShift(shiftId, shiftsArray) {
        _.remove(shiftsArray, e => {return e.id === shiftId});
        
        return shiftsArray;
    }
    
    static __for_testing_getId() {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        return getRandomInt(1, 10000000);
    }
    
    static __for_testing_changeShift(shiftId, startDate, endDate, shiftsArray) {
        let shift = shiftsArray.find(e => {return e.id === shiftId});
        
        if (shift) {
            shift.startDate = startDate;
            shift.endDate = endDate;
        }
    }
}
