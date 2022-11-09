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
            let producto = productos.find(producto => producto.id == idProducto);
            if (!producto) {
                Swal.fire({
                    title: 'El producto no existe.',
                    icon: "error"
                });
            } else if (producto.stock > 0 && cantidad > 0 && cantidad <= producto.stock) {
                let item;
                if (item = this.items.find(item => item.producto.id == producto.id)) {
                    if (item.cantidad + cantidad > producto.stock) {
                        item.cantidad = producto.stock;
                        Swal.fire({
                            title: "Agregado el stock máximo: " + producto.stock,
                            icon: "info"
                        });
                    } else {
                        item.cantidad += cantidad; // si el Producto ya existe en el carrito le sumo la cantidad
                    }
                } else {
                    this.items.push(new Item(producto, cantidad)); // sino lo agrego
                }
                sessionStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();
                Swal.fire({
                    title: "\'" + producto.nombre + "\' x" + cantidad + " agregado al carrito.",
                    icon: 'success',
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: 'No hay más stock.',
                    icon: "error"
                });
            }
        });
    }

    quitarItem(idProducto) {
        const index = this.items.findIndex(item => {
            return item.producto.id === idProducto;
        });
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
function buscarProductoId(idProducto) {
    if (isNaN(idProducto)) {
        return undefined;
    }
    obtenerProductos((productos) => {
        let producto = productos.find(producto => producto.id == idProducto);
        if (!producto) {
            return undefined;
        } else
            return producto;
    });
}

function mostrarProductos(productos) {
    const div = document.getElementById("productos");
    div.replaceChildren();
    console.log(productos);
    if (productos?.length > 0) {
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
                carrito.agregarItem(producto.id, cantidadInput.value);
            });
        }
    } else {
        div.innerHTML = "No se encontraron productos.";
    }
}

function mostrarCarritoTable() {

    const tableBody = document.getElementById("tableCarrito");
    tableBody.replaceChildren();

    if (carrito?.items?.length > 0) {

        for (let item of carrito.items) {
            const row = document.createElement("tr");
            row.innerHTML = `
            <tr>
                <td>
                    <img src="${item.producto.imagen}" class="img-fluid w-50" loading="lazy" alt="${item.producto.nombre}">
                    <p class="mb-0">${item.producto.nombre}</p>
                </td>
                <td><input class="text-center" type="number" value="${item.cantidad}" min="1" max="${item.producto.stock}" step="1"></td>
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
                        mostrarCarrito();
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
        }
        const total = document.getElementById("total");
        total.innerHTML = `
        <p>TOTAL=$${carrito.calcularTotal()}</p>
        <p>TOTAL CON IVA=$${carrito.calcularTotalIva()}</p>
         `;
    } else {
        const total = document.getElementById("total");
        total.innerHTML = `
        <p>El carrito está vacío.</p>
        `;
    }
}

function mostrarCarritoResumen() {

    const ul = document.getElementById("carritoResumen");
    ul.replaceChildren();

    if (carrito?.items?.length > 0) {

        for (let item of carrito.items) {
            const li = document.createElement("li");
            li.innerHTML = `
            <li class="list-group-item d-flex justify-content-between lh-sm">
                <div>
                    <h6 class="my-0">${item.producto.nombre}</h6>
                    <small class="text-muted">${item.cantidad} x $${item.producto.precio}</small>
                </div>
                <span class="text-muted">$${item.cantidad * item.producto.precio}</span>
            </li>
            `;
            ul.appendChild(li);
        }
        const total = document.createElement("li");
        total.innerHTML = `
        <li class="list-group-item d-flex justify-content-between">
            <span>Total ($)</span>
            <strong>$${carrito.calcularTotal()}</strong>
            <span>Total IVA($)</span>
            <strong>$${carrito.calcularTotalIva()}</strong>
        </li>
        `;
    } else {
        const total = document.getElementById("total");
        total.innerHTML = `
        <p>El carrito está vacío.</p>
        `;
    }
}

function mostrarCarritoAlert() {

    let carritoDiv;
    if (carrito?.items?.length > 0) {
        carritoDiv = `
        <div class="carrito">
            <div class="container-fluid">
                <div class="table-responsive">
                    <table class="table table-light table-striped table-hover align-middle text-center">
                        <thead class="table-dark text-center">
                            <tr>
                                <th scope="col">Artículo</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Subtotal</th>
                                <th scope="col">Quitar</th>
                            </tr>
                        </thead>
                        <tbody id="carrito">
            `;

        for (let item of carrito.items) {
            carritoDiv += `
            <tr>
                <td>
                    <img src="${item.producto.imagen}" class="img-fluid w-50" loading="lazy" alt="${item.producto.nombre}">
                    <p class="mb-0">${item.producto.nombre}</p>
                </td>
                <td><input class="text-center" type="number" value="${item.cantidad}" min="1" max="${item.producto.stock}" step="1"></td>
                <td>$${item.producto.precio}</td>
                <td>$${item.producto.precio * item.cantidad}</td>
                <td><button id="quitar${item.producto.id}" type="submit" class="btn btn-danger"><i class="fa-solid fa-trash-can"></i></button></td>
            </tr>
             `;
            // Button para quitar producto del carrito
            const quitarButton = document.getElementById(`quitar${item.producto.id}`);
            quitarButton.addEventListener("click", () => {
                Swal.fire({
                    title: "¿Quitar " + item.producto.nombre + "?",
                    icon: "question",
                    confirmButtonText: "Aceptar",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        carrito.quitarItem(item.producto.id);
                        sessionStorage.setItem("carrito", JSON.stringify(carrito));
                        actualizarCarrito();
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
        }

        carritoDiv += `
                </tbody>
            </table>
        </div>
        `;
        carritoDiv += `
                <p>TOTAL=$${carrito.calcularTotal()}</p>
                <p>TOTAL CON IVA=$${carrito.calcularTotalIva()}</p>
            </div>
            <div>
                <a href="./pages/carrito.html">
                    PAGAR
                </a>
            </div>
        </div>
        `;
    } else {
        carritoDiv = `
                <p>El carrito está vacío.</p>
            </div>
        </div>
        `;
    }

    Swal.fire({
        title: "Carrito",
        html: carritoDiv
    });
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

function generarPago() {
    Swal.fire({
        title: "¿Realizar pago por $" + carrito.calcularTotalIva() + "?",
        icon: "question",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.vaciarCarrito();
            sessionStorage.clear();
            actualizarCarrito();
            Swal.fire({
                title: "Pago realizado.",
                icon: "success",
                position: 'center',
                showConfirmButton: false,
                timer: 1500
            })
            // redirigir
        }
    })
}

const buscadorInput = document.getElementById("buscadorInput");
const buscadorFormulario = document.getElementById("buscadorFormulario");
buscadorFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    buscarProductos(buscadorInput.value);
});

const carritoButton = document.getElementById("carritoButton");
carritoButton.onclick = () => {
    actualizarCarrito();
    mostrarCarritoAlert();
};

const verCarritoButton = document.getElementById("verButton");
verCarritoButton.onclick = () => {
    actualizarCarrito();
    mostrarCarritoTable();
};

const vaciarButton = document.getElementById("vaciarButton");
vaciarButton.onclick = () => {
    carrito.vaciarCarrito();
    sessionStorage.clear();
    mostrarCarritoTable();
};

const pagoFormulario = document.getElementById("pagoFormulario");
pagoFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    generarPago();
});


// Carrito en SessionStorage
const carrito = new Carrito();
actualizarCarrito();

obtenerProductos(mostrarProductos);



// Carrito.html
mostrarCarritoTable();
mostrarCarritoResumen();