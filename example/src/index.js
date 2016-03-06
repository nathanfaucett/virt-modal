var virt = require("virt"),
    virtDOM = require("virt-dom"),
    EventEmitter = require("event_emitter"),
    modal = require("../..");


var dispatcher = new EventEmitter(-1),
    application = {
        dispatcher: dispatcher
    },
    ModalStore = modal.ModalStore;


dispatcher.dispatch = function(action) {
    dispatcher.emitArg("dispatch", action);
};
ModalStore.application = application;

dispatcher.on("dispatch", function(action) {
    ModalStore.handler(action);
});


function renderApp() {
    return (
        virt.createView("div",
            virt.createView("a", {
                style: {
                    cursor: "pointer"
                },
                onClick: function() {
                    dispatcher.dispatch({
                        type: ModalStore.consts.OPEN,
                        name: "modal"
                    });
                }
            }, "Open Modal"),
            virt.createView(modal.Modals, {
                modalContent: {
                    backgroundColor: "#fff"
                },
                modals: {
                    modal: {
                        name: "modal",
                        onClose: function(modal) {
                            dispatcher.dispatch({
                                type: ModalStore.consts.CLOSE,
                                id: modal.id
                            });
                        },
                        render: function(modal) {
                            return (
                                virt.createView("div",
                                    virt.createView("h1", "hello world!"),
                                    virt.createView("a", {
                                        onClick: modal.close
                                    }, "X")
                                )
                            )
                        }
                    }
                }
            })
        )
    );
}


virtDOM.render(renderApp(), document.getElementById("app"));
