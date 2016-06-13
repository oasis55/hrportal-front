import {customElement, bindable, bindingMode, BindingEngine, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import HRDate       from '../../services/hr-date'
import _            from 'lodash'

@customElement('conflict-shift-dialog')
@inject(BindingEngine)
@bindable({
    name: 'data',
    defaultBindingMode: bindingMode.twoWay
})
export class ConflictShiftDialogCustomElement {

    conflictsArray    = [];
    dateFormat       = HRDate.dateFormat;
    dialog;
    data;
    disabled         = true;

    constructor(bindingEngine) {
        this.http = new HttpClient();
        this.bindingEngine = bindingEngine;
    }

    trigger() {
        if(this.data) {
            let vm = this;

            this.http
                .fetch('application/__for_testing_data/conflictsJSONArray.json')
                .then(response => response.json())
                .then(data => {
                    this.conflictsArray = data;

                    _.forEach(this.conflictsArray, function (conflict) {
                        conflict.startDate = new Date(conflict.startDate);
                        conflict.endDate = new Date(conflict.endDate);
                        conflict.open = false;

                        vm.http
                            .fetch('application/__for_testing_data/conflict-decisionJSONObject.json')
                            .then(response => response.json())
                            .then(data => conflict.decision = data);
                    });

                    setTimeout(() => vm.dialog.showModal(), 1);
                });
        } else {
            this.dialog.close();
        }
    }

    close() {
        this.data = null;
    }

    save() {
        this.data = null;
    }

    attached() {
        this.subscription = 
            this.bindingEngine.expressionObserver(this, 'data').subscribe(::this.trigger);
    }

    detached() {
        this.subscription.dispose();
        this.subscription = null;
    }

}
