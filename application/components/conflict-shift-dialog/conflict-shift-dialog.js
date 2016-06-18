import {customElement, bindable, bindingMode, BindingEngine, inject} from 'aurelia-framework'
// import * as mdl        from 'material-design-lite/material.min'
import {HttpClient}    from 'aurelia-fetch-client'
import HRDate          from '../../services/hr-date'
import $               from 'jquery'
import _               from 'lodash'

@customElement('conflict-shift-dialog')
@inject(BindingEngine)
@bindable({
    name: 'data',
    defaultBindingMode: bindingMode.twoWay
})
export class ConflictShiftDialogCustomElement {

    dialog;
    $dialog;
    data;

    disabledSave   = true;
    disabledClear  = true;
    conflictsArray = [];
    decisionsArray = [{
        conflictId: null,
        employerId: null
    }];
    dateFormat     = HRDate.dateFormat;

    bindingEngine;
    subscription;

    constructor(bindingEngine) {
        this.http = new HttpClient();
        this.bindingEngine = bindingEngine;
        this.conflictsArray = [];
    }

    trigger() {
        if (this.data) {
            let vm = this;

            function do_() {
                vm.$dialog.find('.conflict__group')
                    .each((i, e) => $(e).find('.mdl-radio__button').eq(0).prop('checked', true));

                // vm.$dialog.find('.mdl-js-radio').each((i, e) => e.MaterialRadio = new MaterialRadio(e));
                // vm.$dialog.find('.mdl-js-checkbox').each((i, e) => e.MaterialCheckbox = new MaterialCheckbox(e));
                // vm.$dialog.find('.mdl-js-checkbox .mdl-js-ripple-effect, .mdl-js-radio .mdl-js-ripple-effect')
                //     .each((i, e) => new MaterialRipple(e));

                vm.dialog.showModal()
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
                });

        } else {
            this.conflictsArray = [];
            this.dialog.close();
        }
    }

    close() {
        this.data = null;
    }

    save() {
        this.data = null;
    }

    clear() {
        this.decisionsArray = [];
        this.checkDisabled();
    }

    attached() {
        this.subscription =
            this.bindingEngine.expressionObserver(this, 'data').subscribe(this.trigger.bind(this));

        this.$dialog = $(this.dialog);
    }

    detached() {
        this.subscription.dispose();
        this.subscription = null;
    }

    decisionTrigger(conflictId, employerId) {

        if (employerId) {

        } else {
            if (this.decisionsArray.length === 0) {

                this.decisionsArray.push({
                    conflictId: conflictId,
                    employerId: this.conflictsArray
                                    .find(e => {return e.id === conflictId})
                                    .decision
                                    .employers
                                    .find(e => {return e.priority === 0})
                                    .id
                });

            } else {

            }
        }

        console.log(this.decisionsArray);

        this.checkDisabled();
    }

    checkDisabled() {
        if (this.decisionsArray.length > 0) {
            this.disabledClear = false;
            this.disabledSave = false;
        } else {
            this.disabledClear = true;
            this.disabledSave = true;
        }
    }

}
