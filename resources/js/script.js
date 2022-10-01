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

    // agrega productos al array "items" del objeto Carrito realizando validaciones
    agregarProductos() {
        let continuar;
        do {
            continuar = undefined;
            let producto;
            let cantidad;
            let item;
            while (!producto) {
                producto = this.buscarProducto(Number(prompt("Ingresa N° del producto:")));
            }
            while (isNaN(cantidad) || cantidad < 1 || cantidad > producto.stock) {
                cantidad = Number(prompt("Ingresa cantidad del producto:"));
                if (isNaN(cantidad) || cantidad < 1)
                    alert("Ingresa un número mayor a 0.");
                else if (cantidad > producto.stock)
                    alert("Ingresa un número menor al stock: " + producto.stock);
            }

            if (item = this.items.find(item => item.producto.id == producto.id))
                item.cantidad += cantidad;
            else
                this.items.push(new Item(producto, cantidad));

            while (continuar != "s" && continuar != "n") {
                continuar = prompt("¿Desea seguir agregando productos (s/n)?");
                if (continuar != "s" && continuar != "n")
                    alert("Ingresa 's' o 'n'.");
            }
        } while (continuar == "s");
        // console.log(this.items);
    }
    // busca un producto por su id y lo devuelve, si no existe -> undefined
    buscarProducto(numeroProducto) {
        if (isNaN(numeroProducto)) {
            alert("Ingresa un número válido.");
            return undefined;
        }
        let producto = productos.find(producto => producto.id == numeroProducto);
        if (!producto) {
            alert("El producto no existe.");
            return undefined;
        }
        else
            return producto;
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

// Ejecución
let carrito = new Carrito();
carrito.agregarProductos();
alert("CARRITO:\n" +
    carrito.mostrarListado() +
    "--------------------------------------------\n" +
    "Total= $" + carrito.calcularTotal() + "\n" +
    "Total con IVA(21%)= $" + carrito.calcularTotalIva());



