import {customElement, bindable, bindingMode, BindingEngine, inject} from 'aurelia-framework';
import * as mdl from 'material-design-lite/material.min'

@customElement('snack-bar')
@inject(BindingEngine)
@bindable({
    name: 'data',
    defaultBindingMode: bindingMode.twoWay
})
export class SnackBarCustomElement {

    timeout = 5000;

    snack;
    $snack;
    data;
    
    bindingEngine;
    subscription;
    
    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
    }

    trigger() {
        if(this.data) {
            let data = {
                message: this.data.message,
                timeout: this.timeout,
                actionHandler: this.data.callback,
                actionText: 'ОТМЕНИТЬ'
            };
            this.snack.MaterialSnackbar.showSnackbar(data);
        }
    }

    attached() {
        this.subscription =
            this.bindingEngine.expressionObserver(this, 'data').subscribe(::this.trigger);

        this.snack.MaterialSnackbar = new MaterialSnackbar(this.snack);
    }

    detached() {
        this.subscription.dispose();
        this.subscription = null;
    }
    
}