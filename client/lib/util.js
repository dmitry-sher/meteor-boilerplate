import React, { Component } from 'react';
import * as dict from './dict';

export const compat = {
    remMode: false,
    remModes: {
        Width: 1,
        Height: 2,
        1: 'width',
        2: 'height',
    },
};

export const ViewRequestTypes = {
    All: 0,
    New: 1,
    Seen: 2,
    Answered: 3,
    0: 'Все заявки',
    1: 'Новые',
    2: 'Неотвеченные',
    3: 'Отвеченные'
}


export const params = {
    uploadTimeout: 120000,
    defaultImageSize: 1024,
};

export const defaultMapProps = {
    center: { lat: 55.7558, lng: 37.6173 },
    centerFull: { latitude: 55.7558, longitude: 37.6173 },
    scrollwheel: false,
    panControl: false,
    draggable: false,
    mapTypeControl: false,
    zoom: 16,
};

export function uploadImageSize() {
    let ret = getMeteorSetting('imageSize');
    if (ret)
        return ret;
    // if (Meteor.settings && Meteor.settings.public && Meteor.settings.public.imageSize)
    // 	return Meteor.settings.public.imageSize;
    return 1024;
}

export function getScrollTop() {
    if (Meteor.isServer || typeof window == 'undefined')
        return 0;
    let contentScroll = 0; //$('.content').scrollTop();
    return Math.max(document.documentElement.scrollTop || 0, window.scrollY || 0, window.pageYOffset || 0, contentScroll);
}

export function getUserMeteorData() {
    let user,
        loggingIn;
    user = Meteor.user();
    loggingIn = Meteor.loggingIn();
    // console.log('[util.getUserMeteorData] user = ', user, ', loggingIn = ', loggingIn);
    return { user, loggingIn };
}

export function getImageLink(id, store = 'thumbs') {
    let lnk = `cfs/files/images/${  id  }?store=${  store}`;
    if (Meteor.isCordova) {
        if (getMeteorSetting('localDevelopment'))
            return `http://localhost:3000/${lnk}`;
        return Meteor.absoluteUrl(lnk);
    }
    return `/${lnk}`;
}

export function getMeteorSetting(name) {
    if (Meteor.settings && Meteor.settings.public && Meteor.settings.public[name])
        return Meteor.settings.public[name];
}

export function errorAlert(msg, e, cb) {
    showModal({
        text: msg,
        mandatoryCallback: cb,
        buttons: [{
            classes: 'red',
            text: 'OK',
            onClick: () => {
                if (cb)
                    cb();
            },
        }, ],
    });
}

export function getRusPlural(diff, plurals) {
    let ret = '';
    if (diff == 1 || (diff > 20 && (diff % 10) == 1)) {
        ret = plurals[0];
        return ret;
    }
    if ((diff >= 2 && diff <= 4) || (diff > 20 && (diff % 10 >= 2) && (diff % 10 <= 4))) {
        ret = plurals[1];
        return ret;
    }
    if ((diff >= 5 && diff <= 20) || (diff > 20 && ((diff % 10) == 0 || ((diff % 10) - 5) <= 4))) {
        ret = plurals[2];
        return ret;
    }
    return ret;
}

export function formatTime(t, rplcs = {}) {
    const diff = moment().diff(moment(t), 'minute');
    let ret = '';
    if (diff < 1)
        ret = 'только что';
    else if (diff > 60 * 24 * 7) {
        const w = Math.floor(diff / 60 / 24 / 7);
        const r = rplcs.week ? rplcs.week : ['неделя', 'недели', 'недель'];
        ret = `${w  } ${  getRusPlural(w, r)}`;
    } else if (diff > 60 * 24) {
        const d = Math.floor(diff / 60 / 24);
        const r = rplcs.day ? rplcs.day : ['день', 'дня', 'дней'];
        ret = `${d  } ${  getRusPlural(d, r)}`;
    } else if (diff > 60) {
        const h = Math.floor(diff / 60);
        const r = rplcs.hour ? rplcs.hour : ['час', 'часа', 'часов'];
        ret = `${h  } ${  getRusPlural(h, r)}`;
    } else {
        const r = rplcs.minute ? rplcs.minute : ['минута', 'минуты', 'минут'];
        ret = `${diff  } ${  getRusPlural(diff, r)}`;
    }
    return ret;
}

_app = false;
export function registerAppComponent(app) {
    _app = app;
}

export function isAppRegistered() {
    return !!_app;
}

export function getScreenHeight(withScreen) {
    if (withScreen)
        return Math.max($(window).height() || 0, screen.height || 0);
    return Math.max($(window).height() || 0);
}

export function getScreenWidth() {
    return $(window).width();
}

export function checkStatus() {
    let status = Meteor.status();
    return status.status == 'connected';
}

export function showLoader(options) {
    $('.loader.main').removeClass('hidden');
    $('body').addClass('modalOpen2');
    let scrlt = require('jquery.scrollto');
    scrlt(0, 300);
    return true;
}

export function closeLoader(options) {
    $('.loader.main').addClass('hidden');
    $('body').removeClass('modalOpen2');
}

export function showModal(options) {
    if (!_app) {
        alert('failed to show modal');
        return;
    }
    _app.showModal(options);
}

export function trackGAEvent(category, ev, label, value) {
    if (!window.ga) {
        return;
    }
    window.ga.trackEvent(category, ev, label, value);
}

export function showLightbox(options) {
    if (!_app) {
        alert('failed to show lightbox');
        return;
    }
    _app.showLightbox(options);
}

export let requestCreated = false,
    geoStarted = false;
export function ensureGeoStartup() {
    ensureGeo();
}

export function ensureGeo() {
    if (geoStarted)
        return;
    geoStarted = true;
    Tracker.autorun(() => {
        let userId = Meteor.userId();
        let location = Geolocation.currentLocation();
        let currentLocation = Session.get('location');
        if (currentLocation && location && util.compat.android) {
            let dX = Math.abs(location.latitude - currentLocation.latitude);
            let dY = Math.abs(location.longitude - currentLocation.longitude);
            if (dX > 1e-6 || dY > 1e-6) {
                console.log('[ensureGeo] setting ', location);
                Session.set('location', (location && location.coords) ? coordsForSave(location) : false);
            }
            return;
        }
        console.log('[ensureGeo] setting ', location);
        Session.set('location', (location && location.coords) ? coordsForSave(location) : false);
    });
}