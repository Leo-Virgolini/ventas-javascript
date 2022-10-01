class Producto {
    constructor(id, nombre, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
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
            while (isNaN(cantidad) || cantidad < 1) {
                cantidad = Number(prompt("Ingresa cantidad del producto:"));
                if (isNaN(cantidad) || cantidad < 1)
                    alert("Ingresa un número mayor a 0.");
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
        console.log(this.items);
    }

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

    calcularTotal() {
        return this.items.reduce((acumulador, item) => acumulador + (item.producto.precio * item.cantidad), 0);
    }

    calcularTotalIva() {
        return this.calcularTotal() * 1.21;
    }
}

const productos = [new Producto(1, "Olla", 1000, 100), new Producto(2, "Vaso", 300, 100), new Producto(3, "Cubiertos", 500, 100), new Producto(4, "Jarra", 600, 100), new Producto(5, "Sartén", 900, 100)];

let carrito = new Carrito();
carrito.agregarProductos();
alert("Total a pagar: $" + carrito.calcularTotal() + "\n" +
    "Total con IVA: $" + carrito.calcularTotalIva());


// const agregarProductos = () => {
//     let total = 0;
//     let continuar;
//     let numeroProducto;
//     let cantidad;
//     let carrito = [];
//     do {
//         numeroProducto = undefined;
//         cantidad = undefined;
//         continuar = undefined;
//         while (!(producto = existe(numeroProducto))) {
//             numeroProducto = Number(prompt("Ingresa N° del producto:"));
//             if (!existe(numeroProducto))
//                 alert("Ingresa un número válido.");
//         }
//         while (isNaN(cantidad) || cantidad < 1) {
//             cantidad = Number(prompt("Ingresa cantidad del producto:"));
//             if (isNaN(cantidad) || cantidad < 1)
//                 alert("Ingresa un número mayor a 0.");
//         }
//         carrito.push = productos[numeroProducto - 1];
//         total += productos[numeroProducto - 1] * cantidad;

//         while (continuar != "s" && continuar != "n") {
//             continuar = prompt("¿Desea seguir agregando productos (s/n)?");
//             console.log(continuar);
//             if (continuar != "s" && continuar != "n")
//                 alert("Ingresa 's' o 'n'.");
//         }
//         // console.log(total);
//     } while (continuar == "s");

//     return total;
// }



