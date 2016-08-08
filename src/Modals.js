var virt = require("@nathanfaucett/virt"),
    arrayMap = require("@nathanfaucett/array-map"),
    extend = require("@nathanfaucett/extend"),
    isFunction = require("@nathanfaucett/is_function"),
    propTypes = require("@nathanfaucett/prop_types"),
    ModalStore = require("./ModalStore"),
    Modal = require("./Modal");


var ModalsPrototype = Modals.prototype;


module.exports = Modals;


function Modals(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        modals: []
    };

    this.onChange = function() {
        return _this.__onChange();
    };
}
virt.Component.extend(Modals, "Modals");
ModalsPrototype = Modals.prototype;

Modals.propTypes = {
    style: propTypes.object,
    modalStyle: propTypes.object,
    modalBackdrop: propTypes.object,
    modalDialog: propTypes.object,
    modalContent: propTypes.object,
    modals: propTypes.object.isRequired
};

ModalsPrototype.componentDidMount = function() {
    ModalStore.addChangeListener(this.onChange);
    this.__onChange();
};

ModalsPrototype.componentWillUnmount = function() {
    ModalStore.removeChangeListener(this.onChange);
};

ModalsPrototype.__onChange = function() {
    var _this = this,
        modalProps = this.props.modals;

    ModalStore.all(function(error, modals) {
        _this.setState({
            modals: arrayMap(modals, function(modal) {
                var modalProp = modalProps[modal.name],
                    renderModal = extend({}, modal),
                    render, onClose;

                if (!modalProp) {
                    throw new Error("no modal name " + modal.name);
                }

                render = modalProp.render;
                if (!isFunction(render)) {
                    throw new Error("modal at index " + modal.index + " name " + modal.name + " invalid render function");
                }

                onClose = modalProp.onClose;
                if (!isFunction(onClose)) {
                    throw new Error("modal at index " + modal.index + " name " + modal.name + " invalid onClose function");
                }

                renderModal.close = function() {
                    onClose(renderModal);
                };
                renderModal.render = render;

                return renderModal;
            })
        });
    });
};

ModalsPrototype.render = function() {
    var props = this.props;

    return (
        virt.createView("div", {
                className: "Modals"
            },
            arrayMap(this.state.modals, function(modal, index) {
                return (
                    virt.createView(Modal, {
                        key: modal.id,
                        id: modal.id,
                        index: index,
                        size: modal.size,
                        className: modal.className,
                        close: modal.close,
                        ms: modal.ms,
                        style: modal.style || props.style,
                        backdropOpacity: modal.backdropOpacity,
                        backdropStyle: modal.backdropStyle || props.backdrop,
                        dialogStyle: modal.dialogStyle || props.dialog,
                        contentStyle: modal.contentStyle || props.content
                    }, modal.render(modal))
                );
            })
        )
    );
};
