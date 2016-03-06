var virt = require("virt"),
    css = require("css"),
    extend = require("extend"),
    propTypes = require("prop_types"),
    ModalStore = require("./ModalStore");


var ModalPrototype;


module.exports = Modal;


function Modal(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        animateIn: false,
        animateOut: false
    };

    this.onWillRemove = function() {
        return _this.__onWillRemove();
    };
}
virt.Component.extend(Modal, "Modal");
ModalPrototype = Modal.prototype;

Modal.propsTypes = {
    id: propTypes.string.isRequired,
    index: propTypes.number.isRequired,
    size: propTypes.string.isRequired,
    className: propTypes.string.isRequired,
    close: propTypes.func.isRequired,
    ms: propTypes.number,
    style: propTypes.object,
    backdropOpacity: propTypes.number,
    backdropStyle: propTypes.object,
    dialogStyle: propTypes.object,
    contentStyle: propTypes.object
};

Modal.defaultProps = {
    ms: 450,
    backdropOpacity: 0.4
};

ModalPrototype.componentDidMount = function() {
    var _this = this;

    ModalStore.addChangeListener(this.onWillRemove);
    setTimeout(function onSetTimeout() {
        _this.setState({
            animateIn: true,
            animateOut: false
        });
    }, 1);
};

ModalPrototype.__onWillRemove = function() {
    var _this = this;

    ModalStore.show(_this.props.id, function(error, modal) {
        if (!error && modal.willClose) {
            setTimeout(function onSetTimeout() {
                _this.setState({
                    animateIn: false,
                    animateOut: true
                });
                setTimeout(function onSetTimeout() {
                    ModalStore.application.dispatcher.dispatch({
                        type: ModalStore.consts.CLOSE_NOW,
                        id: _this.props.id
                    });
                }, _this.props.ms);
            }, 1);
        }
    });
};

ModalPrototype.getStyles = function() {
    var props = this.props,
        state = this.state,
        styles = {
            root: {
                zIndex: 1000 + props.index,
                position: "absolute",
                top: "0",
                left: "0",
                WebkitOverflowScrolling: "touch",
                outline: "0"
            },
            backdrop: {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "#000"
            },
            dialog: {
                position: "relative"
            }
        };

    css.transition(styles.backdrop, "opacity " + props.ms + "ms " + css.easing.inOut + " 0ms");

    if (state.animateIn) {
        css.opacity(styles.backdrop, props.backdropOpacity);
    } else if (state.animateOut) {
        css.opacity(styles.backdrop, 0);
    } else {
        css.opacity(styles.backdrop, 0);
    }

    return styles;
};

ModalPrototype.render = function() {
    var styles = this.getStyles(),
        props = this.props;

    return (
        virt.createView("div", {
                className: "Modal" + props.className,
                style: extend(styles.root, props.style)
            },
            virt.createView("div", {
                onClick: props.close,
                ref: "backdrop",
                className: "Modal-backdrop",
                style: extend(styles.backdrop, props.backdropStyle)
            }),
            virt.createView("div", {
                    className: "Modal-dialog" + props.size,
                    style: extend(styles.dialog, props.dialogStyle)
                },
                this.children
            )
        )
    );
};
