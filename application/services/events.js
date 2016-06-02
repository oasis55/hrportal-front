export default class Event {

    events = [
        {
            id: 1,
            userId: 1,
            start: new Date(),
            end: new Date()
        }
    ];

    getEvent(userId, date) {
        
        if (userId === 1) return this.events[0];
        
        return null;

    }

}