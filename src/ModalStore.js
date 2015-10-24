var EventEmitter = require("event_emitter"),
    isString = require("is_string"),
    keyMirror = require("key_mirror");


var ModalStore = module.exports = new EventEmitter(-1),

    EVENT_CHANGE = "change",

    consts = ModalStore.consts = keyMirror([
        "MODAL_OPEN",
        "MODAL_CLOSE"
    ]),

    _id = 1,
    _modals = [];


function create(options) {
    var modals = _modals,
        index = modals.length,
        modal;

    modal = {};

    modal.id = _id++;
    modal.index = index;
    modal.name = options.name;
    modal.data = options.data;
    modal.size = isString(options.size) ? " " + options.size : " md";
    modal.className = isString(options.className) ? " " + options.className : "";
    modal.style = options.style;
    modal.backdrop = options.backdrop;
    modal.dialog = options.dialog;

    modals[index] = modal;
}

function destroy(id) {
    var modals = _modals,
        i = -1,
        il = modals.length - 1,
        index = -1,
        modal;

    while (i++ < il) {
        modal = modals[i];

        if (modal.id === id) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        modals.splice(index, 1);
    }
}

ModalStore.toJSON = function() {
    return _modals.slice();
};

ModalStore.fromJSON = function(json) {
    _modals = json;
};

ModalStore.all = function(callback) {
    callback(undefined, _modals.slice());
};

ModalStore.addChangeListener = function(callback) {
    this.on(EVENT_CHANGE, callback);
};

ModalStore.removeChangeListener = function(callback) {
    this.off(EVENT_CHANGE, callback);
};

ModalStore.emitChange = function() {
    this.emit(EVENT_CHANGE);
};

ModalStore.registerCallback = function(payload) {
    var action = payload.action;

    switch (action.actionType) {
        case consts.MODAL_OPEN:
            create(action);
            ModalStore.emitChange();
            break;
        case consts.MODAL_CLOSE:
            destroy(action.id);
            ModalStore.emitChange();
            break;
    }
};
