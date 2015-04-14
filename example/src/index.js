var virt = require("virt"),
    virtDOM = require("virt-dom"),
    modal = require("../..");


var ModalStore = modal.ModalStore;


function renderApp() {
    return (
        virt.createView("div",
            virt.createView("a", {
                style: {
                    cursor: "pointer"
                },
                onClick: function() {
                    ModalStore.registerCallback({
                        action: {
                            actionType: ModalStore.consts.MODAL_OPEN,
                            name: "modal"
                        }
                    });
                }
            }, "Open Modal"),
            virt.createView(modal.Modals, {
                modals: {
                    modal: {
                        name: "modal",
                        onClose: function(modal) {
                            ModalStore.registerCallback({
                                action: {
                                    actionType: ModalStore.consts.MODAL_CLOSE,
                                    id: modal.id
                                }
                            });
                        },
                        render: function() {
                            return virt.createView("h1", "hello world!");
                        }
                    }
                }
            })
        )
    );
}


virtDOM.render(renderApp(), document.getElementById("app"));
