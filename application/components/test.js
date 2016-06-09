
export class TestCustomAttribute {
    static inject = [Element];

    constructor(element){
        this.aaa = 555;
    }

    attached() {
    }

    detached() {
    }

    scroll() {
    }

}