var apt = require("@nathanfaucett/apt"),
    has = require("@nathanfaucett/has"),
    uuid = require("@nathanfaucett/uuid"),
    values = require("@nathanfaucett/values"),
    isString = require("@nathanfaucett/is_string");


var Store = apt.Store,
    ModalStorePrototype;


function ModalStore() {

    Store.call(this);

    this.__modals = {};
}
Store.extend(ModalStore, "virt.ModalStore", [
    "OPEN",
    "CLOSE",
    "CLOSE_NOW"
]);
ModalStorePrototype = ModalStore.prototype;

function ModalData(options) {
    this.id = uuid.v1();
    this.name = options.name;
    this.data = options.data;
    this.size = isString(options.size) ? " " + options.size : " md";
    this.className = isString(options.className) ? " " + options.className : "";
    this.ms = options.ms;
    this.style = options.style;
    this.backdropOpacity = options.backdropOpacity;
    this.backdrop = options.backdrop;
    this.dialog = options.dialog;
    this.content = options.content;
    this.willClose = false;
}

function ModalStore_create(_this, options) {
    var modal = new ModalData(options || {});
    _this.__modals[modal.id] = modal;
}

function ModalStore_willClose(_this, id) {
    var modals = _this.__modals;

    if (has(modals, id)) {
        modals[id].willClose = true;
        return true;
    } else {
        return false;
    }
}

function ModalStore_destroy(_this, id) {
    var modals = _this.__modals;

    if (has(modals, id)) {
        delete modals[id];
        return true;
    } else {
        return false;
    }
}

ModalStorePrototype.toJSON = function() {
    return this.__modals;
};

ModalStorePrototype.fromJSON = function(json) {
    this.__modals = json;
};

ModalStorePrototype.all = function(callback) {
    callback(undefined, values(this.__modals));
};

ModalStorePrototype.show = function(id, callback) {
    var modals = this.__modals;

    if (has(modals, id)) {
        callback(undefined, modals[id]);
    } else {
        callback(new Error("ModalStore show(id, callback) No Modal found with id " + id));
    }
};

ModalStorePrototype.handler = function(action) {
    var consts = this.consts;

    switch (action.type) {
        case consts.OPEN:
            ModalStore_create(this, action);
            this.emitChange();
            break;
        case consts.CLOSE:
            if (ModalStore_willClose(this, action.id)) {
                this.emitChange();
            }
            break;
        case consts.CLOSE_NOW:
            if (ModalStore_destroy(this, action.id)) {
                this.emitChange();
            }
            break;
    }
};


module.exports = new ModalStore();