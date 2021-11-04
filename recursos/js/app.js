//Llamamos al formulario de index.html por sus Id
const productForm = document.getElementById('productForm');

//Llamamos a las funciones de main
const { remote } = require('electron')
const main = remote.require('./main') 

//Se definen los nombres de elementos nombre, precio, color, stock y descripcion por Id
const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productColor = document.getElementById('color');
const productStock = document.getElementById('stock');
const productDescription = document.getElementById('description');
const productList = document.getElementById('productos');

let cant = 0
let products = []
let editingStatus = false;
let editproductId = '';

//Definimos el evento enviar del formulario
productForm.addEventListener('submit' , async (e) =>{
    e.preventDefault();
    //Se definen los elementos para insertar un nuevo producto
    //Se enviaran por el objeto nweProduct
    const newProduct = {
        name: productName.value,
        price: productPrice.value,
        color: productColor.value,
        stock: productStock.value,
        description: productDescription.value
    }

    if(!editingStatus){
        const result = await main.createProduct(newProduct)
        console.log(result);
        //Alerta de sweetalert definida en index.html
        swal({
            icon: "success",
        });
    }else{
        await main.updateProduct(editproductId, newProduct);
        editingStatus = false;
        editproductId = '';
        //Alerta de sweetalert
        swal({
            icon: "info",
            title: 'Producto Actualizado',
            width: 600,
        });
    }
    
    productForm.reset();
    productName.focus();

    getProducts();
    getCantidad();
})

//Funcion de eleminar y alertas
async function deleteProduct(id){
    const response = confirm('❓ || ¿Esta seguro que desea eliminar este producto?')
    if(response){
        await main.deleteProduct(id)
        await getProducts();
        await getCantidad();
        productForm.reset();
        productName.focus();
        
        swal({
            text: "Eliminado",
            icon: "success",
        });

    }
    return;
}

async function editProduct(id){
    const product = await main.getProductById(id);
    productName.value = product.name;
    productPrice.value = product.price;
    productColor.value = product.color;
    productStock.value = product.stock;
    productDescription.value = product.description;

    editingStatus = true;
    editproductId = product.id;
    //await getProducts();
}

//Se mustran los productos guardados de la bd de lado izquierdo
function renderProducts(products){
    productList.innerHTML= '';
    products.forEach(element => {
        productList.innerHTML += `
            <div class="card card-body my-2 animate__animated animate__flipInY">
                <h5>✎${element.name}</h5>
                <small>🆔 ${element.id}</small> 
                <h6>🎨${element.color}</h6>
                <small>🟩${element.stock}</small> 
                <small><p>${element.description}</p></small>
                <h4>$ ${element.price}</h4>
                <div class="centrardiv">
                    <button class="btn btn-delete centrarbtn" onclick="deleteProduct(${element.id})"> Eliminar <i class="fas fa-trash"></i></button>
                    <button class="btn btn-edit centrarbtn" onclick="editProduct(${element.id})"> Editar  <i class="fas fa-edit"></i></button>
                </div>
            </div>
        `  
    });
}
const getProducts = async () =>{
    products = await main.getProducts();
    renderProducts(products);
}

function renderCantidad(cant){
    cant.forEach(element => {
        console.log(element.Cantidad)
        document.getElementById('cantidad').innerHTML = element.Cantidad
    });
}

//Al utilizarse sql estas funciones seran asincronas
const getCantidad = async () =>{
    cant = await main.getCantidad();
    renderCantidad(cant);
}

async function init(){
    await getProducts();
    await getCantidad();
}
init();
