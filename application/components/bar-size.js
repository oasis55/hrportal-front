import $ from 'jquery'

export class BarSizeCustomAttribute {
    static inject = [Element];

    value;

    constructor(element){
        this.$element = $(element);
    }

    bind() {
        if (this.value.data) {
            this.$element.css({
                left: (this.value.data.startDate.getHours() - this.value.startDate.getHours()) * this.value.cellWidth + 4,
                right: (this.value.endDate.getHours() - this.value.data.endDate.getHours()) * this.value.cellWidth + 4
            });
        } else {
            this.$element.hide();
        }
    }

}