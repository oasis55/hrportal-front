import {customAttribute, inject, bindingMode, BindingEngine} from 'aurelia-framework';
import $ from 'jquery'

@customAttribute('bar-touch', bindingMode.oneWay)
@inject(Element, BindingEngine)
export class BarTouchCustomAttribute {

    instance;
    element;
    $element;

    bindingEngine;
    subscription;

    constructor(element, bindingEngine){
        this.instance = 0;
        this.bindingEngine = bindingEngine;
        this.element = element;
        this.$element = $(this.element);
        this.$element.hide();
    }

    hide(value) {
        if (value) {
            this.$element.show();
        } else {
            this.$element.hide();
        }
    }

    valueChanged(data) {
        if (!data || !data.context.inflated || data.context.period === 'day' || this.instance != 0) {
            return 0;
        }

        this.instance = 1;
        this.data = data;

        let cssClasses = '',
            context = this;

        this.element.count = 0;

        if (data.shift) {
            if (data.level1.time < 0) {
                cssClasses += 'bar--past schedule-color__past_' + data.employer.colorCode + ' ';
            } else {
                cssClasses += 'schedule-color__' + data.employer.colorCode + ' ';
            }

            this.subscription =
                this.bindingEngine.propertyObserver(this.data.shift, 'show').subscribe(this.hide.bind(this));

            this.$element.find('.mdi').hide();
            this.$element.on('click.1kT8z', () => {
                data.context.openWorkShiftDialog(
                    data.place,
                    data.employer,
                    data.level2.date,
                    data.shift);
            });
        } else {
            if (data.level1.time < 0) {
                return 0;
            } else {
                cssClasses += 'schedule-color__fade_' + data.employer.colorCode + ' ';
            }

            cssClasses += 'bar--add ';

            this.$element.on('click.1kT8z', () => {

                if (context.element.count === 0) {
                    data.context.$schedule.find('.bar').removeClass('bar--add-hover').each((i, e) => e.count = 0);
                    context.element.count++;
                    context.$element.addClass('bar--add-hover');
                } else {
                    context.element.count = 0;
                    context.$element.removeClass('bar--add-hover');

                    data.context.openWorkShiftDialog(
                        data.place,
                        data.employer,
                        data.level2.date);
                }

            });
        }

        if (data.context.period === 'month') {
            cssClasses += 'bar--wide ';
        }

        this.$element.addClass(cssClasses);

        if (data.shift && !data.shift.show) return 0;

        this.$element.css('display', 'flex');
    }

    attached() {}

    detached() {
        this.$element.off('click.1kT8z');
        if (this.subscription) {
            this.subscription.dispose();
            this.subscription = null;
        }
    }

}
