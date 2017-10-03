/**
 * TODO:
 *  - clean up imports
 *  - put handlers in the right place, make sure that uninitialize is working properly
 *  - [nice to] clean up the formatting strings
 *  - 
 */

define([
        "dojo/_base/declare",
        // "mxui/widget/_WidgetBase",
        // "dijit/_TemplatedMixin",
        // "mxui/dom",
        // "dojo/dom",
        // "dojo/dom-prop",
        // "dojo/dom-geometry",
        // "dojo/dom-class",
        "dojo/dom-style",
        // "dojo/dom-construct",
        // "dojo/_base/array",
        "dojo/_base/lang",
        // "dojo/text",
        // "dojo/html",
        // "dojo/_base/event",

        // external
        "DatePair/lib/jquery-1.11.2",
        "DatePair/lib/picker",
        "DatePair/lib/picker.date",
        "DatePair/lib/picker.time",

        "dojo/text!DatePair/widget/template/DateTime.html",
        "DatePair/widget/DateTime"
    ],
    function(declare,
        // _WidgetBase,
        // _TemplatedMixin,
        // dom,
        // dojoDom,
        // dojoProp,
        // dojoGeometry,
        // dojoClass,
        dojoStyle,
        // dojoConstruct,
        // dojoArray,
        lang,
        // dojoText,
        // dojoHtml,
        // dojoEvent,
        _jQuery,
        _picker,
        _datepicker,
        _timepicker,
        widgetTemplate,
        DateTimeWidget) {
        "use strict";

        var $ = _jQuery.noConflict(true);

        return declare("DatePair.widget.Date", [DateTimeWidget], {

            postCreate: function() {
                // hide the time node.
                this.startTimeNode.style.display = "none";

                this.endDateNode.style.display = "none";
                this.endTimeNode.style.display = "none";
                this.toNode.style.display = "none";
                this._addStyling();
            },

            /**
             * init the timepicker and datepicker, set initial values
             */
            update: function(obj, callback) {
                logger.debug(this.id + ".update");
                this._contextObj = obj;

                if (this._contextObj.isReadonlyAttr(this.fromDate)) {
                    this._setDisabled();
                }

                this._getDatePickerOptions()
                    .then(lang.hitch(this, function(options) {
                        return new Promise(lang.hitch(this, function(resolve) {
                            this.dp = this._initDatepicker($(".date", this.domNode.firstElementChild), options);
                            resolve();
                        }));
                    }))
                    .then(lang.hitch(this, function() {
                        // set initial values
                        this._setDateTimePickerValues(this._contextObj.get(this.fromDate));
                        // set display
                        if (this.datePickerShouldStartOpen) {
                            this.dp.open();
                        }
                        // add handlers
                        var _fromDateHandle = this.subscribe({
                            guid: this._contextObj.getGuid(), // the guid
                            attr: this.fromDate, // the attributeName
                            callback: lang.hitch(this, function(guid, attr, attrValue) {
                                this._setDateTimePickerValues(attrValue);
                            })
                        });
                        this._handles.push(_fromDateHandle);
                        this._updateRendering(callback);
                    }))
                    .catch(lang.hitch(this, function(err) {
                        console.error(err);
                        this._updateRendering(callback);
                    }));
            },
        });
    });

require(["DatePair/widget/Date"]);