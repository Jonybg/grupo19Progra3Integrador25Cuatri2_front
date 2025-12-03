const contenedor = document.getElementById("sectionProd")
const categoria = document.getElementById("categoria")
const cartContainer = document.getElementById("cart-container")
const carritoElementos = document.querySelector(".carrito-elementos")
const cartButton = document.getElementById("cart-img")
const boton_atras = document.getElementById("button-atras")
const boton_vaciar = document.getElementById("button-vaciar")
const URL = "http://localhost:3000"
const user_span = document.getElementById("user")
const usuario = localStorage.getItem("usuario");



let productos = []
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
async function  llamarProductos() {
    try {
        const response = await fetch(`${URL}/api/products`)
        const data = await response.json()
        productos = data.payload;
        mostrarProductos(productos)
        console.log(productos);
        
        
    } catch (error) {
        
    }
}

function mostrarProductos(array) {
    let htmlCardProducto =""
    array.forEach(producto => {
        htmlCardProducto += 
        `
        <div class="card-product">
            <span>${producto.nombre} </span>
            <img src="${producto.imagen}" alt="">
            <span>Precio: $${producto.precio}  </span>
            <button onclick="agregarAcarrito(${producto.id})">Agregar</button>
        </div>
        `
    });

    contenedor.innerHTML = htmlCardProducto;
}


function filtrarProductos() {
    const categoriaSeleccionada = categoria.value
    console.log(productos);
    
    const productosFiltrado = categoriaSeleccionada == "Todos" ? productos : productos.filter(p=> p.categoria == categoriaSeleccionada);
    mostrarProductos(productosFiltrado)

}

function mostrarProductosCarrito() {
  if (carrito.length === 0) {
    carritoElementos.innerHTML = "<p>El carrito está vacío 🛒</p>";
    return;
  }

  let cardCarrito = "";
  carrito.forEach((producto, i) => {
    cardCarrito += `
      <div class="card-product">
        <img src="${producto.imagen}" alt="">
        <p>${producto.nombre} - $${producto.precio}</p>
        <div class="cart-buttons" >
          <button class="button-restar" onclick="restarCantidad(${i})">−</button>
          <div>
          <span>Cantidad: ${producto.cantidad}</span>
          <button onclick="sumarCantidad(${i})">+</button>
          </div>
        </div>
        <button onclick="eliminarProducto(${i})">Eliminar Producto</button>
      </div>
    `;
  });

  carritoElementos.innerHTML = cardCarrito;
  actualizarCantidadCarrito();

}

function sumarCantidad(i) {
  carrito[i].cantidad += 1;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCantidadCarrito();
  mostrarProductosCarrito();
}

function restarCantidad(i) {
  if (carrito[i].cantidad > 1) {
    carrito[i].cantidad -= 1;
  } else {
    carrito.splice(i, 1); 
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCantidadCarrito();
  mostrarProductosCarrito();
}


function agregarAcarrito(id) {
    const productoSeleccionado = productos.find(producto=> producto.id == id)
    const prodctoEnElCarrito = carrito.find(producto=>producto.id == id)
    if(prodctoEnElCarrito){
        prodctoEnElCarrito.cantidad += 1;
    }else{
        carrito.push({...productoSeleccionado,cantidad : 1});
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito))
    actualizarCantidadCarrito();
    actualizarCantidadCarrito();
    mostrarProductosCarrito()
}

function eliminarProducto(i) {
  carrito.splice(i, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCantidadCarrito();
  mostrarProductosCarrito();
}


function cartToggle() {
    cartContainer.classList.toggle("visible")
}

function renderizarUsuario(){
  user_span.innerText = usuario;
}

function volverAtras(){
  localStorage.removeItem("usuario");
  localStorage.removeItem("carrito")
  window.location.href="login.html"
}

function validarUsuario(){
  if(!usuario){
    window.location.href="login.html"
  }
}

function actualizarCantidadCarrito() {
  const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  const cartTotal = document.getElementById("cart_total");
  cartTotal.textContent = `Total: $${total} `;
}

function vaciarCarrito() {
  if (confirm("¿Seguro que quieres vaciar el carrito?")) {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarProductosCarrito();
    actualizarCantidadCarrito();
  }
}




categoria.addEventListener("change", filtrarProductos)
cartButton.addEventListener("click",cartToggle)
boton_atras.addEventListener("click",volverAtras)
boton_vaciar.addEventListener("click",vaciarCarrito)


function init() {
   validarUsuario()
    llamarProductos()
    mostrarProductosCarrito()
    renderizarUsuario()
}

init()