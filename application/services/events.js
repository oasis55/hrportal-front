import moment from 'moment'

export default class Events {

    // event =
    // {
    //     id: 1,
    //     userId: 1,
    //     startDate: new Date(),
    //     endDate: new Date()
    // }

    events = [];
    conflicts = [];

    constructor() {}

    getEvent(userId, date) {
        console.log('getEvent', userId, date);
        return this.events.find((element) => {
            return element.userId === userId && moment(element.startDate).isSame(date, 'day');
        });
    }

    getConflict(placeId, date) {}
    
    loadData(startDate, endDate) {
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
                startDate: moment(dateStart).hour(getRandomInt(7, 10)).toDate(),
                endDate: moment(dateStart).hour(getRandomInt(15, 20)).toDate()
            };

            events.push(event);
        }

        return events;
    }

    static __for_testing_getConflict() {}
}