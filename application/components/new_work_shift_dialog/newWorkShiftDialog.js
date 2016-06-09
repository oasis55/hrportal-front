import {customElement, bindable, bindingMode, BindingEngine, inject} from 'aurelia-framework';

@customElement('new-work-shift-dialog')
@inject(BindingEngine)
@bindable({
    name: 'data',
    defaultBindingMode: bindingMode.twoWay
})
export class newWorkShiftDialog {

    dialog;

    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
    }

    trigger() {
        if(this.data) {
            this.dialog.showModal();
        } else {
            this.dialog.close();
        }
    }

    close() {
        this.data = null;
    }

    save() {}

    attached() {
        let observer = this.bindingEngine.expressionObserver(this, 'data');
        this.subscription = observer.subscribe(::this.trigger);
    }

    detached() {
        this.subscription.dispose();
        this.subscription = null;
    }

}
