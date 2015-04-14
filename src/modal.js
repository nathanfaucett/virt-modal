var virt = require("virt"),
    virtDOM = require("virt-dom"),
    propTypes = require("prop_types"),
    eventListener = require("event_listener"),
    environment = require("environment"),
    isNumber = require("is_number");


var window = environment.window,
    document = environment.document,

    ModalPrototype;


module.exports = Modal;


function Modal(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.onResize = function(e) {
        return _this.__onResize(e);
    };
}
virt.Component.extend(Modal, "Modal");
ModalPrototype = Modal.prototype;

Modal.propsTypes = {
    index: propTypes.number.isRequired,
    size: propTypes.string.isRequired,
    className: propTypes.string.isRequired,
    close: propTypes.func.isRequired
};

ModalPrototype.componentDidMount = function() {
    eventListener.on(window, "resize ondeviceorientation", this.onResize);
    this.onResize();
};

ModalPrototype.componentWillUnmount = function() {
    eventListener.off(window, "resize ondeviceorientation", this.onResize);
};

ModalPrototype.__onResize = function() {
    var body = document.body,
        html = document.documentElement,
        height;

    if (isNumber(document.height)) {
        height = document.height;
    } else {
        height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    }

    virtDOM.findDOMNode(this.refs.modalBackdrop).style.height = height + "px";
};

ModalPrototype.render = function() {
    var props = this.props;

    return (
        virt.createView("div", {
                className: "modal" + props.className,
                style: {
                    zIndex: 1000 + props.index
                }
            },
            virt.createView("div", {
                onClick: props.close,
                ref: "modalBackdrop",
                className: "modal-backdrop"
            }),
            virt.createView("div", {
                    className: "modal-dialog" + props.size
                },
                virt.createView("div", {
                        className: "modal-content"
                    },
                    this.children
                )
            )
        )
    );
};
