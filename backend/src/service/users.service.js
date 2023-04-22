const {sequelize} = require("../connection");
const {UserModel} = require("../model/user.model");

const listarService = async function(textoBuscar) {
    console.log("listar usuarios service");
    try {
        const users = await sequelize.query(`SELECT * 
                                            FROM users 
                                            WHERE 1=1
                                                AND UPPER(name) LIKE UPPER('%${textoBuscar}%')
                                                AND deleted IS false
                                            ORDER BY id`);
        
        if (users && users[0]){
            //En users[0] se encuentra el listado de lo que se recupera desde el SQL
            return users[0];
        } else {
            return [];
        }        
    } catch (error) {
        console.log(error);
        throw error;
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

const actualizar = async function(id, name, last_name, avatar, email, password, deleted) {
    console.log("actualizar usuarios");
    //res.send("actualizar de usuarios");
    //Variables
    let usuarioRetorno = null;    //Guardara el usuario que se va incluir o editar.
    //const data = req.body;  //Se obtiene los datos del cuerpo de la peticion
    const data = {id, name, last_name, avatar, email, password, deleted};
    //const id = req.body.id;
    try {
        let usrExiste = null;
        if (id) {
            usrExiste = await UserModel.findByPk(id);
        }
        if (usrExiste){
            //Asegurar que el usuario existe, entonces actualizar
            usuarioRetorno = await UserModel.update(data, { where : {id : id}});
            usuarioRetorno = data;
        } else {
            //Incluir
            usuarioRetorno = await UserModel.create(data);
        }
        return usuarioRetorno;
    } catch (error) {
        console.log(error);
        throw error;
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
    listarService, busquedaPorCodigo: consultarPorCodigo, actualizar, eliminar
};