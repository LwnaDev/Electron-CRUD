/**
* SPANISH
* Autor: Alejandro Aguilar
* Institucion o Empresa: IPN
* Ultima Modificación: 03/11/2021 : 11:15 PM
* Descripción: Aplicación CRUD para Run Mountain desarrollada en Visual Studio Code con framework
*              Electronjs (Javascript, HTML, CSS, Nodejs) y MySQL para la bd.
* Objetivo: Solucionar la problematica de inventario para la empresa Run Mountain
**/


//Llamamos a createwindow y login window de main donde solo usaremos login
//Iniciaremos la ventana en login para la autenticación de usuarios, con una
//contraseña definida y para su restablecimiento esta debera ser registrada
//por el administrador de TI en la bd sql
const {createWindow, loginWindow} = require('./main')
const {app} = require('electron')
const path = require('path');


//Base de datos
require('./database')

//Llamamos al modulo de electron no importa donde se encuentre
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules/.bin/electron')
});

//Mensaje encendido en Consola "El Linea!"
app.on('ready', () => {
    console.log('En Linea!');
})

app.allowRendererProcessReuse = false;

//Para Mac Os "darwin", cuando se pulse salir, debera invocar el metodo quit del objeto app 
app.whenReady().then(loginWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {  
        app.quit()
    }
})

//Para Mac Os, cuando la aplicacion se quede en el dock este debera reactivarse con el evento activate
app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0){
        loginWindow();
    }
});

/*process.platform devuelve una cadena que identifica la plataforma del 
sistema operativo en la que se está ejecutando el proceso Node.js.
Pueden ser:
'darwin'
'freebsd', etc*/
