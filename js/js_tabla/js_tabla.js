"use strict";
/*
 * FECHA: 2019/03/06
 * AUTOR: Julio Alejandro Santos Corona
 * CORREO: jualesac@yahoo.com
 * TÍTULO: js_tabla.js
 *
 * Descripción: Gadget para la creación de tablas.
*/

var JS_TABLA = {
    SKULL: function (width, height, id) {
        id = id || "js_tabla";

        let tabla;
        let classTabla;
        let alphaW;

        tabla = _js.id (id);
        classTabla = tabla.className;
        alphaW = 19;

        tabla.style.width = width;
        tabla.style.height = height;

        _js.createElement ("ul").setAttributes ({
            class: `${classTabla}_columna`,
            id: `${id}_columna`
        }).appendTo (tabla);

        _js.createElement ("div").setAttributes ({
            class: `${classTabla}_lineas`,
            id: `${id}_lineas`
        }).appendTo (tabla);



        this.getClass = function () {
            return classTabla;
        };


        this.columnas = function (config) {
            let columnas;
            let cadena;
            let ancho;

            columnas = _js.id (`${id}_columna`);
            cadena = "";
            ancho = alphaW;

            columnas.innerHTML = "";
            //En caso de ser un id o un argumento
            for (let col in config) {
                if ((config[col].id && config[col].id == 1) || (config[col].argument && config[col].argument == 1)) {
                    continue;
                }

                columnas.innerHTML += `<li style="width: ${config[col].size};"><span>${config[col].name}</span></li>`;
                ancho += Number (columnas.lastChild.clientWidth);
            }

            columnas.style.width = `${ancho}px`;
            _js.id (`${id}_lineas`).style.width = `${ancho}px`;
        };


        this.lineas = function (config, datos, callback, agregar) {
            if (typeof (callback) === "boolean") {
                agregar = callback;
                callback = undefined;
            }

            callback = callback || function () { return; };
            agregar = agregar || false;

            let tabla;
            let lineas;
            let linea;
            let atributos = {};
            let argumentos = {};
            let c;

            tabla = _js.id (`${id}_lineas`).parentNode;
            lineas = _js.createElement ("div").setAttributes ({
                class: `${classTabla}_lineas`,
                style: `width: ${_js.id (`${id}_lineas`).style.width};`,
                id: `${id}_lineas`
            });
            c = 0;

            for (let combo in datos) {
                c = 0;

                linea = _js.createElement ("ul").appendTo (lineas);

                for (let celda in datos[combo]) {
                    //En caso de ser un id o un argumento
                    if ((config[c].id && config[c].id == 1) || (config[c].argument && config[c].argument == 1)) {
                        if (config[c].id) {
                            linea.id = datos[combo][celda];
                        }

                        if (config[c].argument) {
                            argumentos[config[c].name] = datos[combo][celda];
                        }

                        c++;
                        continue;
                    }
                    //Para configuración estandar se imprime
                    atributos.style = `width: ${config[c].size};`;

                    if (config[c].edit && config[c].edit == 1) {
                        atributos.class = `${classTabla}_edicion`;
                    }

                    _js.createElement ("span").appendTo (
                        _js.createElement ("li").setAttributes (atributos).appendTo (linea)
                    ).textContent = datos[combo][celda];

                    atributos = {};
                    c++;
                }

                callback (linea, argumentos);

                if (agregar) {
                    tabla.childNodes[1].appendChild (linea);
                }
            }

            if (!agregar) {
                tabla.replaceChild (lineas, tabla.childNodes[1]);
            }
            //_js.id (`${id}_lineas`).innerHTML = lineas.innerHTML;
        };
    },

    TABLA: function (sWidth, sHeight, id) {
        JS_TABLA.SKULL.call (this,sWidth, sHeight, id);

        id = id || "js_tabla";

        _js.id (`${id}_lineas`).event ("click", editar);

        let configuracion;
        let callbackInput = function () { return; };
        let valorEdicion = undefined;
        let getClass;

        getClass = this.getClass;

        this.setConfig = function (config) {
            configuracion = config;

            this.columnas (configuracion);
        };

        this.print = function (datos, callback, agregar) {
            this.lineas (configuracion, datos, callback, agregar);

            _js.id (`${id}_lineas`).event ("click", editar);
        };

        this.setEdition = function (callback) {
            if (!callback instanceof Function) {
                throw new TypeError (`Se esperaba una función como argumento.`);
            }

            callbackInput = callback;
        };

        function editar (elemento) {
            let tag;
            let objeto;
            let input;

            tag = elemento.target.tagName;
            objeto = (tag == "LI") ? elemento.target : ((tag == "SPAN") ? elemento.target.parentNode : undefined);

            if (!objeto || !/_edicion$/.test (objeto.className)) {
                return;
            }

            input = _js.createElement ("input").setAttributes ({
                class: `${objeto.className}_on`
            });

            input.value = objeto.childNodes[0].innerText;
            valorEdicion = input.value;

            _js.id (objeto).rmStyle (`${getClass ()}_edicion`);
            objeto.replaceChild (input, objeto.childNodes[0]);

            //input.addEventListener ("change", setInput);
            input.addEventListener ("blur", setInput);
            input.addEventListener ("keydown", setInput);
            input.focus ();
        }

        function setInput (elemento) {
            let input;
            let li;
            let span;

            if (elemento.key && (elemento.key !== "Enter" && elemento.key !== "Escape")) {
                return;
            }

            input = elemento.target;
            li = input.parentNode;
            span = _js.createElement ("span");

            input.removeEventListener ("blur", setInput);
            input.removeEventListener ("keydown", setInput);

            if (elemento.key && elemento.key === "Escape") {
                input.value = valorEdicion;
            }

            span.innerText = input.value;

            _js.id (li).addStyle (`${getClass ()}_edicion`);
            li.replaceChild (span, input);

            if (input.value != valorEdicion) {
                callbackInput (li.parentNode, span);
            }

            valorEdicion = undefined;
        }
    }
};
