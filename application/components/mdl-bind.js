import {customAttribute, inject, bindingMode} from 'aurelia-framework';
import $ from 'jquery'

@customAttribute('mdl-bind', bindingMode.twoWay)
@inject(Element)
export class MdlBindCustomAttribute {

    element;
    $element;
    $input;

    hold     = false;
    value;
    type;

    constructor(element){
        this.element = element;
        this.$element = $(element);
    }

    attached() {
        this.$input = this.$element.find('input');
        this.type = this.$input.attr('type');

        this.$element.find('input').on('change', (e => {
            if(!this.hold) {
                this.hold = true;

                console.log(this.type, this.$input.attr('id'));
                switch (this.type) {
                    case 'checkbox':
                        this.value = !this.value;
                        break;

                    case 'radio':
                        this.value = this.$input.attr('id');
                        break;

                    default:
                        break;
                }

                return false;
            }
            this.hold = false;
        }).bind(this));
    }

    valueChanged() {
        if(!this.hold) {
            this.hold = true;
            this.$element.trigger('click');

            switch (this.type) {

                case 'radio':
                    if (this.value !== this.$input.attr('id'))
                        this.$element.trigger('click');
                    break;

                default:
                    this.$element.trigger('click');
                    break;
            }

            return false;
        }
        this.hold = false;
    }

    detached() {}
    
}