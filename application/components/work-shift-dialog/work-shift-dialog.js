import {customElement, bindable, bindingMode, BindingEngine, inject} from 'aurelia-framework';
import HRDate from '../../services/hr-date'

@customElement('work-shift-dialog')
@inject(BindingEngine)
@bindable({
    name: 'data',
    defaultBindingMode: bindingMode.twoWay
})
export class WorkShiftDialogCustomElement {

    dialog;
    data            = {
        context:  null,
        place:    null,
        employer: null,
        date:     null,
        shift:    null
    };
    disabled        = true;
    timeoutInterval = 5000;
    countDelete     = 0;
    countSave       = 0;
    cellWidth       = 36;
    dateArray       = [];
    dateFormat      = HRDate.dateFormat;
    barData         = {
        startDate: null,
        endDate:   null
    };

    bindingEngine;
    subscription;
    

    setDisable(newValue, oldValue) {
        if (!newValue || !oldValue) {
            this.disabled = true;
            return 0;
        }
        this.disabled = false;
        return 0;
    }

    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
        this.subscription = this.bindingEngine.propertyObserver(this.barData, 'startDate').subscribe(this.setDisable.bind(this));
        this.subscription = this.bindingEngine.propertyObserver(this.barData, 'endDate').subscribe(this.setDisable.bind(this));
    }

    trigger() {
        if (this.data) {
            this.dateArray = HRDate.getDayHoursArray(this.data.date);

            if (this.data.shift) {
                this.barData.startDate = new Date(this.data.shift.startDate);
                this.barData.endDate   = new Date(this.data.shift.endDate);
            } else {
                this.barData.startDate = this.dateArray[3].date;
                this.barData.endDate   = this.dateArray[this.dateArray.length - 1 - 3].date;
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
        ((employerId, shiftId, startDate, endDate, isAdd, context, contextContext) => {

            let once = true,
                timeoutId,
                timeoutInterval,
                snackBarData,
                oldStartDate,
                oldEndDate,
                shiftId_;

            if (context.data.shift) {
                oldStartDate = new Date(context.data.shift.startDate);
                oldEndDate   = new Date(context.data.shift.endDate);
            }

            context.countSave++;
            context.data = null;

            function actionHandler() {
                if (once) {
                    console.log('actionHandler', timeoutId);
                    once = false;
                    context.countSave--;
                    clearTimeout(timeoutId);

                    if (isAdd) {
                        contextContext.eventsService.deleteShift(undefined, shiftId_);
                        contextContext.setPeriod(contextContext.period);
                    } else {
                        contextContext.eventsService.changeShift(shiftId, oldStartDate, oldEndDate);
                    }
                }
            }

            snackBarData = {};

            if (isAdd) {
                shiftId_ = contextContext.eventsService.addShift(employerId, startDate, endDate);
                contextContext.setPeriod(contextContext.period);
                snackBarData.message = 'Смена добавлена';
            } else {
                contextContext.eventsService.changeShift(shiftId, startDate, endDate);
                snackBarData.message = 'Смена изменена'
            }

            if (context.countSave === 1) {
                snackBarData.actionHandler = actionHandler;
                snackBarData.actionText = 'ОТМЕНИТЬ';
                snackBarData.timeout = timeoutInterval = context.timeoutInterval;
            } else {
                snackBarData.timeout = timeoutInterval = 1000;
            }

            contextContext.snackBarData = snackBarData;

            timeoutId = setTimeout(() => {
                console.log('setTimeout', timeoutId);
                once = false;
                context.countSave--;
                if (isAdd) {
                    contextContext.eventsService.sendShift(shiftId_);
                }
            }, timeoutInterval);
            console.log('save', timeoutId);

        })(this.data.employer.id,
           this.data.shift && this.data.shift.id,
           new Date(this.barData.startDate),
           new Date(this.barData.endDate),
           !this.data.shift,
           this,
           this.data.context);
    }

    delete() {
        ((shiftId, context, contextContext) => {

            let once = true,
                timeoutId,
                timeoutInterval,
                snackBarData;

            context.countDelete++;
            context.data = null;
            contextContext.eventsService.displayShift(shiftId, false);

            function actionHandler() {
                if (once) {
                    once = false;
                    clearTimeout(timeoutId);
                    context.countDelete--;
                    contextContext.eventsService.displayShift(shiftId, true);
                }
            }

            snackBarData = {
                message: 'Смена удалена'
            };

            if (context.countDelete === 1) {
                snackBarData.actionHandler = actionHandler;
                snackBarData.actionText = 'ОТМЕНИТЬ';
                snackBarData.timeout = timeoutInterval = context.timeoutInterval;
            } else {
                snackBarData.timeout = timeoutInterval = 1000;
            }

            contextContext.snackBarData = snackBarData;

            timeoutId = setTimeout(() => {
                once = false;
                context.countDelete--;
                contextContext.eventsService.deleteShift(shiftId);
                contextContext.setPeriod(contextContext.period);
            }, timeoutInterval);

        })(this.data.shift.id, this, this.data.context);
    }

    attached() {
        this.subscription = 
            this.bindingEngine.expressionObserver(this, 'data').subscribe(this.trigger.bind(this));
    }

    detached() {
        this.subscription.dispose();
        this.subscription = null;
    }

}
