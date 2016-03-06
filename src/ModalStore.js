var apt = require("apt"),
    has = require("has"),
    uuid = require("uuid"),
    values = require("values"),
    isString = require("is_string");


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
    this.id = uuid();
    this.name = options.name;
    this.data = options.data;
    this.size = isString(options.size) ? " " + options.size : " md";
    this.className = isString(options.className) ? " " + options.className : "";
    this.style = options.style;
    this.backdrop = options.backdrop;
    this.dialog = options.dialog;
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
    }
}

function ModalStore_destroy(_this, id) {
    var modals = _this.__modals;

    if (has(modals, id)) {
        delete modals[id];
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
            ModalStore_willClose(this, action.id);
            this.emitChange();
            break;
        case consts.CLOSE_NOW:
            ModalStore_destroy(this, action.id);
            this.emitChange();
            break;
    }
};


module.exports = new ModalStore();
