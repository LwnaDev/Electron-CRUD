const mysql = require('promise-mysql')

//Conexion con la base de datos llamada "runmountain"
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'runmountain' 
})

function getConnection(){
    return connection;
}

//Exportamos la siguiente conexion para su uso en otras funciones
module.exports = {
    connection,
    getConnection
};