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

        let producto;
        let item;

        producto = buscarProductoId(Number(idProducto));
        if (!producto) {
            Swal.fire({
                title: 'El producto no existe.',
                icon: error
            });
            return;
        }

        if (item = this.items.find(item => item.producto.id == producto.id)) {
            if (item.cantidad + cantidad >= producto.stock) {
                item.cantidad = producto.stock;
                Swal.fire({
                    title: "Stock máximo alcanzado.",
                    icon: info
                });
            } else
                item.cantidad += cantidad; // si el Producto ya existe en el carrito le sumo la cantidad
        }
        else {
            this.items.push(new Item(producto, cantidad)); // sino lo agrego
        }
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
                icon: error
            });
        }
    }

    // mostrarListado() {
    //     return this.items.reduce((acumulador, item) => acumulador + "-" + item.producto.nombre + " x" + item.cantidad + "= $" + item.producto.precio * item.cantidad + "\n", "");
    // }

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
    // const productos = JSON.parse(localStorage.getItem("productos"));
    const productos = obtenerProductos();
    let producto = productos.find(producto => producto.id == idProducto);
    if (!producto) {
        return undefined;
    } else
        return producto;
}

function mostrarProductos(productosPromise) {
    const div = document.getElementById("productos");
    div.replaceChildren();
    productosPromise.then((productos) => {
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
                <a id="agregar${producto.id}" type="button" class="btn btn-primary" href="#">
                    <i class="fa-solid fa-cart-shopping me-2"></i>Agregar al carrito
                </a>
            </div>
        </div>
    </div> 
        `;
                div.appendChild(card);

                //Agregar productos al carrito: 
                const agregarButton = document.getElementById(`agregar${producto.id}`);
                agregarButton.addEventListener("click", () => {
                    // const { value: cantidad } = Swal.fire({
                    //     title: 'Cantidad',
                    //     icon: 'question',
                    //     input: 'range',
                    //     inputLabel: 'Cantidad',
                    //     inputAttributes: {
                    //         min: 1,
                    //         max: producto.stock,
                    //         step: 1
                    //     },
                    //     inputValue: 1
                    // });
                    carrito.agregarItem(producto.id, 1);
                    Swal.fire({
                        title: "\'" + producto.nombre + '\' agregado al carrito.',
                        icon: 'success'
                    });
                    sessionStorage.setItem("carrito", JSON.stringify(carrito));
                    mostrarCarrito();
                });
            }
        } else {
            div.innerHTML = "No se encontraron productos.";
        }
    });
}

function mostrarCarrito() {
    const sessionCarrito = JSON.parse(sessionStorage.getItem("carrito"));
    if (sessionCarrito != null)
        carrito.items = sessionCarrito.items;

    const span = document.getElementById("itemsCarrito");
    span.innerHTML = carrito?.items?.length;

    const tableBody = document.getElementById("carrito");
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
                    title: "¿Quitar " + item.producto.nombre + "?",
                    icon: "question",
                    // background: "#FDEBD0",
                    // backdrop: "#B7950B",
                    confirmButtonText: "Aceptar",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar"
                    // cancelButtonColor: "#B7950b",
                    // confirmButtonColor: "#B7950b"
                }).then((result) => {
                    if (result.isConfirmed) {
                        carrito.quitarItem(item.producto.id);
                        sessionStorage.setItem("carrito", JSON.stringify(carrito));
                        mostrarCarrito();
                        Swal.fire({
                            title: "\'" + item.producto.nombre + '\' ha sido quitado del carrito.',
                            icon: "info"
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

function mostrarCarritoAlert() {
    const sessionCarrito = JSON.parse(sessionStorage.getItem("carrito"));
    if (sessionCarrito != null)
        carrito.items = sessionCarrito.items;

    let carritoDiv = "";
    if (carrito?.items?.length > 0) {

        carritoDiv += `
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
                    background: "#FDEBD0",
                    backdrop: "#B7950B",
                    confirmButtonText: "Aceptar",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    cancelButtonColor: "#B7950b",
                    confirmButtonColor: "#B7950b"
                }).then((result) => {
                    if (result.isConfirmed) {
                        carrito.quitarItem(item.producto.id);
                        sessionStorage.setItem("carrito", JSON.stringify(carrito));
                        mostrarCarrito();
                        Swal.fire({
                            title: "\'" + item.producto.nombre + '\' ha sido quitado del carrito.',
                            icon: "info",
                            background: "#FDEBD0"
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
        </div>
            `;
    } else {
        carritoDiv += `
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

function buscarProductos(nombreProducto) {
    // const productos = JSON.parse(localStorage.getItem("productos"));
    const productos = obtenerProductos();
    const productosFiltrados = productos.filter((producto) => producto.nombre.toLowerCase().startsWith(nombreProducto.toLowerCase()));
    mostrarProductos(productosFiltrados);
}

const verCarritoButton = document.getElementById("verButton");
verCarritoButton.onclick = () => {
    mostrarCarrito();
};

const vaciarButton = document.getElementById("vaciarButton");
vaciarButton.onclick = () => {
    carrito.vaciarCarrito();
    sessionStorage.clear();
    mostrarCarrito();
};

const buscarInput = document.getElementById("buscadorInput");
const formulario = document.getElementById("buscarFormulario");
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    buscarProductos(buscarInput.value);
});

const carritoButton = document.getElementById("carritoButton");
carritoButton.onclick = () => {
    mostrarCarritoAlert();
};

// Productos en LocalStorage
// localStorage.setItem("productos", JSON.stringify([
//     new Producto(1, "Panera", 1000, 30, "./resources/images/productos/1.png"),
//     new Producto(2, "Jarra", 300, 100, "./resources/images/productos/2.png"),
//     new Producto(3, "Batidora", 500, 200, "./resources/images/productos/3.png"),
//     new Producto(4, "Taza de Café", 600, 80, "./resources/images/productos/4.png"),
//     new Producto(5, "Taza de Café", 900, 50, "./resources/images/productos/5.png"),
//     new Producto(6, "Tupper", 700, 60, "./resources/images/productos/6.png"),
//     new Producto(7, "Plato", 350, 70, "./resources/images/productos/7.png"),
//     new Producto(8, "Cafetera", 800, 60, "./resources/images/productos/8.png"),
//     new Producto(9, "Termo plástico", 1100, 40, "./resources/images/productos/9.png"),
//     new Producto(10, "Termo", 1500, 50, "./resources/images/productos/10.png"),
//     new Producto(11, "Coctelería", 2000, 55, "./resources/images/productos/11.png"),
//     new Producto(12, "Ollas", 3000, 70, "./resources/images/productos/12.png")
// ]));

let productosPromise = fetch("./resources/json/productos.json")
    .then((response) => response.json())
    .then((productos) => {
        return productos;
    });

// Carrito en SessionStorage
const carrito = new Carrito();
const sessionCarrito = JSON.parse(sessionStorage.getItem("carrito"));
if (sessionCarrito != null)
    carrito.items = sessionCarrito.items;

console.log(carrito);

// mostrarProductos(JSON.parse(localStorage.getItem("productos")));
mostrarCarrito();
mostrarProductos(productosPromise);
