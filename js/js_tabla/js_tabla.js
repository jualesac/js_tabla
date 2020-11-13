"use strict";
/*
 * FECHA: 2019/03/06
 * AUTOR: Julio Alejandro Santos Corona
 * CORREO: jasantos@santander.com.mx | jualesac@yahoo.com
 * TÍTULO: js_tabla.js
 *
 * Descripción: Gadget para la creación de tablas.
 *
 * FECHA: 2020/11/02
 * UPGRADE: Mejora y ampliación de funcionalidad
*/

var JS_TABLA = {
    SKULL: function (width, height, id) {
        let config = {
            callbackScroll: 0,
            colnameAlign: 1,
            limitLines: 0,
            pagination: 0,
            columns: {}
        };

        let _table;
        let _class;
        let _width;
        let _cols = 0;
        let _rows = 0;
        let _limit = 30;
        let _valEdit;
        let _callbackEdit = function () {};
        let _callbackScroll = function () {};
        let _scrollActive = 0;

        _table = _js(id);
        _class = _table.className;
        _width = 19;

        _table.style.width = width;
        _table.style.height = height;

        _js.createElement ("div").appendTo (_table);
        
        _js.createElement ("ul").setAttributes ({
            class: `${_class}_columns`,
            id: `${id}_columns`
        }).appendTo (_table.firstChild);
        
        _js.createElement ("div").setAttributes ({
            class: `${_class}_lines`,
            id: `${id}_lines`
        }).appendTo (_table.firstChild);


        this.limit = function (lim) {
            if (typeof (lim) != "number" && lim > 0) { throw new TypeError ("Se esperaba un number mayor a 0 como argumento"); }

            _limit = lim;
        };

        this.setConfig = function (_config) {
            if (typeof (_config) != "object") { throw TypeError ("Se esperaba un objeto"); }

            config = _config;

            _table.style["grid-template-rows"] = "";

            this.reset ();

            if (_config.pagination) { pagination (); }

            setColumns ();
        };

        this.getCols = function () { return _cols; };

        this.getRows = function () { return _rows; };

        this.getLimit = function () { return _limit; }

        this.reset = function () {
            _js(`${id}_columns`).setAttributes ({ style: "" }).textContent = "";
            _js(`${id}_lines`).setAttributes ({ style: "" }).textContent = "";

            if (_table.children[1] != undefined) { _table.removeChild (_table.children[1]); }

            _rows = 0;
            _cols = 0;
        };

        this.clear = function () {
            _js(`${id}_lines`).textContent = "";
            if (_js(`${id}_pag_num`) != null) { _js(`${id}_pag_num`).textContent = 0; }
            _rows = 0;
        };

        this.onEdit = function (callback) {
            if (typeof (callback) != "function") { throw new TypeError ("Se esperaba una función como argumento"); }

            _callbackEdit = callback;
        };

        this.onScroll = function (callback) {
            if (typeof (callback) != "function") { throw new TypeError ("Se esperaba una función como argumento"); }
    
            _callbackScroll = callback;
        };

        this.lines = function (data, callback, add) {
            if (typeof (callback) === "boolean") {
                add = callback;
                callback = undefined;
            }

            data = data || {};
            callback = callback || function () {};
            add = add || false; 

            let lines = _js.createElement ("div").setAttributes ({
                class: `${_class}_lines`,
                style: `width: ${_js(`${id}_lines`).style.width};`,
                id: `${id}_lines`
            });
            let attributes = {};
            let argments = {};
            let line, c;

            for (let row in data) {
                if (config.limitLines && (_rows == _limit)) { break; }

                line = _js.createElement ("ul").appendTo (lines);
                c = 0;

                for (let col in data[row]) {
                    if (config.columns[c].id) {
                        line.id = data[row][col];
                    } else if (config.columns[c].argument) {
                        argments[config.columns[c].name.replace (/\s/g, "_").trim ()] = data[row][col];
                    }

                    if (skipCol (config.columns[c])) { c++; continue; }

                    attributes.style = `width: ${(config.columns[c].size || "2em")}; ${(config.columns[c].align != undefined) ? ("text-align: " + config.columns[c].align + ";") : ""}`.trim ();
                    if (config.columns[c].edit) { attributes.class = `${_class}_edit`; }

                    _js.createElement ("span").appendTo (
                        _js.createElement ("li").setAttributes (attributes).appendTo (line)
                    ).textContent = data[row][col];

                    attributes = {};
                    c++;
                }

                callback (line, argments);

                if (add) { _table.firstChild.childNodes[1].appendChild (line); }
                _rows++;
            }

            if (!add) { _table.firstChild.replaceChild (lines, _table.firstChild.childNodes[1]); }
            
            if (_js(`${id}_pag_num`) && Number (_js(`${id}_pag_num`).textContent) == 0) { _js(`${id}_pag_num`).textContent = 1; }

            if (config.callbackScroll) { _js(`${id}_lines`).event ("scroll", scroll); }
            _js(`${id}_lines`).event ("click", edit);
        };

        this.deleteLine = function (ul) {
            ul = (typeof (ul) == "string" || typeof (ul) == "number") ? _js(`#${id}_lines > ul[id="${ul}"]`) : ul;

            if (ul == null) { return; }

            setTimeout (function () {
                if (ul.parentNode != null) {
                    ul.parentNode.removeChild (ul);
                }
            }, 500);

            ul.style.opacity = 0;
            ul.style["max-height"] = 0;
            _rows--;
        };

        function setColumns () {
            let columns = config.columns;
            let objCol = _js(`${id}_columns`);
            let width = _width;

            for (let i in columns) {
                if (skipCol (columns[i])) { continue; }
                
                _js.createElement ("span").appendTo (_js.createElement ("li").setAttributes ({
                    style: `width: ${(columns[i].size || "2em")}; ${(columns[i].align != undefined && config.colnameAlign) ? ("text-align: " + columns[i].align + ";") : ""}`.trim ()
                }).appendTo (objCol)).textContent = columns[i].name.trim () || "";

                width += Number (objCol.lastChild.clientWidth);
                _cols++;
            }

            objCol.style.width = _js(`${id}_lines`).style.width = `${width}px`;
        }

        function pagination () {
            let div;

            div = _js.createElement ("div").setAttributes ({
                class: `${_class}_pagination`,
                id: `${id}_pagination`
            }).appendTo (_table);

            _js.createElement ("p").setAttributes ({
                class: `${_class}_pag_back`,
                id: `${id}_pag_back`
            }).appendTo (div).innerText = "◄";

            _js.createElement ("p").setAttributes ({
                id: `${id}_pag_num`
            }).appendTo (div).innerText = 0;

            _js.createElement ("p").setAttributes ({
                class: `${_class}_pag_next`,
                id: `${id}_pag_next`
            }).appendTo (div).innerText = "►";

            _table.style["grid-template-rows"] = `auto 3em`;
        }

        function edit (evnt) {
            let tag = evnt.target.tagName;
            let obj = (tag == "LI") ? evnt.target : ((tag == "SPAN") ? evnt.target.parentNode : undefined);
            let input;

            if (!obj || !/_edit$/.test (obj.className)) { return; }

            input = _js.createElement ("input").setAttributes ({
                class: `${obj.className}_on`
            })

            input.value = obj.childNodes[0].textContent.trim ();
            _valEdit = input.value;

            obj.rmStyle (`${_class}_edit`);
            obj.replaceChild (input, obj.childNodes[0]);

            input.event ("blur", setEdit);
            input.event ("keydown", setEdit);
            input.focus ();
        }

        function setEdit (evnt) {
            if (evnt.key && (evnt.key !== "Enter" && evnt.key !== "Escape")) { return; }

            let li = this.parentNode;
            let span = _js.createElement ("span");

            this.rmEvent ("blur", setEdit);
            this.rmEvent ("keydown", setEdit);

            if (evnt.key && evnt.key === "Escape") { this.value = _valEdit; }

            span.textContent = this.value.trim ();

            li.addStyle (`${_class}_edit`);
            li.replaceChild (span, this);

            if (this.value != _valEdit) { _callbackEdit (li.parentNode, span); }

            _valEdit = undefined;
        }

        function scroll (evnt) {
            if (_scrollActive && this.scrollTop >= (this.scrollTopMax - 5)) { return; }
            if (_scrollActive && this.scrollTop < (this.scrollTopMax - 5)) { _scrollActive = 0; }

            if (this.scrollTop == this.scrollTopMax && !_scrollActive) {
                let that = this;

                _scrollActive = 1;

                this.style.overflow = "hidden";
                setTimeout (function () {
                    that.style.overflow = "";
                }, 800);

                _callbackScroll ();
            }
        }

        function skipCol (column) {
            if ((column.id && !column.visible) || (column.argument && !column.visible)) {
                return true;
            } else {
                return false;
            }
        }
    },

    main: function (width, height, id) {
        id = id || "js_tabla";
        
        JS_TABLA.SKULL.call (this, width, height, id);

        let _class = _js(id).className;
        let _callbackPaginator = function () {};
        let _paginatorActive = 0;
        let that = {
            getLimit: this.getLimit,
            getRows: this.getRows
        };

        this.onPagination = function (callback) {
            if (typeof (callback) != "function") { throw new TypeError ("Se esperaba una función como argumento"); }

            _callbackPaginator = callback;

            if (_js(`${id}_pagination`)) {
                _js(`
                #${id}_pag_back,
                #${id}_pag_next
            `).event ("click", pagination);
            }
        };

        function pagination () {
            let page = {
                limit: Number (that.getLimit ()),
                rows: Number (that.getRows ()),
                number: Number (_js(`${id}_pag_num`).textContent)
            };

            if (_paginatorActive || page.number == 0 || (/_back/.test (this.id) && page.number == 1) || (/_next/.test (this.id) && page.rows < page.limit)) { return; }

            if (/_next/.test (this.id)) { page.number++; } else { page.number--; }

            _paginatorActive = 1;

            _callbackPaginator ({
                start: ((page.number - 1) * page.limit),
                end: ((page.number * page.limit) - 1),
                page: page.number,
                update: function () {
                    _js(`${id}_pag_num`).textContent = page.number
                }
            });

            setTimeout (function () {
                _paginatorActive = 0;
            }, 333);
        }
    }
};
