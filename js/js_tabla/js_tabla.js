/*
 * FECHA: 2019/03/06
 * AUTOR: Julio Alejandro Santos Corona
 * CORREO: jualesac@yahoo.com
 * TÍTULO: js_tabla.js
 *
 * Descripción: Gadget para la creación de tablas.
 *
 * FECHA: 2020/11/02
 * UPGRADE: Mejora y ampliación de funcionalidad
 * 
 * FECHA: 2021/05/02
 * UPGRADE: Ahora se crean tablas con tag table.
*/

"use strict";

var JS_TABLA = {
    properties: function () {
        this.config = {
            callbackScroll: 0,
            colnameAlign: 0,
            limitLines: 0,
            pagination: 0,
            columns: {}
        },

        this.limit = 30;
        this.cols = 0;
        this.rows = 0;
        this.deleteTime = 500;

        this.page = 0;
    },

    skull: function (Width, Height, Id) {
        let prop = new JS_TABLA.properties ();
        let _config = prop.config;

        let _extraWidth = 19;

        let table = _js(Id).setAttributes ({ style: `width: ${Width}; height: ${Height};` });
        let _jsClass = table.getAttribute ("class");
        
        let _callbackOnEdit = function () {};
        let _callbackOnScroll = function () {};
        let _scrollActive = 0;
        let _valueOnEdit;

        createTableTag ("columns", table);
        createTableTag ("lines", table, true);
        _js.createElement ("div").setAttributes ({ id: `${Id}_controls` }).appendTo (table);

        _js.createElement ("tr").appendTo (`${Id}_columns`);
        table = undefined;

        this.getProperties = function () {
            return prop;
        };

        this.reset = function () {
            _js(`${Id}_columns`).textContent = "";
            _js(`${Id}_lines`).textContent = "";
            _js(`${Id}_controls`).textContent = "";
            _js(`#${Id} > div:nth-child(2)`).rmEvent ("scroll", scroll);

            _config = prop.config;

            _js.createElement ("tr").appendTo (`${Id}_columns`);
            
            prop.cols = 0;
            prop.rows = 0;
            prop.page = 0;
        };

        this.clear = function () {
            _js(`${Id}_lines`).textContent = "";
            
            prop.rows = 0;
            prop.page = 0;

            if (_config.pagination) {
                _js(`${Id}_ctrl_numpage`).textContent = 0;
            }
        };

        this.setConfig = function (config) {
            if (typeof (config) != "object") { throw new ErrorType ("Se esperaba un objeto"); }
            
            this.reset ();

            _config = config;
            
            if (_config.callbackScroll) { _js(`#${Id} > div:nth-child(2)`).event ("scroll", scroll); }

            createColumnsTable ();
            createPaginationControls ();
        };

        this.getConfig = function () { return _config; };

        this.onEdit = function (callback) {
            if (typeof (callback) != "function") { throw new TypeError ("Se esperaba una función como argumento"); }

            _callbackOnEdit = callback;
        };

        this.onScroll = function (callback) {
            if (typeof (callback) != "function") { throw new TypeError ("Se esperaba una función como argumento"); }

            _callbackOnScroll = callback;
        };

        this.createRowTable = function (data, callback, include) {
            if (Object.keys (_config.columns).length == 0) { return; }

            if (typeof (callback) === "boolean") {
                include = callback;
                callback = undefined;
            }

            data = data || {};
            callback = callback || function () {};
            include = include || false;

            let columns = _js(`${Id}_lines`);
            let tbody = columns.cloneNode (false);
            let attributes = {};
            let argments = {};

            let tr;
            let d;
            let c;

            if (!include) { prop.rows = 0; }

            for (d in data) {
                if ((_config.limitLines || _config.pagination) && prop.rows == prop.limit) { break; }

                tr = _js.createElement ("tr").appendTo (tbody);

                for (c in data[d]) {
                    if (_config.columns[c].id) {
                        tr.id = data[d][c];
                    }

                    if (_config.columns[c].argument) {
                        argments[_config.columns[c].name.replace (/\s/g, "_").trim ()] = data[d][c];
                    }

                    if (isIdOrArgumentHidden (_config.columns[c])) { continue; }

                    attributes.style = `${(prop.rows <= 0 ? `width: ${(_config.columns[c].size) || "2em"}; ` : "")} ${(_config.columns[c].align ? `text-align: ${_config.columns[c].align};` : "")}`.trim ();
                    if (_config.columns[c].editable) {
                        attributes.class = `${_jsClass}_edit`;
                    }

                    _js.createElement ("span").appendTo (
                        _js.createElement ("td").setAttributes (attributes).setProperties ({ editable: (_config.columns[c].editable || 0) }).appendTo (tr)
                    ).textContent = data[d][c];

                    attributes = {};
                }

                tr.tblProperties = argments;

                callback (tr, argments);

                if (include) { columns.appendChild (tr); }
                
                prop.rows++;
            }

            if (!include) { tbody.replace (columns); }
            if (_config.pagination && prop.page == 0) {
                _js(`${Id}_ctrl_numpage`).textContent = 1;
                prop.page = 1;
            };

            _js(`${Id}_lines`).event ("click", edit);
        };

        function createTableTag (suf, appendTo, boolBody) {
            boolBody = boolBody || false;

            let div = _js.createElement ("div");
            let table = _js.createElement ("table").appendTo (div);

            _js.createElement (boolBody ? "tbody" : "thead").setAttributes ({
                id: `${Id}_${suf}`,
                class: `${_jsClass}_${suf}`
            }).appendTo (table);

            div.appendTo (appendTo);
        }

        function createPaginationControls () {
            if (!_config.pagination) {
                _js(`${Id}_controls`).setAttribute ("class", "");
                return;
            }

            let div = _js.createElement ("div");

            _js.createElement ("p").setAttributes ({
                id: `${Id}_ctrl_back`,
                class: `${_jsClass}_ctrl_back`
            }).appendTo (div).textContent = "◄";
            
            _js.createElement ("p").setAttributes ({
                id: `${Id}_ctrl_numpage`,
                class: `${_jsClass}_ctrl_numpage`
            }).appendTo (div).textContent = "0";
            
            _js.createElement ("p").setAttributes ({
                id: `${Id}_ctrl_next`,
                class: `${_jsClass}_ctrl_next`
            }).appendTo (div).textContent = "►";
            
            div.appendTo (_js(Id).children[2].setAttributes ({
                class: `${_jsClass}_controls`
            }));

            prop.page = 0;
        }

        function createColumnsTable () {
            let columns = _config.columns;
            let htmlColumns = _js(`${Id}_columns`);
            let width = 0;
            let tr;
            let td;
            let i;

            htmlColumns.textContent = "";

            tr = _js.createElement ("tr").appendTo (htmlColumns);
            td;

            for (i in columns) {
                if (isIdOrArgumentHidden (columns[i])) { continue; }

                td = _js.createElement ("td").setAttributes ({
                    style: `width: ${(columns[i].size || "2em")}; ${columns[i].align && _config.colnameAlign ? `text-align: ${columns[i].align};` : ""}`.trim ()
                }).appendTo (tr);

                _js.createElement ("span").appendTo (td).textContent = (columns[i].name.trim () || "");

                width += Number (htmlColumns.firstChild.lastChild.clientWidth);
                prop.cols++;
            }

            htmlColumns.firstChild.style.width = _js(Id).children[1].style.width = `${width + _extraWidth}px`;
        }

        function isIdOrArgumentHidden (columnConfig) {
            if ((columnConfig.id || columnConfig.argument) && !columnConfig.visible) {
                return true;
            }

            return false;
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

                _callbackOnScroll ();
            }
        }

        function edit (evnt) {
            let tag = evnt.target.tagName;
            let obj = (tag == "TD") ? evnt.target : ((tag == "SPAN") ? evnt.target.parentNode : undefined);
            let input;

            if (!obj || !/_edit$/.test (obj.className)) { return; }

            input = _js.createElement ("input").setAttributes ({
                class: `${obj.className}_on`
            });

            input.value = obj.firstChild.textContent.trim ();
            _valueOnEdit = input.value;

            obj.rmStyle (`${_jsClass}_edit`);
            obj.replaceChild (input, obj.firstChild);

            input.event ("blur", setValueOnEdit);
            input.event ("keydown", setValueOnEdit);
            input.focus ();
        }

        function setValueOnEdit (evnt) {
            if (evnt.key && (evnt.key !== "Enter" && evnt.key !== "Escape")) { return; }

            this.rmEvent ("blur", setValueOnEdit);
            this.rmEvent ("keydown", setValueOnEdit);

            let td = this.parentNode.addStyle (`${_jsClass}_edit`);
            let span = _js.createElement ("span");

            if (evnt.key && evnt.key === "Escape") { this.value = _valueOnEdit; }

            span.textContent = this.value.trim ();
            
            td.replaceChild (span, this);

            if (this.value.trim () != _valueOnEdit) { _callbackOnEdit (td.parentNode, span, _valueOnEdit); }

            _valueOnEdit = undefined;
        }
    },

    main: function (Width, Height, Id) {
        Id = Id || "js_tabla";

        let skull = new JS_TABLA.skull (Width, Height, Id);
        let prop = skull.getProperties ();

        let _callbackOnPagination = function () {};
        let _paginationActive = 0;

        this.reset = skull.reset;
        this.clear = skull.clear;
        this.setConfig = skull.setConfig;
        this.lines = skull.createRowTable;
        this.onEdit = skull.onEdit;
        this.onScroll = skull.onScroll;

        this.getCols = function () { return prop.cols; };
        this.getRows = function () { return prop.rows; };
        this.getLimit = function () { return prop.limit; };

        this.setLimit = function (limit) {
            if (typeof (limit) != "number" || limit <= 0) { throw new TypeError ("Se esperaba un number mayor a 0 como argumento"); }

            prop.limit = limit;
        };

        this.setDeleteTime = function (miliseconds) {
            if (typeof (miliseconds) != "number") { throw new ErrorType ("Se esperaba un entero como argumento"); }

            if (miliseconds <= 10) { miliseconds = 10; }
            if (miliseconds >= 500) { miliseconds = 500; }

            prop.deleteTime = miliseconds;
        };

        this.deleteLine = function (tr, callback) {
            tr = (tr instanceof HTMLElement) ? tr : _js(`#${Id}_lines > tr[id="${tr}"]`);
            callback = callback || function () {};

            if (tr == null) { return; }

            if (tr.currentChildNumber () == 0 && tr.parentNode.children.length > 1) {
                let row1 = _js(`#${Id}_lines > tr:first-child > td`);
                let row2 = _js(`#${Id}_lines > tr:nth-child(2) > td`);
                let n = 0;

                for (n; n < row1.length; n++) {
                    row2[n].style.width = row1[n].style.width;
                }
            }

            setTimeout (function () {
                if (tr.parentNode == null) { return; }
                
                tr.parentNode.removeChild (tr);
                callback ();
            }, prop.deleteTime);

            tr.style.opacity = 0;
            prop.rows--;
        };

        this.onPagination = function (callback) {
            if (typeof (callback) != "function") { throw new TypeError ("Se esperaba una función como argumento"); }

            _callbackOnPagination = callback;

            if (skull.getConfig ().pagination) {
                _js(`
                    #${Id}_ctrl_back,
                    #${Id}_ctrl_next
                `).event ("click", pagination);
            }
        };

        function pagination () {
            if (
                _paginationActive
                || prop.page == 0
                || (/_back$/.test (this.id) && prop.page == 1)
                || (/_next$/.test (this.id) && prop.rows < prop.limit)
            ) { return; }

            let page = prop.page;

            _paginationActive = 1;

            if (/_next$/.test (this.id)) { page++; } else { page--; }

            _callbackOnPagination ({
                currentPage: prop.page,
                nextPage: page,
                start: ((prop.page - 1) * prop.limit),
                end: ((prop.page * prop.limit) - 1),
                rollback: function () { _paginationActive = 0; },
                commit: function () {
                    prop.page = page;
                    _paginationActive = 0;

                    _js(`${Id}_ctrl_numpage`).textContent = page;
                }
            });
        }
    }
};
