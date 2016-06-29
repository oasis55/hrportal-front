import {customElement, bindable, bindingMode, BindingEngine, inject} from 'aurelia-framework'
import {HttpClient}      from 'aurelia-fetch-client'
import HRDate            from '../../services/hr-date'
import $                 from 'jquery'
import _                 from 'lodash'

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
    conflictsArray = [];
    decisionsArray = [{
        conflictId: null,
        employerId: null
    }];
    dateFormat     = HRDate.dateFormat;

    bindingEngine;
    subscription;
    
    constructor(bindingEngine) {
        this.http            = new HttpClient();
        this.bindingEngine   = bindingEngine;
        this.decisionsArray  = [];
    }

    trigger() {
        if (this.data) {
            let vm = this;

            this.http
                .fetch('application/__for_testing_data/conflictsJSONArray.json')
                .then(response => response.json())
                .then(data => {
                    this.conflictsArray = data;

                    _.forEach(this.conflictsArray, ((conflict, index) => {
                        conflict.open         = false;
                        conflict.startDate    = new Date(conflict.startDate);
                        conflict.endDate      = new Date(conflict.endDate);
                        conflict.element      = {}; // DOM link
                        conflict.inputElement = {}; // DOM link
                        conflict.choosen      = false;

                        this.http
                            .fetch('application/__for_testing_data/conflict-decisionJSONObject.json')
                            .then(response => response.json())
                            .then(data => {
                                conflict.decision = data;

                                _(conflict.decision['employers']).forEach(e => {
                                    e.element      = {}; // DOM link
                                    e.inputElement = {}; // DOM link
                                });

                                if (index === this.conflictsArray.length - 1) {
                                    setTimeout(() => vm.dialog.showModal(), 10);
                                }
                            });

                    }).bind(this));
                });

        } else {
            this.conflictsArray = [];
            this.disabledSave = true;
            this.dialog.close();
        }
    }

    close() {
        this.data = null;
    }

    save() {
        this.data = null;
    }

    ignore() {
        this.data = null;
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

    checkDisabled() {

        if (this.conflictsArray.some(e => {
                return e.inputElement.checked
            })) {
            this.disabledSave = false;
        } else {
            this.disabledSave = true;
        }

    }


    checkGroup($event, conflict) {

        if ($event.target.checked) {
            if(!conflict.choosen) {
                $(conflict.decision.employers[0].element).trigger('click');
            }
        } else {
            conflict.choosen = false;
        }

        this.checkDisabled();
    }

    chooseDecision($event, conflict) {

        if ($event.target !== conflict.decision.employers[0].inputElement) {
            conflict.choosen = true;
        }

        this.checkDisabled();
    }

}
