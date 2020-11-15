"use strict";

//Configuración de la tabla
var config = {
    colnameAlign: 1 ,
    limitLines: 1 ,
    pagination: 1 ,
    callbackScroll: 1 ,
    columns: {
        0 : { name : "id" , id: 1 } ,
        1 : { name : "nombre", size: "10em" } ,
        2 : { name : "edad", size: "2em" , align: ”center” } ,
        3 : { name : "salario", size: "5em" , align: "right" , edit: true } ,
        4 : { name : "estado", size: "3em" , argument : true, visible: true }
    }
};
//Simulación de datos, éstos pueden venir de una consulta a BD
var datos = {
    0: {
        0: "2",
        1: "Juan",
        2: "20",
        3: "1200",
        4: "1"
    },

    1: {
        0: "8",
        1: "Pablo",
        2: "31",
        3: "2000",
        4: "0"
    }
};

window.onload = function () {
    let tabla = new JS_TABLA.main ("600px", "450px", "js_tabla"); //Instancia de tabla

    tabla.setConfig (config); //Seteo de configuración
    //Se configura el método a utilizar para la actualización de campos editables
    tabla.onEdit (function (linea, celda) {
        console.log (linea, celda);

        alert (`Se modificó la línea con id: ${linea.id} y valor: ${celda.innerText}`);
    });

    /*
     * Impresión de datos, éste método recibe de forma opcional un callback
     * que se ejecutará luego de construir cada línea, de esta forma se pueden
     * realizar acciones especiales, crear columnas nuevas, botones o cambiar
     * el color de fondo a partir de argumentos, en caso de requerirlos.
    */
    tabla.lines (datos, function (linea, argumentos) {
        console.log (linea, argumentos);

        switch (argumentos.estado) {
            case "1":
                linea.style.background = "rgb(119, 198, 97)";
            break;

            case "0":
                linea.style.background = "rgb(229, 234, 89)";
            break;
        }
    });
};
