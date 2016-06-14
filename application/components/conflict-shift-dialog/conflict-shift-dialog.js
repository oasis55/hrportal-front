import {customElement, bindable, bindingMode, BindingEngine, inject} from 'aurelia-framework';
import * as mdl from 'material-design-lite/material.min'
import {HttpClient}  from 'aurelia-fetch-client';
import HRDate        from '../../services/hr-date'
import $             from 'jquery'
import _             from 'lodash'

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
    $dialog;
    data;
    disabled         = true;

    constructor(bindingEngine) {
        this.http = new HttpClient();
        this.bindingEngine = bindingEngine;
    }

    trigger() {
        if(this.data) {
            let vm = this;

            function do_() {
                vm.$dialog.find('.conflict__group')
                    .each((i, e) => $(e).find('.mdl-radio__button').eq(0).prop('checked', true));
                _.forEach(vm.$dialog.find('.mdl-js-radio'), e => e.MaterialRadio = new MaterialRadio(e));
                _.forEach(vm.$dialog.find('.mdl-js-checkbox'), e => e.MaterialCheckbox = new MaterialCheckbox(e))
            }

            this.http
                .fetch('application/__for_testing_data/conflictsJSONArray.json')
                .then(response => response.json())
                .then(data => {
                    this.conflictsArray = data;

                    _.forEach(this.conflictsArray, ((conflict, index) => {
                        conflict.open = false;
                        conflict.startDate = new Date(conflict.startDate);
                        conflict.endDate = new Date(conflict.endDate);

                        this.http
                            .fetch('application/__for_testing_data/conflict-decisionJSONObject.json')
                            .then(response => response.json())
                            .then(data => {
                                conflict.decision = data;

                                if (index === this.conflictsArray.length - 1) {
                                    setTimeout(() => do_(), 10);
                                }

                            });

                    }).bind(this));

                    this.dialog.showModal()
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
        this.$dialog = $(this.dialog);
        this.subscription = 
            this.bindingEngine.expressionObserver(this, 'data').subscribe(::this.trigger);
    }

    detached() {
        this.subscription.dispose();
        this.subscription = null;
    }

}
