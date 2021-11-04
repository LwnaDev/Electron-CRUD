//Requerimos ipcRender de electron para la intercomunicacion entre componentes (ventana a otra)
const { ipcRenderer } = require('electron')

//Se crea la lectura de id del boton login e imput de contraseña
let btnlogin;
let password;
let user;

window.onload = function() { 
  user = document.getElementById("user")  
  password = document.getElementById("password")
  btnlogin = document.getElementById("login")
    btnlogin.onclick = function(){
      const obj = {user:user.value , password:password.value }
      ipcRenderer.invoke("login", obj)
    }
}