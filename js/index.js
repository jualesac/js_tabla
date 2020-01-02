"use strict";

//Configuración de la tabla
var config = {
    0: { id: 1 },
    1: { name: "argumento1", argument: 1 },
    2: { name: "columna1", size: "10em" },
    3: { name: "columna2", size: "15em", edit: 1 },
    4: { name: "columna3", size: "8em" },
    5: { name: "columna4", size: "9em" },
    6: { name: "columna5", size: "18em", edit: 1 },
    7: { name: "argumento2", argument: 1 },
};
//Simulación de datos, éstos pueden venir de una consulta a BD
var datos = {
    0: {
        0: "2",
        1: "1",
        2: "Valor1",
        3: "Valor2",
        4: "Valor3",
        5: "Valor4",
        6: "Valor5",
        7: "argumento"
    },

    1: {
        0: "8",
        1: "2",
        2: "Valor1",
        3: "Valor2",
        4: "Valor3",
        5: "Valor4",
        6: "Valor5",
        7: "argumento"
    },

    2: {
        0: "12",
        1: "2",
        2: "Valor1",
        3: "Valor2",
        4: "Valor3",
        5: "Valor4",
        6: "Valor5",
        7: "argumento"
    },

    3: {
        0: "13",
        1: "1",
        2: "Valor1",
        3: "Valor2",
        4: "Valor3",
        5: "Valor4",
        6: "Valor5",
        7: "argumento"
    },

    4: {
        0: "59",
        1: "2",
        2: "Valor1",
        3: "Valor2",
        4: "Valor3",
        5: "Valor4",
        6: "Valor5",
        7: "argumento"
    },

    5: {
        0: "78",
        1: "3",
        2: "Valor1",
        3: "Valor2",
        4: "Valor3",
        5: "Valor4",
        6: "Valor5",
        7: "argumento"
    },

    6: {
        0: "79",
        1: "2",
        2: "Valor1",
        3: "Valor2",
        4: "Valor3",
        5: "Valor4",
        6: "Valor5",
        7: "argumento"
    }
};

window.onload = function () {
    let tabla = new JS_TABLA.TABLA (600, 450, "js_tabla"); //Instancia de tabla

    tabla.setConfig (config); //Seteo de configuración
    //Se configura el método a utilizar para la actualización de campos editables
    tabla.setEdition (function (linea, celda) {
        console.log (linea, celda);

        alert (`Se modificó la línea con id: ${linea.id} y valor: ${celda.innerText}`);
    });

    /*
     * Impresión de datos, éste método recibe de forma opcional un callback
     * que se ejecutará luego de construir cada línea, de esta forma se pueden
     * realizar acciones especiales, crear columnas nuevas, botones o cambiar
     * el color de fondo a partir de argumentos, en caso de requerirlos.
    */
    tabla.print (datos, function (linea, argumentos) {
        console.log (linea, argumentos);

        switch (argumentos.argumento1) {
            case "1":
                linea.style.background = "rgb(119, 198, 97)";
            break;

            case "3":
                linea.style.background = "rgb(229, 234, 89)";
            break;
        }
    });
};
