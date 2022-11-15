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


// Carrito.html
mostrarCarritoTable();
mostrarCarritoResumen();