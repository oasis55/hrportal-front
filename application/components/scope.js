import $ from 'jquery'

export class ScopeCustomAttribute {
    static inject = [Element];
    
    aaa = 111;

    constructor(element){
        this.$element = $(element);
        console.log(this)
    }

    attached() {
    }

    detached() {
    }

}