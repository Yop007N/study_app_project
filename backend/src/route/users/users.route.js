const userController = require('../../controller/users/users.controller');

module.exports = function(app) {

    app.get("/users/list", userController.listarController);
    app.get("/user/:id", userController.busquedaPorCodigo);
    app.post("/users/update", userController.actualizar);
    app.delete("/users/delete/:id", userController.eliminar);
}