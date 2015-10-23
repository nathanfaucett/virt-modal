var virt = require("virt"),
    virtDOM = require("virt-dom"),
    css = require("css"),
    extend = require("extend"),
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
    style: propTypes.object,
    backdropStyle: propTypes.object,
    dialogStyle: propTypes.object,
    contentStyle: propTypes.object,
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

    virtDOM.findDOMNode(this.refs.backdrop).style.height = height + "px";
};

ModalPrototype.getStyles = function() {
    var props = this.props,
        styles = {
            root: extend({
                zIndex: 1000 + props.index,
                position: "absolute",
                top: "0",
                left: "0",
                "-webkit-overflow-scrolling": "touch",
                outline: "0"
            }, props.style),
            backdrop: extend({
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "#000"
            }, props.backdrop),
            dialog: extend({
                position: "relative"
            }, props.dialog)
        };

    css.opacity(styles.backdrop, 0.5);

    return styles;
};

ModalPrototype.render = function() {
    var styles = this.getStyles(),
        props = this.props;

    return (
        virt.createView("div", {
                className: "Modal" + props.className,
                style: styles.root
            },
            virt.createView("div", {
                onClick: props.close,
                ref: "backdrop",
                className: "Modal-backdrop",
                style: styles.backdrop
            }),
            virt.createView("div", {
                    className: "Modal-dialog" + props.size,
                    style: styles.dialog
                },
                this.children
            )
        )
    );
};
