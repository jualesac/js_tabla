"use strict";
/*
 * FECHA: 2018/10/15
 * AUTOR: Julio Alejandro Santos Corona
 * CORREO: jasantos@santander.com.mx | jualesac@yahoo.com
 * TÍTULO: _js.js
 * VERSIÓN: 1.5.0 (Versión a la última actualización)
 *
 * Descripción: Librería de funciones _js.
 *
 * Reedición: 2019/03/25
 * Descripción: Se mejora el rendimiento y se amplía la biblioteca.
 *
 * Actualizacion: 2019/07/10
 * Descripción: Se crearon los métodos manejadores de atributos y
 *              cambiaron los nombres de algunos métodos.
 *
 * Actualizacion: 2019/12/31
 * Descripción: Se mejora la estructura y se crea un constructor
 *              de métodos.
 *              El método id pasa a ser el método principal al
 *              integrar en él la posibilidad de aceptar listas.
 *              Se permite la encadenación de métodos.
 *              Se eliminan métodos poco útiles.
*/
(function (clase) {
    window._js = new clase ();
}) (function () {
    /******************************************************/
    /************************* ID *************************/
    /******************************************************/
    this.id = function (id) {
        let objHTML;

        if (arguments.length === 0) {
            throw new Error ("Se esperaba un argumento.");
        }

        objHTML = (id instanceof Event) ? id.target : (id instanceof HTMLElement || id instanceof NodeList) ? id : (document.querySelector (id)) ? ((document.querySelectorAll (id).length > 1) ? document.querySelectorAll (id) : document.querySelector (id)) : document.getElementById (id);

        objHTML.event = funcion (function (evento, callback) {
            this.addEventListener (evento, callback);
        }, false);

        objHTML.rmEvent = funcion (function (evento, funcion) {
            this.removeEventListener (evento, funcion);
        }, false);

        objHTML.inputBlock = funcion (function (regexpValido, callbackEnter) {
            inputBlock (this, regexpValido, callbackEnter);
        }, false);

        objHTML.addStyle = funcion (function (estilo) {
            checkType (estilo, "string");

            let regExp = new RegExp (`(^| )${estilo}( |$)`);

            if (!regExp.test (this.className)) {
                this.className = (`${this.className} ${estilo}`).trim ();
            }
        });

        objHTML.rmStyle = funcion (function (estilo) {
            checkType (estilo, "string");

            let regExp = new RegExp (`(^| )${estilo}( |$)`);

            this.className = this.className.replace (regExp, "").trim ();
        });

        objHTML.addrmStyle = funcion (function (estilo) {
            checkType (estilo, "string");

            let regExp = new RegExp (`(^| )${estilo}( |$)`);

            if (regExp.test (this.className)) {
                this.className = this.className.replace (regExp, "").trim ();
            } else {
                this.className = (`${this.className} ${estilo}`).trim ();
            }
        });

        objHTML.addrmStyleValue = funcion (function (propiedad, valor) {
            checkType (propiedad, "string");

            let obj = this.style;

            if (obj[propiedad] === "" || !(obj[propiedad])) {
                obj[propiedad] = valor;
            } else {
                obj[propiedad] = "";
            }
        });

        objHTML.setAttributes = funcion (function (json) {
            checkInstance (json, Object, "Object");

            let atributo;

            try {
                for (atributo in json) {
                    this.setAttribute (atributo, json[atributo]);
                }
            } catch (error) {
                if (json instanceof Array) {
                    throw new TypeError (`Se esperaba un Object como argumento.`);
                }

                throw new Error (error);
            }
        });

        objHTML.clone = funcion (function (callback, boolHijos) {
            exclusive ();

            if (typeof (callback) !== "function") {
                boolHijos = callback;
                callback = function () { return; };
            }

            boolHijos = boolHijos || false;

            checkInstance (callback, Function, "Function");
            checkType (boolHijos, "boolean");

            let clon = this.cloneNode (boolHijos);

            callback (clon);

            this.parentNode.appendChild (clon);
        });

        objHTML.appendTo = funcion (function (padreHtml) {
            exclusive ();

            padreHtml = (padreHtml instanceof HTMLElement) ? padreHtml : _js.id (padreHtml);

            padreHtml.appendChild (this);
        });

        objHTML.keyBlock = funcion (function (regBloqueada, callbackEnter) {
            callbackEnter = callbackEnter || function () { return; };

            checkInstance (this, HTMLElement, "HTMLElement");
            checkInstance (callbackEnter, Function, "Function");

            let especiales;
            let regExp;

            especiales = new RegExp ("Control|Arrow|Space|Backspace|Tab|Home|End|Delete|Insert|Dead|F[0-9]{1,2}");
            regExp = new RegExp (`(?:${regBloqueada})`);

            this.addEventListener ("keydown", validar);
            this.addEventListener ("keyup", compuerta);

            function validar (evento) {
                let tecla;

                tecla = evento.key;

                if (/Enter/.test (tecla)) {
                    seguro.call (this);
                    callbackEnter ();
                    return;
                }

                if (regExp.test (tecla)) {
                    if (especiales.test (tecla)) {
                        this.addEventListener ("blur", seguro);
                        this.removeEventListener ("keydown", validar);
                    } else {
                        evento.preventDefault ();
                    }
                }
            }

            function compuerta (evento) {
                let tecla;

                tecla = evento.key;

                if (especiales.test (tecla)) {
                    seguro.call (this);
                }
            }

            function seguro () {
                this.addEventListener ("keydown", validar);
                this.removeEventListener ("blur", seguro);

                if (regExp.test (this.value)) {
                    this.value = this.value.split (regExp).join ("");
                }
            }
        }, false);


        function funcion (callback, retourn) {
            retourn = (retourn === true || retourn == undefined) ? true : false;

            let cllBack;

            if (objHTML instanceof HTMLElement) {
                cllBack = function (...arg) {
                    callback.call (this, ...arg);

                    if (retourn) {
                        return this;
                    }
                };
            }

            if (objHTML instanceof NodeList) {
                cllBack = function (...arg) {
                    objHTML.forEach (function (item) {
                        callback.call (item, ...arg);
                    });

                    if (retourn) {
                        return objHTML;
                    }
                };
            }

            return cllBack;
        }

        function exclusive () {
            if (!(objHTML instanceof HTMLElement)) {
                throw new Error ("El método no está disponible para listas de objetos.");
            }
        }

        return objHTML;
    };

    /******************************************************/
    /*********************** MÉTODOS **********************/
    /******************************************************/
    this.createElement = function (elementoHtml, ns) {
        ns = ns || "";

        checkType (elementoHtml, "string");

        let elemento;

        if (ns === "") {
            elemento = document.createElement (elementoHtml);
        } else {
            elemento = document.createElementNS (ns, elementoHtml);
        }

        return this.id (elemento);
    };

    function inputBlock (objeto, regexpValido, callbackEnter) {
        callbackEnter = callbackEnter || function () { return; };

        checkInstance (objeto, HTMLElement, "HTMLElement");
        checkInstance (callbackEnter, Function, "Function");

        let especiales;
        let regExp;

        especiales = new RegExp ("Control|Arrow|Backspace|Tab|Home|End|Delete|Insert|Shift|F[0-9]{1,2}");
        regExp = new RegExp (`^${regexpValido}$`);

        objeto.addEventListener ("keydown", validar);
        objeto.addEventListener ("keyup", compuerta);

        function validar (evento) {
            let tecla;
            let valor;

            tecla = evento.key;
            valor = objeto.value;

            if (/Enter/.test (tecla)) {
                seguro ();
                callbackEnter ();
                return;
            }

            if (!especiales.test (tecla)) {
                if (!((regExp.test (valor + tecla)) && (tecla.length === 1))) {
                    evento.preventDefault ();
                }
            } else {
                objeto.addEventListener ("blur", seguro);
                objeto.removeEventListener ("keydown", validar);
            }
        }

        function compuerta (evento) {
            let tecla;

            tecla = evento.key;

            if (especiales.test (tecla)) {
                seguro ();
            }
        }

        function seguro () {
            objeto.addEventListener ("keydown", validar);
            objeto.removeEventListener ("blur", seguro);

            if (!regExp.test (objeto.value)) {
                objeto.value = "";
            }
        }
    };

    function checkInstance (objeto, instancia, alias) {
        if (!(objeto instanceof instancia)) {
            throw new TypeError (`Se esperaba un objeto ${alias} como argumento.`);
        }
    }

    function checkType (argumento, tipo) {
        if (typeof (argumento) !== tipo) {
            throw new TypeError (`Se esperaba un ${tipo} como argumento.`);
        }
    }
});
