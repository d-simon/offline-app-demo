/* global Storage */
(function () {
    'use strict';

    if (Modernizr.localstorage) {
        // http://stackoverflow.com/a/2010948
        Storage.prototype.setObject = function (key, value) {
            this.setItem(key, JSON.stringify(value));
        };

        Storage.prototype.getObject = function (key) {
            var value = this.getItem(key);
            return value && JSON.parse(value);
        };
    }

}());
