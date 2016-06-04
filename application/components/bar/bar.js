import {customElement, bindable, bindingMode} from 'aurelia-framework';

@customElement('bar')
@bindable({ name: 'person', attribute: 'data', defaultBindingMode: bindingMode.twoWay})
export class Bar {



}