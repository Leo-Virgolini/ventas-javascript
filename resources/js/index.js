class Producto {
    constructor(id, nombre, precio, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }

    reducirStock(cantidad) {
        this.stock -= cantidad;
    }
}

class Item {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

class Carrito {
    constructor() {
        this.items = [];
    }

    // agrega Item(Producto, cantidad) al array "items" del Carrito
    agregarItem(idProducto, cantidad) {
        obtenerProductos((productos) => {
            const producto = productos.find(producto => producto.id == idProducto);
            if (!producto) {
                Swal.fire({
                    title: 'El producto no existe.',
                    icon: "error"
                });
            } else if (producto.stock > 0 && cantidad > 0 && cantidad <= producto.stock) {
                const item = this.items.find(item => item.producto.id == producto.id);
                if (item) {
                    if (item.cantidad + cantidad > producto.stock) { // si agrego mas cantidad que el stock
                        // item.cantidad = producto.stock;
                        Swal.fire({
                            title: `Tienes ${item.cantidad} en el carrito y el stock máximo es ${producto.stock}.`,
                            icon: 'error',
                            position: 'center',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        item.cantidad += cantidad; // si el Producto ya existe en el carrito le sumo la cantidad
                        sessionStorage.setItem("carrito", JSON.stringify(carrito));
                        actualizarCarrito();
                        Swal.fire({
                            title: "\'" + producto.nombre + "\' x" + cantidad + " sumado al carrito.",
                            icon: 'success',
                            position: 'center',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                } else {
                    this.items.push(new Item(producto, cantidad)); // si no existe lo agrego
                    sessionStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarCarrito();
                    Swal.fire({
                        title: "\'" + producto.nombre + "\' x" + cantidad + " agregado al carrito.",
                        icon: 'success',
                        position: 'center',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } else {
                Swal.fire({
                    title: `El stock máximo es: ${producto.stock}.`,
                    icon: "error"
                });
            }
        });
    }

    modificarCantidad(idProducto, cantidad) {
        obtenerProductos((productos) => {
            const producto = productos.find(producto => producto.id == idProducto);
            if (!producto) {
                Swal.fire({
                    title: 'El producto no existe.',
                    icon: "error"
                });
            } else if (producto.stock > 0 && cantidad > 0 && cantidad <= producto.stock) {
                const item = this.items.find(item => item.producto.id == producto.id);
                if (item) {
                    item.cantidad = cantidad;
                }
                sessionStorage.setItem("carrito", JSON.stringify(carrito));
                mostrarCarritoModal();
                Swal.fire({
                    title: "\'" + producto.nombre + "\' x" + cantidad + " cantidad modificada.",
                    icon: 'success',
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: `El stock máximo es: ${producto.stock}.`,
                    icon: "error"
                });
            }
        });
    }

    quitarItem(idProducto) {
        const index = this.items.findIndex(item => item.producto.id === idProducto);
        if (index > -1) {
            this.items.splice(index, 1);
        } else {
            Swal.fire({
                title: 'El producto no existe.',
                icon: "error"
            });
        }
    }

    calcularTotal() {
        return this.items.reduce((acumulador, item) => acumulador + (item.producto.precio * item.cantidad), 0);
    }

    calcularTotalIva() {
        return this.calcularTotal() * 1.21;
    }

    vaciarCarrito() {
        this.items = [];
    }
}

// busca un producto por su id y lo devuelve, si no existe -> undefined
// function buscarProductoId(idProducto) {
//     if (isNaN(idProducto)) {
//         return undefined;
//     }
//     obtenerProductos((productos) => {
//         let producto = productos.find(producto => producto.id == idProducto);
//         if (!producto) {
//             return undefined;
//         } else
//             return producto;
//     });
// }

function mostrarProductos(productos) {
    const div = document.getElementById("productos");
    div.replaceChildren();
    if (productos?.length > 0) {
        console.log(productos);
        for (let producto of productos) {
            const card = document.createElement("div");
            card.innerHTML = `
                    <div class="col">
                        <div class="card cardProducto d-flex flex-column justify-content-center align-items-center h-100">
                            <div class="card-header-pills">
                                <span class="badge text-bg-info">Novedad</span>
                            </div>
                            <a href="./pages/404.html">
                                <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img-top img-fluid w-100" loading="lazy">
                            </a>
                            <div class="card-body text-center">
                                <h5 class="card-title precio text-success">$${producto.precio}</h5>
                                <p class="card-text">${producto.nombre}</p>
                            </div>
                            <div class="card-footer bg-transparent border-0">
                                <input id="cantidad${producto.id}" value="1" class="text-center" type="number" min="1" max="${producto.stock}" step="1">
                                <a id="agregar${producto.id}" type="button" class="btn btn-primary" href="#">
                                    <i class="fa-solid fa-cart-shopping me-2"></i>Agregar al carrito
                                </a>
                            </div>
                        </div>
                    </div> 
                        `;
            div.appendChild(card);
            // Agregar productos al carrito: 
            const agregarButton = document.getElementById(`agregar${producto.id}`);
            const cantidadInput = document.getElementById(`cantidad${producto.id}`);
            agregarButton.addEventListener("click", () => {
                carrito.agregarItem(producto.id, Number(cantidadInput.value));
            });
        }
    } else {
        const resultados = document.getElementById("resultados");
        resultados.className = "fs-4 fw-bold fst-italic mt-5";
    }
}

function mostrarCarritoModal() {

    const tableBody = document.getElementById("tableCarrito");
    tableBody.replaceChildren();

    if (carrito?.items?.length > 0) {

        for (let item of carrito.items) {
            const row = document.createElement("tr");
            row.innerHTML = `
            <tr>
                <td>
                    <img src="${item.producto.imagen}" class="img-fluid w-25" loading="lazy" alt="${item.producto.nombre}">
                    <p class="mb-0">${item.producto.nombre}</p>
                </td>
                <td>
                    <input id="cantidadCarrito${item.producto.id}" class="text-center" type="number" value="${item.cantidad}" min="1" max="${item.producto.stock}" step="1">
                    <button id="modificarCantidad${item.producto.id}" type="submit" class="btn btn-info"><i class="fa-solid fa-arrows-rotate"></i></button>
                </td>
                <td>$${item.producto.precio}</td>
                <td>$${item.producto.precio * item.cantidad}</td>
                <td><button id="quitar${item.producto.id}" type="submit" class="btn btn-danger"><i class="fa-solid fa-trash-can"></i></button></td>
            </tr>
            `;
            tableBody.appendChild(row);

            // Button para quitar producto del carrito
            const quitarButton = document.getElementById(`quitar${item.producto.id}`);
            quitarButton.addEventListener("click", () => {
                Swal.fire({
                    title: "¿Quitar '" + item.producto.nombre + "'?",
                    icon: "question",
                    confirmButtonText: "Aceptar",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        carrito.quitarItem(item.producto.id);
                        sessionStorage.setItem("carrito", JSON.stringify(carrito));
                        actualizarCarrito();
                        mostrarCarritoModal();
                        Swal.fire({
                            title: "\'" + item.producto.nombre + '\' ha sido quitado del carrito.',
                            icon: "info",
                            position: 'center',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                })
            });
            // Input para modificar cantidad
            const cantidadCarritoInput = document.getElementById(`cantidadCarrito${item.producto.id}`);
            const modificarCantidadButton = document.getElementById(`modificarCantidad${item.producto.id}`);
            modificarCantidadButton.addEventListener("click", () => {
                carrito.modificarCantidad(item.producto.id, Number(cantidadCarritoInput.value));
            });
        }
        const total = document.getElementById("total");
        total.innerHTML = `
        <p class="fs-3 fw-bold text-success">TOTAL=$${carrito.calcularTotal().toFixed(1)}</p>
        <p class="fs-3 fw-bold text-success">TOTAL CON IVA=$${carrito.calcularTotalIva().toFixed(1)}</p>
        <div>
            <button id="pagoButton" type="submit" class="w-50 btn btn-lg btn-primary"><i class="fa-solid fa-money-check me-1"></i>Generar pago</button>
        </div>
         `;

        const pagoButton = document.getElementById("pagoButton");
        pagoButton.addEventListener("submit", (e) => {
            window.location.href = "./pages/carrito.html";
        });
    } else {
        const total = document.getElementById("total");
        total.innerHTML = `
        <p>El carrito está vacío.</p>
        `;
    }
}

function actualizarCarrito() {
    const sessionCarrito = JSON.parse(sessionStorage.getItem("carrito"));
    if (sessionCarrito != null)
        carrito.items = sessionCarrito.items;
    console.log(carrito);

    const span = document.getElementById("itemsCarrito");
    span.innerHTML = carrito?.items?.length;
}

function obtenerProductos(funcion) {
    fetch("./resources/json/productos.json")
        .then((response) => response.json())
        .then((productos) => funcion(productos))
        .catch(error => Swal.fire({
            title: "Se ha producido un error al obtener los productos.",
            icon: "error",
            position: 'center',
            showConfirmButton: false,
            timer: 2000
        }));
}

function buscarProductos(nombreProducto) {
    obtenerProductos((productos) => {
        if (nombreProducto) {
            const productosFiltrados = productos.filter((producto) => producto.nombre.toLowerCase().startsWith(nombreProducto.toLowerCase()));
            mostrarProductos(productosFiltrados);
        } else {
            mostrarProductos(productos);
        }
    });
}

const buscadorInput = document.getElementById("buscadorInput");
const buscadorFormulario = document.getElementById("buscadorFormulario");
buscadorFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    buscarProductos(buscadorInput.value);
});

// const carritoButton = document.getElementById("carritoButton");
// carritoButton.onclick = () => {
//     actualizarCarrito();
//     mostrarCarritoModal();
// };

// Modal del Carrito
const modal = document.getElementById("carritoModal");
// Abrir
const carritoButton = document.getElementById("carritoButton");
carritoButton.onclick = function () {
    modal.style.display = "block";
    mostrarCarritoModal();
}
// Cerrar
const closeButton = document.getElementById("close");
closeButton.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const vaciarButton = document.getElementById("vaciarButton");
vaciarButton.onclick = () => {
    if (carrito?.items?.length > 0) {
        Swal.fire({
            title: "¿Vaciar carrito?",
            icon: "question",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.vaciarCarrito();
                sessionStorage.clear();
                mostrarCarritoModal();
                actualizarCarrito();
                Swal.fire({
                    title: "Carrito vaciado.",
                    icon: "info",
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }
};

obtenerProductos(mostrarProductos);
// Carrito en SessionStorage
const carrito = new Carrito();
actualizarCarrito();
