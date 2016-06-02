import _ from 'lodash'

export default class Color {

    static getColorIndex(text) {

        let sum = 0, n = 0;

        _.forEach(text, function(value) {
            (n < 8) && (sum += value.charCodeAt());
            n++;
        });

        return sum % 100 + 1;
    }

}