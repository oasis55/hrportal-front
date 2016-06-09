import $ from 'jquery'

export class StickTopCustomAttribute {
    static inject = [Element];

    constructor(element){
        this.$element = $(element);
    }

    attached() {
        $(document).on('scroll.stick', ::this.scroll);
        this.top = this.$element.offset().top;
        this.position = this.$element.css('position');
    }

    detached() {
        $(document).off('scroll.stick');
    }

    scroll() {
        if ($(document).scrollTop() > this.top) {
            this.$element.css('position', 'fixed');
        } else {
            this.$element.css('position', this.position);
        }
    }
    
}