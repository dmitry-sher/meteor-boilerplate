import * as util from './util';
import * as collections from '../../lib/collections';
import * as dict from './dict';

if (typeof window != 'undefined') {
    window.util = util;
    window.collections = collections;
    window.dict = dict;
}


export function ensureIE10() {
    if (Function('/*@cc_on return document.documentMode===10@*/')()) {
        $('body').addClass('ie10');
        util.compat.ie = true;
        util.compat.ie10 = true;
    }
}

export function ensureIE11() {
    if (!!window.MSInputMethodContext && !!document.documentMode) {
        $('body').addClass('ie11');
        util.compat.ie = true;
        util.compat.ie11 = true;
    }
}

export function ensureAndroid() {
    if (isAndroid()) {
        $('body').addClass('android');
        util.compat.android = true;
    }
}

export function ensureAndroid42() {
    let getAndroidVersion;
    getAndroidVersion = function(ua) {
        let match;
        ua = (ua || navigator.userAgent).toLowerCase();
        match = ua.match(/android\s([0-9\.]*)/);
        if (match) {
            return match[1];
        } else {
            return false;
        }
    };
    if (parseFloat(getAndroidVersion()) <= 4.3) {
        util.compat.android42 = true;
        $('body').addClass('android42');
    }
}

export function ensureIphone() {
    let match,
        ua;
    ua = (ua || navigator.userAgent).toLowerCase();
    match = ua.match(/iphone/) || ua.match(/ipad/);
    if (match) {
        util.compat.iphone = true;
        $('body').addClass('iphone');
    }
}

export function ensureChrome() {
    if (!!window.chrome && !!window.chrome.webstore) {
        util.compat.chrome = true;
        $('body').addClass('chrome');
    }
    if (window.navigator.userAgent.match(/windows/i)) {
        $('body').addClass('windows');
        util.compat.chromeWin = true;
    }
}

export function ensureFirefox() {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        util.compat.firefox = true;
        $('body').addClass('firefox');
        if (navigator.userAgent.toLowerCase().indexOf('windows') > -1) {
            util.compat.firefoxWin = true;
            $('body').addClass('firefox-win');
        }
    }
}

export function isAndroid() {
    if (!navigator) {
        return false;
    }
    if (!navigator.userAgent) {
        return false;
    }
    if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
        return true;
    }
    if (navigator.userAgent.toLowerCase().indexOf('mozilla/5.0 (x11') > -1) {
        return true;
    }
    if (navigator.userAgent.toLowerCase().indexOf('mozilla/5.0 (linux') > -1) {
        return true;
    }
    return false;
}

function ensureCordova() {
    if (Meteor.isCordova) {
        if (util.compat.iphone && window.StatusBar) {
            StatusBar.styleDefault()
            console.log('[setting black translucent]');
        }

        $('body').addClass('cordova');
        util.compat.cordova = true;

        if (window.ga && Meteor.settings && Meteor.settings.public && Meteor.settings.public.GAId) {
            window.ga.startTrackerWithId(Meteor.settings.public.GAId);
        } else {
            console.log('no GA or bad settings');
        }
    }
}

export function startup() {
    ensureIE10();
    ensureIE11();
    ensureAndroid();
    ensureAndroid42();
    ensureIphone();
    ensureChrome();
    ensureFirefox();
    util.ensureGeoStartup();

    ensureCordova();
}