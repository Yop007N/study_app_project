const {sequelize} = require("../../connection");
const {UserModel} = require("../../model/user.model");
const UserService = require('../../service/users.service');

const listarController = async function(req, res) {
    console.log("listar usuarios controller");
    try {
        const users = await UserService.listarService(req.query.filtro || '');
        
        if (users){
            res.json({
                success : true, 
                usuarios : users
            });
        } else {
            res.json({
                success : true, 
                usuarios : []
            });
        }        
    } catch (error) {
        console.log(error);
        res.json({
            success : false, 
            error : error.message
        });
    }

};

const consultarPorCodigo = async function(req, res) {
    console.log("consultar 1 usuario por codigo");
    try {
        //Buscar en la Base de datos por codigo
        const userModelResult = await UserModel.findByPk(req.params.id);

        if (userModelResult) {
            res.json({
                success : true, 
                usuario : userModelResult
            });
        } else {
            res.json({
                success : true, 
                usuario : null
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success : false, 
            error : error.message
        });
    }

};

const actualizar = async function(req, res) {
    console.log("actualizar usuarios controller");
    //Variables
    let usuarioRetorno = null;    //Guardara el usuario que se va incluir o editar.
     
    try {
        usuarioRetorno = await UserService.actualizar(  req.body.id, 
                                                        req.body.name, 
                                                        req.body.last_name, 
                                                        req.body.avatar, 
                                                        req.body.email, 
                                                        req.body.password, 
                                                        req.body.deleted);
        res.json({
            success : true, 
            user : usuarioRetorno
        });
    } catch (error) {
        console.log(error);
        res.json({
            success : false, 
            error : error.message
        });
    }
};

const eliminar = async function(req, res) {
    console.log("eliminar usuarios");
    //res.send("eliminar de usuarios");

    //Borrado fisico
    //UserModel.destroy(req.params.id);
    try {
        await sequelize.query("UPDATE users SET deleted=true WHERE id = " + req.params.id);
            
        res.json({
            success : true
        });
    } catch (error) {
        console.log(error);
        res.json({
            success : false, 
            error : error.message
        });
    }
};


module.exports = {
    listarController, busquedaPorCodigo: consultarPorCodigo, actualizar, eliminar
};