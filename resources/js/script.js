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

    // agrega Item(Producto, cantidad) al array "items" del objeto Carrito
    agregarItem() {
        let continuar;
        do {
            continuar = undefined;
            let producto;
            let cantidad;
            let item;
            while (!producto) {
                producto = buscarProducto(Number(prompt("Ingresa N° del producto:")));
            }
            while (isNaN(cantidad) || cantidad < 1 || cantidad > producto.stock) {
                cantidad = Number(prompt("Ingresa cantidad del producto:"));
                if (isNaN(cantidad) || cantidad < 1)
                    alert("Ingresa un número mayor a 0.");
                else if (cantidad > producto.stock)
                    alert("Ingresa un número menor al stock: " + producto.stock);
            }

            if (item = this.items.find(item => item.producto.id == producto.id)) // si el Producto ya existe en el carrito le sumo la cantidad
                item.cantidad += cantidad;
            else
                this.items.push(new Item(producto, cantidad)); // sino lo agrego

            while (continuar != "s" && continuar != "n") {
                continuar = prompt("¿Desea seguir agregando productos (s/n)?");
                if (continuar != "s" && continuar != "n")
                    alert("Ingresa 's' o 'n'.");
            }
        } while (continuar == "s");
        // console.log(this.items);
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

// Listado de productos
const productos = [new Producto(1, "Olla", 1000, 30), new Producto(2, "Vaso", 300, 100), new Producto(3, "Cubiertos", 500, 200), new Producto(4, "Jarra", 600, 80), new Producto(5, "Sartén", 900, 50)];

// ABM de Producto
function altaProducto() {
    let id = parseInt(prompt("Ingrese el id del producto:"));
    if (!buscarProducto(id)) {
        let nombre = prompt("Ingrese el nombre del producto:");
        let precio = parseInt(prompt("Ingrese el precio del producto:"));
        let stock = parseInt(prompt("Ingrese el stock del producto:"));
        let producto = new Producto(id, nombre, precio, stock);
        productos.push(producto);
        console.log(productos);
    } else {
        alert("El id ya existe.")
    }
}

function bajaProducto() {
    let id = parseInt(prompt("Ingrese el id del producto:"));
    let producto = buscarProducto(id);
    if (producto) {
        let index = productos.indexOf(producto);
        productos.splice(index, 1);
        console.log(productos);
    } else {
        alert("El id no existe.")
    }
}

function modificacionProducto() {
    let id = parseInt(prompt("Ingrese el id del producto:"));
    let producto = buscarProducto(id);
    if (producto) {
        producto.nombre = prompt("Ingrese el nombre del producto:");
        producto.precio = parseInt(prompt("Ingrese el precio del producto:"));
        producto.stock = parseInt(prompt("Ingrese el stock del producto:"));
        console.log(productos);
    } else {
        alert("El id no existe.")
    }
}

// busca un producto por su id y lo devuelve, si no existe -> undefined
function buscarProducto(id) {
    if (isNaN(id)) {
        alert("Ingresa un número válido.");
        return undefined;
    }
    let producto = productos.find(producto => producto.id == id);
    if (!producto) {
        alert("El producto no existe.");
        return undefined;
    }
    else
        return producto;
}

// Ejecución
let menu;
do {
    menu = prompt("Ingresa:\n" +
        "1: Alta de producto\n" +
        "2: Baja de producto\n" +
        "3: Modificación de producto\n" +
        "4: Agregar productos al carrito");
    switch (menu) {
        case "1":
            altaProducto();
            break;
        case "2":
            bajaProducto();
            break;
        case "3":
            modificacionProducto();
            break;
        case "4":
            let carrito = new Carrito();
            carrito.agregarItem();
            alert("CARRITO:\n" +
                carrito.mostrarListado() +
                "--------------------------------------------\n" +
                "Total= $" + carrito.calcularTotal() + "\n" +
                "Total con IVA(21%)= $" + carrito.calcularTotalIva());
            break;
    }
} while (menu != "1" && menu != "2" && menu != "3" && menu != "4");


