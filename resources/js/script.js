const productos = [1000, 300, 500, 600, 900];

const calcularTotal = () => {
    let total = 0;
    let continuar;
    let producto;
    let cantidad;
    do {
        producto = undefined;
        cantidad = undefined;
        continuar = undefined;
        while (isNaN(producto) || producto < 1 || producto > 5) {
            producto = Number(prompt("Ingresa N° del producto:"));
            if (isNaN(producto) || producto < 1 || producto > 5)
                alert("Ingresa un número entre 1 y 5.");
        }
        while (isNaN(cantidad) || cantidad < 1) {
            cantidad = Number(prompt("Ingresa cantidad del producto:"));
            if (isNaN(cantidad) || cantidad < 1)
                alert("Ingresa un número mayor a 0.");
        }
        total += productos[producto - 1] * cantidad;

        while (continuar != "s" && continuar != "n") {
            continuar = prompt("¿Desea seguir agregando productos (s/n)?");
            console.log(continuar);
            if (continuar != "s" && continuar != "n")
                alert("Ingresa 's' o 'n'.");
        }
        // console.log(total);
    } while (continuar == "s");

    return total;
}

alert("Total a pagar: $" + calcularTotal());
