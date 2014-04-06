/*
    Copyright 2013-2014 appPlant UG

    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/
cordova.define("cordova/plugin/localNotification", function(require, exports, module) {
 
var LocalNotification = function () {
    this._defaults = {
        message:    '',
        title:      '',
        autoCancel: false,
        badge:      0,
        id:         '0',
        json:       '',
        repeat:     ''
    };
};

	LocalNotification.prototype.getDefaults = function () {
        return this._defaults;
    };

    LocalNotification.prototype.setDefaults= function (newDefaults) {
        var defaults = this.getDefaults();

        for (var key in defaults) {
            if (newDefaults[key] !== undefined) {
                defaults[key] = newDefaults[key];
            }
        }
    };

    LocalNotification.prototype.mergeWithDefaults= function (options) {
        var defaults = this.getDefaults();

        for (var key in defaults) {
            if (options[key] === undefined) {
                options[key] = defaults[key];
            }
        }

        return options;
    };

    
    LocalNotification.prototype.applyPlatformSpecificOptions= function () {
        var defaults = this._defaults;

        switch (device.platform) {
        case 'Android':
            defaults.icon       = 'icon';
            defaults.smallIcon  = null;
            defaults.ongoing    = false;
            defaults.sound      = 'TYPE_NOTIFICATION'; break;
        case 'iOS':
            defaults.sound      = ''; break;
        case 'WinCE': case 'Win32NT':
            defaults.smallImage = null;
            defaults.image      = null;
            defaults.wideImage  = null;
        };
    };

    
    LocalNotification.prototype.add= function (options) {
        var options    = this.mergeWithDefaults(options),
            callbackFn = null;

        if (options.id) {
            options.id = options.id.toString();
        }

        if (options.date === undefined) {
            options.date = new Date();
        }

        if (typeof options.date == 'object') {
            options.date = Math.round(options.date.getTime()/1000);
        }

        if (['WinCE', 'Win32NT'].indexOf(device.platform)) {
            callbackFn = function (cmd) {
                eval(cmd);
            };
        }

        cordova.exec(callbackFn, null, 'LocalNotification', 'add', [options]);

        return options.id;
    };

    
    LocalNotification.prototype.cancel= function (id) {
        cordova.exec(null, null, 'LocalNotification', 'cancel', [id.toString()]);
    };

    /**
     * Removes all previously registered notifications
     */
    LocalNotification.prototype.cancelAll= function () {
        cordova.exec(null, null, 'LocalNotification', 'cancelAll', []);
    };

    LocalNotification.prototype.getScheduledIds=function (callback) {
        cordova.exec(callback, null, 'LocalNotification', 'getScheduledIds', []);
    };

    LocalNotification.prototype.isScheduled= function (id, callback) {
        cordova.exec(callback, null, 'LocalNotification', 'isScheduled', [id.toString()]);
    };

    LocalNotification.prototype.onadd= function (id, state, json) {};

    LocalNotification.prototype.ontrigger= function (id, state, json) {};

    LocalNotification.prototype.onclick= function (id, state, json) {};

    LocalNotification.prototype.oncancel= function (id, state, json) {};
		
module.exports = new LocalNotification();
});
