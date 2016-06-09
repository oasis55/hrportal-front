import {customElement, bindable, bindingMode} from 'aurelia-framework';
import $ from 'jquery'

let instance = null;
class BarEvents {

    currentTarget;
    targetType = 'bar';
    rowOffset = {
        left: 0,
        top: 0
    };
    rowWidth = null;
    rowHeight = null;
    startCoordinates = {
        left: 0,
        top: 0
    };

    constructor() {
        if(!instance){
            console.log('once: constructor');

            instance = this;
            instance.count = 0
            instance.addEvents();
        }

        instance.count++;
        return instance;
    }

    onStart(event) {
        if (event.currentTarget.__object.data.scalable &&
            event.currentTarget.__object.data.time >= 0) {
            console.log('onStart');
            this.currentTarget = event.currentTarget;

            let $target = $(event.target),
                $currentTarget = $(this.currentTarget),
                currentTargetOffset = $currentTarget.offset();

            if ($target.hasClass('bar__drag--left')) this.targetType = 'left';
            if ($target.hasClass('bar__drag--right')) this.targetType = 'right';

            this.rowOffset = this.currentTarget.__object.$row.offset();
            this.rowWidth = this.currentTarget.__object.$row.width();
            this.rowHeight = this.currentTarget.__object.$row.height();

            let co = this.getCoordinates(event);

            this.startCoordinates = {
                top: co.y - currentTargetOffset.top,
                left: co.x - currentTargetOffset.left,
                right: $currentTarget.width() - (co.x - currentTargetOffset.left),
            }
        };
    }

    onMove(event) {
        if (this.currentTarget) {
            console.log('onMove');
            event.preventDefault();

            let co = this.getCoordinates(event),
                minBarWidth = this.currentTarget.__object.data.cellWidth * 4 - this.currentTarget.__object.minLeft *2;

            function getLeft() {
                let left = co.x - this.rowOffset.left - this.startCoordinates.left;
                left = left < this.currentTarget.__object.minLeft ? this.currentTarget.__object.minLeft : left;
                left = this.rowWidth - this.currentTarget.__object.right - left < minBarWidth ?
                       this.rowWidth - this.currentTarget.__object.right - minBarWidth : left;

                return left;
            }

            function getRight() {
                let right = this.rowWidth - (co.x - this.rowOffset.left + this.startCoordinates.right);
                right = right < this.currentTarget.__object.minRight ? this.currentTarget.__object.minRight : right;
                right = this.rowWidth - this.currentTarget.__object.left - right < minBarWidth ?
                        this.rowWidth - this.currentTarget.__object.left - minBarWidth : right;

                return right;
            }

            switch (this.targetType) {
                case 'left':
                    this.currentTarget.__object.left = getLeft.call(this);
                    break;

                case 'right':
                    this.currentTarget.__object.right = getRight.call(this);
                    break;

                default:
                    let left = getLeft.call(this);
                    let right = getRight.call(this);

                    if ((this.currentTarget.__object.left === this.currentTarget.__object.minLeft &&
                         this.currentTarget.__object.right < right) ||
                        (this.currentTarget.__object.right === this.currentTarget.__object.minRight &&
                         this.currentTarget.__object.left < left)) {
                        break;
                    }

                    this.currentTarget.__object.left = left;
                    this.currentTarget.__object.right = right;
                    break;
            }

        }
    }

    onEnd(event) {
        if (this.currentTarget) {
            console.log('onEnd');

            this.currentTarget.__object.left -=
                this.currentTarget.__object.left % this.currentTarget.__object.data.cellWidth - 4;
            this.currentTarget.__object.right -=
                this.currentTarget.__object.right % this.currentTarget.__object.data.cellWidth - 4;

            this.currentTarget = null;
            this.targetType = 'bar';
        }
    }

    getCoordinates(event) {
        let coordinates = {
            x: 0,
            y: 0
        };

        if (event.originalEvent.type.indexOf('mouse') >= 0) {
            coordinates.x = event.originalEvent.pageX;
            coordinates.y = event.originalEvent.pageY;
        }
        if (event.originalEvent.type.indexOf('touch') >= 0) {
            coordinates.x = event.originalEvent.touches[0].pageX;
            coordinates.y = event.originalEvent.touches[0].pageY;
        }

        return coordinates;
    }

    addEvents() {
        $(document).delegate('.bar', 'mousedown.barevents touchstart.barevents', ::this.onStart);
        $(document).delegate('',     'mousemove.barevents touchmove.barevents',  ::this.onMove);
        $(document).delegate('',     'mouseup.barevents touchend.barevents',     ::this.onEnd);
        $(document).delegate('.bar', 'dragstart.barevents', () => {return false});
    }

    destructor() {
        instance.count--;
        if (instance.count === 0) {
            console.log('once: destructor');
            $(document).undelegate('.bar', 'mousedown.barevents touchstart.barevents');
            $(document).undelegate('',     'mousemove.barevents touchmove.barevents');
            $(document).undelegate('',     'mouseup.barevents touchend.barevents');
            $(document).undelegate('.bar', 'dragstart.barevents');
            instance = null;
        }
    }

}

@customElement('bar')
@bindable({
    name: 'data',
    defaultBindingMode: bindingMode.oneWay
})
export class Bar {

    data = {
        scalable: false,
        disable: false,
        time: 0,
        startDate: 0,
        endDate: 0,
        period: '',
        cells: 0,
        cellWidth: 0,
        colorCode: 0,
        data: {}
    };
    bar;
    $row;
    show     = false;
    left     = 12;
    right    = 12;
    minLeft  = 4;
    minRight = 4;

    attached() {
        if (this.data.disable) return 0;
        console.log('attached');

        this.barEvents = new BarEvents();
        this.bar.__object = this;

        if (this.data.data) {

            this.show = true;

            if (this.data.scalable) {
                this.$row = $(this.bar).parent().parent();
                this.left =
                    (this.data.data.startDate.getHours() - this.data.startDate.getHours()) * this.data.cellWidth + 4;
                this.right =
                    (this.data.endDate.getHours() - this.data.data.endDate.getHours()) * this.data.cellWidth + 4;
            }
        }

    }

    detached() {
        console.log('detached');
        if (this.barEvents) {
            this.barEvents.destructor();
        }
    }

}
