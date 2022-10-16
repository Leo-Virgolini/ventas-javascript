class Producto {
    constructor(id, nombre, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
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
    agregarItems() {
        let continuar;
        do {
            continuar = undefined;
            let producto;
            let cantidad;
            let item;
            while (!producto) {
                producto = buscarProducto(Number(prompt("Ingresa N° del producto:")));
                if (!producto) {
                    alert("El producto no existe.");
                }
            }
            while (isNaN(cantidad) || cantidad < 1 || cantidad > producto.stock) {
                cantidad = Number(prompt("Ingresa cantidad del producto:"));
                if (isNaN(cantidad) || cantidad < 1)
                    alert("Ingresa un número mayor a 0.");
                else if (cantidad > producto.stock)
                    alert("Ingresa un número menor al stock: " + producto.stock);
            }

            if (item = this.items.find(item => item.producto.id == producto.id)) {
                if (item.cantidad + cantidad >= stock) {
                    item.cantidad = producto.stock;
                    alert("Stock máximo alcanzado.");
                } else
                    item.cantidad += cantidad; // si el Producto ya existe en el carrito le sumo la cantidad
            }
            else
                this.items.push(new Item(producto, cantidad)); // sino lo agrego

            while (continuar != "s" && continuar != "n") {
                continuar = prompt("¿Desea seguir agregando productos (s/n)?");
                if (continuar != "s" && continuar != "n")
                    alert("Ingresa 's' o 'n'.");
            }
        } while (continuar == "s");
    }

    // devuelve un listado de los productos agregados al carrito
    mostrarListado() {
        return this.items.reduce((acumulador, item) => acumulador + "-" + item.producto.nombre + " x" + item.cantidad + "= $" + item.producto.precio * item.cantidad + "\n", "");
    }
    // devuelve el total del precio de todos los productos del carrito
    calcularTotal() {
        return this.items.reduce((acumulador, item) => acumulador + (item.producto.precio * item.cantidad), 0);
    }
    // devuelve el total más el IVA
    calcularTotalIva() {
        return this.calcularTotal() * 1.21;
    }
}

// ABM de Producto
function altaProducto() {
    let producto = undefined;
    do {
        let id = undefined;
        do {
            id = parseInt(prompt("Ingrese el id del producto:"));
        } while (isNaN(id));
        producto = buscarProducto(id);
        if (!producto) {
            let productoNuevo = new Producto(id);
            do {
                productoNuevo.nombre = prompt("Ingrese el nombre del producto:");
            } while (!productoNuevo.nombre);
            do {
                productoNuevo.precio = parseInt(prompt("Ingrese el precio del producto:"));
            } while (isNaN(productoNuevo.precio));
            do {
                productoNuevo.stock = parseInt(prompt("Ingrese el stock del producto:"));
            } while (isNaN(productoNuevo.stock));
            let productos = JSON.parse(localStorage.getItem("productos"));
            productos.push(productoNuevo);
            localStorage.setItem("productos", JSON.stringify(productos));
            actualizarLista();
        } else {
            alert("El id ya existe.")
        }
    } while (producto);
}

function bajaProducto() {
    let producto = undefined;
    while (!producto) {
        let id = undefined;
        do {
            id = parseInt(prompt("Ingrese el id del producto:"));
        } while (isNaN(id));
        producto = buscarProducto(id);
        if (producto) {
            let productos = JSON.parse(localStorage.getItem("productos"));
            for (let i = 0; i < productos.length; i++) {
                if (productos[i].id == producto.id) {
                    productos.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("productos", JSON.stringify(productos));
            actualizarLista();
        } else {
            alert("El producto no existe.");
        }
    }
}

function modificacionProducto() {
    let producto = undefined;
    while (!producto) {
        let id = undefined;
        do {
            id = parseInt(prompt("Ingrese el id del producto:"));
        } while (isNaN(id));
        producto = buscarProducto(id);
        if (producto) {
            do {
                producto.nombre = prompt("Ingrese el nombre del producto:");
            } while (!producto.nombre);
            do {
                producto.precio = parseInt(prompt("Ingrese el precio del producto:"));
            } while (isNaN(producto.precio));
            do {
                producto.stock = parseInt(prompt("Ingrese el stock del producto:"));
            } while (isNaN(producto.stock));
            let productos = JSON.parse(localStorage.getItem("productos"));
            for (let i = 0; i < productos.length; i++) {
                if (productos[i].id == producto.id) {
                    productos[i] = producto;
                    break;
                }
            }
            localStorage.setItem("productos", JSON.stringify(productos));
            actualizarLista();
        } else {
            alert("El producto no existe.");
        }
    }
}

// busca un producto por su id y lo devuelve, si no existe -> undefined
function buscarProducto(id) {
    if (isNaN(id)) {
        alert("Ingresa un número válido.");
        return undefined;
    }
    let productos = JSON.parse(localStorage.getItem("productos"));
    let producto = productos.find(producto => producto.id == id);
    if (!producto) {
        // alert("El producto no existe.");
        return undefined;
    }
    else
        return producto;
}

function actualizarLista() {
    const ol = document.getElementById("productos");
    ol.replaceChildren();
    let productos = JSON.parse(localStorage.getItem("productos"));
    for (let producto of productos) {
        let item = document.createElement("li");
        item.innerText = `${producto.id}: ${producto.nombre} - $${producto.precio} - Stock: ${producto.stock}`;
        ol.appendChild(item);
    }
}

// Productos en LocalStorage
localStorage.setItem("productos", JSON.stringify([
    new Producto(1, "Olla", 1000, 30),
    new Producto(2, "Vaso", 300, 100),
    new Producto(3, "Cubiertos", 500, 200),
    new Producto(4, "Jarra", 600, 80),
    new Producto(5, "Sartén", 900, 50)
]));

const carrito = new Carrito();

// Buttons
const altaButton = document.getElementById("alta");
altaButton.onclick = () => (altaProducto());

const bajaButton = document.getElementById("baja");
bajaButton.onclick = () => (bajaProducto());

const modificacionButton = document.getElementById("modificacion");
modificacionButton.onclick = () => (modificacionProducto());

const agregarButton = document.getElementById("agregar");
agregarButton.onclick = () => {
    carrito.agregarItems();
};

const verCarritoButton = document.getElementById("ver");
verCarritoButton.onclick = () => {
    alert("CARRITO:\n" +
        carrito.mostrarListado() +
        "--------------------------------------------\n" +
        "Total= $" + carrito.calcularTotal() + "\n" +
        "Total con IVA(21%)= $" + carrito.calcularTotalIva());
};