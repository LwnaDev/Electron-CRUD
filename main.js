//Requerimos app, ipcMain, BrowserWindow y Notificaction de electron, asi no cargaremos
//La framework completa
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const {getConnection} = require('./database')
const path = require('path'); 

//Se define la ventana de login la cual vera el usuario en primera instancia
let window;
let winlogin;

function loginWindow () {
//Se definen los valores predeterminados de la ventana
winlogin = new BrowserWindow({
    width: 1000,
    height: 700,
    center: true,
    backgroundColor: '#fff', 
    title: 'Run Mountain', 
    resizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    transparent: true,
    icon: `${__dirname}/recursos/img/flatpak.ico`, 
    movable: true,
    webPreferences: {
    // nodeIntegration: true,
    preload:path.join(__dirname, './recursos/js/login.js')
    }
})
//Se carga la pagina de login.html para que se muestre en la ventana
winlogin.loadFile('./vistas/login.html');
}

//Se definen las caracteristicas que tendra la ventana a mostrar por electron
//Esta sera la ventana principal
function createWindow(){
    window = new BrowserWindow({
        width: 1000,
        height: 700,
        center: true,
        backgroundColor: '#000', 
        title: 'Run Mountain', 
        resizable: false,
        maximizable: false,
        autoHideMenuBar: true,
        transparent: true,
        icon: `${__dirname}/recursos/img/flatpak.ico`, 
        movable: true,
        webPreferences:{
        nodeIntegration: true
        }
    })
    window.loadFile('./vistas/index.html');
}

//Se crean las comparaciones y funciones al inicio entre ventana y ventana
app.on('activate', () => {
if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
}
})

ipcMain.handle('login', (event, obj) => {
    validatelogin(obj)
});

//Se valida el login del usuario dependiendo la contraseña dada
async function validatelogin(obj) {
const { password } = obj
const {user}= obj 
const conn = await getConnection();
const results = await conn.query ("SELECT * FROM login WHERE user = ? AND password = ?", [user, password])
    if (password && user) {
        if(results.length > 0){
            createWindow ()
            window.show()
            winlogin.close()
        }
        else{
            console.log("Usuario No Identificado") 
            winlogin.loadFile('./vistas/login.html'); 
            winlogin.show()
            new Notification({
                title: 'Run Mountain',
                body: '❌ Contraseña Invalida',
                subtitle: 'Usuario No Identificado',
                timeoutType: 'default'
            }).show();
        }
    }
}

//Se inserta el producto a la bd 
async function createProduct(product){
    try {
        const conn = await getConnection();
        product.price = parseFloat(product.price)
        product.stock = parseFloat(product.stock)
        const result = await conn.query('INSERT INTO product SET ?', product )
        console.log(result)

        new Notification({
            title: 'Run Mountain',
            body: '✔ Producto guardado!',
            subtitle: 'Se mostrara en la bd',
            timeoutType: 'default'
        }).show();

        product.id = result.insertId;
        return product

    }catch (error){
        new Notification({
            title: 'Run Mountain',
            body: '❌ Error'+'\n'+ error,
            subtitle: 'Verificar en bd',
            timeoutType: 'default'
        }).show();
        console.log(error)
    }    
}

//Se hace la consulta de items
async function getProducts(){
    const conn = await getConnection();
    const results = await conn.query('SELECT * FROM product ORDER BY id DESC')
    // const results = await conn.query('SELECT COUNT(*) FROM product');
    console.log(results)
    return results;
}

//Se hace la consulta de cantidad de items
async function getCantidad(){
    const conn = await getConnection();
    const result = await conn.query('SELECT COUNT(*) AS Cantidad FROM product')
    // const result = await conn.query('SELECT COUNT(*) FROM product')
    console.log(result)
    return result;
}

//Se crea la funcion eleminar 
async function deleteProduct(id){
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM product WHERE id = ?', id)
    console.log(result); 
}

//Se crea la funcion obtener
async function getProductById(id){
    const conn = await getConnection();
    const result = await conn.query('SELECT * FROM product WHERE id = ?', id)
    return result[0]; 
}

//Se crea la funcion actualizar/editar
async function updateProduct(id, product){
    const conn = await getConnection();
    const result = await conn.query('UPDATE product SET ? WHERE id = ?', [product, id]);
    // return result
    console.log(result)
}

//Exportación de los siguientes modulos para su uso posterior
module.exports = {
    loginWindow,
    createWindow,
    createProduct,
    getProducts,
    getCantidad,
    deleteProduct,
    getProductById,
    updateProduct
};