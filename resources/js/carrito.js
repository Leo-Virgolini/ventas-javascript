class Carrito {
    constructor() {
        this.items = [];
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
        return this.items.reduce((acumulador, item) => acumulador + (item.producto.precio * item.cantidad), 0).toFixed(1);
    }

    calcularTotalIva() {
        return (this.calcularTotal() * 1.21).toFixed(1);
    }

    vaciarCarrito() {
        this.items = [];
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
        const totalLi = document.createElement("li");
        totalLi.innerHTML = `
        <li class="list-group-item d-flex justify-content-between">
            <span>Total ($)</span>
            <strong>$${carrito.calcularTotal()}</strong>
            <span>Total IVA($)</span>
            <strong>$${carrito.calcularTotalIva()}</strong>
        </li>
        `;
        ul.appendChild(totalLi);

        const total = document.getElementById("total");
        total.innerHTML = `
        <p class="text-success d-flex flex-column">
            <span>Total <strong>$${carrito.calcularTotal()}</strong></span>
            <span>Total IVA <strong>$${carrito.calcularTotalIva()}</strong></span>
        </p>
        `;
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

const pagoFormulario = document.getElementById("pagoFormulario");
pagoFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    generarPago();
});

// Ejecución
const carrito = new Carrito();
actualizarCarrito();
mostrarCarritoTable();
mostrarCarritoResumen();