import moment from 'moment'
// import _ from 'lodash'

export default class Events {

    // event =
    // {
    //     id: 1,
    //     userId: 1,
    //     dateStart: new Date(),
    //     dateEnd: new Date()
    // };

    events = [];
    conflicts = [];

    constructor() {}

    getEvent(userId, date) {
        return this.events.find((element) => {
            return element.userId === userId && moment(element.dateStart).isSame(date, 'day');
        });
    }

    getConflict(placeId, date) {}
    
    loadData(dateStart, dateEnd) {
        this.events = Events.__for_testing_getEvents();
    }
    
    static __for_testing_getEvents() {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let date = new Date,
            event,
            events = [],
            dateStart,
            id = 0;

        while (events.length <= 100) {

            id++;
            dateStart = moment(date).add(getRandomInt(1, 80) - 40, 'day').minute(0).second(0).toDate();

            event = {
                id: id,
                userId: getRandomInt(1, 10),
                dateStart: moment(dateStart).hour(getRandomInt(1, 12)).toDate(),
                dateEnd: moment(dateStart).hour(getRandomInt(13, 23)).toDate()
            }

            if(!events.find((element) => {
                return
                    element.userId === event.userId &&
                    moment(element.dateStart).isSame(event.dateStart, 'day');
            })) {
                events.push(event);
            }

        }

        return events;
    }

    static __for_testing_getConflict() {}
}