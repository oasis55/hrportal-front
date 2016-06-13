import {customElement, bindable, bindingMode, BindingEngine, inject} from 'aurelia-framework';
import HRDate       from '../../services/hr-date'

@customElement('work-shift-dialog')
@inject(BindingEngine)
@bindable({
    name: 'data',
    defaultBindingMode: bindingMode.twoWay
})
export class WorkShiftDialogCustomElement {

    cellWidth        = 36;
    dateArray        = [];
    dateFormat       = HRDate.dateFormat;
    dialog;
    data;
    barData          = {
        startDate: null,
        endDate: null
    };
    disabled         = true;

    setDisable(newValue, oldValue) {
        if (!newValue || !oldValue) {
            this.disabled = true;
            return 0;
        }
        this.disabled = false;
    }

    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
        this.subscription = this.bindingEngine.propertyObserver(this.barData, 'startDate').subscribe(::this.setDisable);
        this.subscription = this.bindingEngine.propertyObserver(this.barData, 'endDate').subscribe(::this.setDisable);
    }

    trigger() {
        if(this.data) {
            this.dateArray = HRDate.getDayHoursArray(this.data.date);
            
            if (this.data.shift) {
                this.barData.startDate = this.data.shift.startDate;
                this.barData.endDate = this.data.shift.endDate;
            } else {
                this.barData.startDate = this.dateArray[3].date;
                this.barData.endDate = this.dateArray[this.dateArray.length - 1 - 3].date;
            }

            this.dialog.showModal();
        } else {
            this.barData.startDate = this.barData.endDate = null;
            this.dialog.close();
        }
    }

    close() {
        this.data = null;
    }

    save() {
        this.data = null;
    }

    delete() {
        this.data = null;
    }

    attached() {
        this.subscription = this.bindingEngine.expressionObserver(this, 'data').subscribe(::this.trigger);
    }

    detached() {
        this.subscription.dispose();
        this.subscription = null;
    }

}
