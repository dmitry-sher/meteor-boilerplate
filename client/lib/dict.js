import * as collections from '../../lib/collections';

export const initials = {};

const Dict = function(name, options) {
    this.name = name;
    this.options = options;
    // this.reactive = ReactiveVar(null);

    this.init = () => {
        try {
            this.load();
            console.log(`[Dict.${this.name}] loaded, data length = `, this.data ? this.data.length : 'undefined');
            if (!this.data || !this.data.length || !this.version)
                this.loadInitialData();
        } catch (e) {
            this.loadInitialData();
            // this.data = [];
            // this.version = false;
        }
    }

    // this.reactiveSource = () => {
    //     return this.reactive;
    // }

    this.getKey = () => {
        return `_storage.${this.name}`;
    }

    this.loadInitialData = () => {
        const obj = initials[this.name];
        if (!obj)
            return;
        this.data = obj.data;
        this.version = obj.version;
        this.save();
        console.log(`[Dict.${this.name}] load initial, data length = `, this.data ? this.data.length : 'undefined');
    }

    this.save = () => {
        const str = JSON.stringify({ data: this.data, version: this.version });
        localStorage.setItem(this.getKey(), str);
    }

    this.get = () => {
        return this.data;
    }

    this.update = (force, cb, errcb) => {
        Meteor.call('updateDict', this.name, this.version, force, (err, res) => {
            if (err) {
                console.warn('[Dict.update] error when updating ', err);
                if (errcb)
                    errcb(err);
                return;
            }

            if (!res.hasUpdate)
                return;

            console.log(`[Dict.${this.name}] updated, data length = `, res.data ? res.data.length : 'undefined');
            this.data = res.data;
            this.version = res.version;
            if (cb)
                cb();
            this.save();
        });
    }

    this.load = () => {
        const obj = JSON.parse(localStorage.getItem(this.getKey()));

        this.data = obj.data;
        this.version = obj.version;
    }

    this.findOne = (field, val) => {
        if (val === undefined) {
            val = field;
            field = '_id';
        }
        const ret = _.filter(this.data, (d) => d[field] == val);
        if (ret && ret.length)
            return ret[0];
        return false;
    }

    this.find = (field, val) => {
        if (!val) {
            val = field;
            field = '_id';
        }
        return _.filter(this.data, (d) => d[field] == val);
    }

    this.count = () => {
        if (!this.data)
            return 0;
        return this.data.length;
    }

    this.init();
    return this;
}