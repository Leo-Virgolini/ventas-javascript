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

        producto = buscarProducto(Number(idProducto));
        if (!producto) {
            Swal.fire('El producto no existe.');
            return;
        }

        if (item = this.items.find(item => item.producto.id == producto.id)) {
            if (item.cantidad + cantidad >= producto.stock) {
                item.cantidad = producto.stock;
                Swal.fire("Stock máximo alcanzado.");
            } else
                item.cantidad += cantidad; // si el Producto ya existe en el carrito le sumo la cantidad
        }
        else {
            this.items.push(new Item(producto, cantidad)); // sino lo agrego
        }
    }

    mostrarListado() {
        return this.items.reduce((acumulador, item) => acumulador + "-" + item.producto.nombre + " x" + item.cantidad + "= $" + item.producto.precio * item.cantidad + "\n", "");
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
function buscarProducto(id) {
    if (isNaN(id)) {
        return undefined;
    }
    let productos = JSON.parse(localStorage.getItem("productos"));
    let producto = productos.find(producto => producto.id == id);
    if (!producto) {
        return undefined;
    }
    else
        return producto;
}

function mostrarProductos() {
    let productos = JSON.parse(localStorage.getItem("productos"));
    const div = document.getElementById("productos");
    div.replaceChildren();
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
            <a id="button${producto.id}" type="button" class="btn btn-primary" href="#">
                <i class="fa-solid fa-cart-shopping me-2"></i>Agregar al carrito
            </a>
        </div>
    </div>
</div> 
    `;
        div.appendChild(card);

        //Agregar productos al carrito: 
        const agregarButton = document.getElementById(`button${producto.id}`);
        agregarButton.addEventListener("click", () => {
            // carrito.agregarItem(producto.id, Swal.fire({
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
            // }));
            carrito.agregarItem(producto.id, 1);
            Swal.fire("\'" + producto.nombre + '\' agregado al carrito.');
            sessionStorage.setItem("carrito", JSON.stringify(carrito));
        })
    }
}

// Productos en LocalStorage
localStorage.setItem("productos", JSON.stringify([
    new Producto(1, "Panera", 1000, 30, "./resources/images/productos/1.png"),
    new Producto(2, "Jarra", 300, 100, "./resources/images/productos/2.png"),
    new Producto(3, "Batidora", 500, 200, "./resources/images/productos/3.png"),
    new Producto(4, "Taza de Café", 600, 80, "./resources/images/productos/4.png"),
    new Producto(5, "Taza de Café", 900, 50, "./resources/images/productos/5.png"),
    new Producto(6, "Tupper", 700, 60, "./resources/images/productos/6.png"),
    new Producto(7, "Plato", 350, 70, "./resources/images/productos/7.png"),
    new Producto(8, "Cafetera", 800, 60, "./resources/images/productos/8.png"),
    new Producto(9, "Termo plástico", 1100, 40, "./resources/images/productos/9.png"),
    new Producto(10, "Termo", 1500, 50, "./resources/images/productos/10.png"),
    new Producto(11, "Coctelería", 2000, 55, "./resources/images/productos/11.png"),
    new Producto(12, "Ollas", 3000, 70, "./resources/images/productos/12.png")
]));

// Carrito en SessionStorage
let carrito = new Carrito();
let sessionCarrito = JSON.parse(sessionStorage.getItem("carrito"));
if (sessionCarrito != null)
    carrito.items = sessionCarrito.items;

console.log(carrito);

function mostrarCarrito() {
    let carrito = JSON.parse(sessionStorage.getItem("carrito"));

    const div = document.getElementById("carrito");
    console.log(carrito);
    div.replaceChildren();
    if (carrito != null) {
        for (let item of carrito.items) {
            const card = document.createElement("div");
            card.innerHTML = `
    <div>
                <img src="${item.producto.imagen}" alt="${item.producto.nombre}" class="card-img-top img-fluid w-100" loading="lazy">
                <p class="card-text">${item.producto.nombre}</p>
                <h5 class="card-title precio text-success">$${item.producto.precio} x${item.cantidad}</h5>
    </div> 
        `;
            div.appendChild(card);
        }
        // const total = document.createElement("div");
        // total.innerHTML = `
        // <div>
        //     TOTAL=$ ${carrito.calcularTotalIva()}
        // </div> 
        //     `;
        // div.appendChild(total);
    }
}

const verCarritoButton = document.getElementById("ver");
verCarritoButton.onclick = () => {
    mostrarCarrito();
};

const vaciarButton = document.getElementById("vaciar");
vaciarButton.onclick = () => {
    carrito.vaciarCarrito();
    sessionStorage.clear();
    mostrarCarrito();
};

mostrarProductos();