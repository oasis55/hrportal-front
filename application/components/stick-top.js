import $ from 'jquery'

export class StickTopCustomAttribute {
    static inject = [Element];

    constructor(element){
        this.$element = $(element);
    }

    attached() {
        $(window).bind('scroll', $.proxy(this.scroll, this));
        this.top = this.$element.offset().top;
        this.position = this.$element.css('position');
    }

    detached() {
        $(window).unbind('scroll', this.scroll);
    }

    scroll() {
        if ($(document).scrollTop() > this.top) {
            this.$element.css('position', 'fixed');
        } else {
            this.$element.css('position', this.position);
        }
    }
    
}