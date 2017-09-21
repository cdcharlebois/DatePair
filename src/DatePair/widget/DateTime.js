/**
 * TODO:
 *  - clean up imports
 *  - put handlers in the right place, make sure that uninitialize is working properly
 *  - [nice to] clean up the formatting strings
 *  - 
 */

define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "DatePair/lib/jquery-1.11.2",
    "DatePair/lib/datepair",
    "DatePair/lib/jquery.timepicker",
    // "widgets/DatePair/lib/jquery.datepair.js",
    "DatePair/lib/bootstrap.datepicker",
    "DatePair/lib/moment",

    "dojo/text!DatePair/widget/template/DateTime.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, Datepair, _timepicker, _datepicker, Moment, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    return declare("DatePair.widget.DateTime", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        timeFormat: null,
        dateFormat: null,
        fromDate: null,
        widgetBase: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            if (!this.editable) {
                this._setDisabled();
            }
        },

        _setDisabled: function() {
            $('input', this.domNode.firstElementChild).prop("disabled", true)
        },
        /**
         * init the timepicker and datepicker, set initial values
         */
        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            if (obj.isReadonlyAttr(this.fromDate)) {
                this._setDisabled();
            }
            $('.time', this.domNode.firstElementChild).timepicker({
                showDuration: true,
                timeFormat: this.timeFormat
            }).on('change', lang.hitch(this, function(event) {
                //this._contextObj.set('To', new Date())
                // console.log(`TODO: update context object values`)
                setTimeout(lang.hitch(this, function() {
                    this._pushValuesToContext()
                }), 100);
            }));

            $('.date', this.domNode.firstElementChild).datepicker({
                format: this.dateFormat,
                autoclose: true
            }).on('change', lang.hitch(this, function(event) {
                // console.log(`TODO: update context object values`)
                setTimeout(lang.hitch(this, function() {
                    this._pushValuesToContext()
                }), 100);
            }));
            $('.start.date').datepicker('update', new Date(obj.get(this.fromDate)))
            $('.start.time').timepicker('setTime', new Date(obj.get(this.fromDate)))

            // var dp = new Datepair(this.domNode.firstElementChild);
            // console.log(dp)


            this._contextObj = obj;
            var _fromDateHandle = this.subscribe({
                guid: this._contextObj.getGuid(), // the guid
                attr: this.fromDate, // the attributeName
                callback: lang.hitch(this, function(guid, attr, attrValue) {
                    // this._updateButtonTitle(); // do something
                    $('.start.date').datepicker('update', new Date(attrValue))
                    $('.start.time').timepicker('setTime', new Date(attrValue))
                })
            });
            this.unsubscribeAll();
            this._handles.push(_fromDateHandle);

            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        /**
         * take values from the custom text fields and update the values in the context
         */
        _pushValuesToContext: function() {
            var originalFrom = new Date(this._contextObj.get(this.fromDate)),
                input = {
                    startDate: this.startDateNode.value,
                    startTime: this.startTimeNode.value,
                },
                newFromMoment = Moment(input.startDate + ' ' + input.startTime, this._convertToMomentFormatString(this.dateFormat + ' ' + this.timeFormat)),
                newFrom = newFromMoment.toDate()

            if (newFromMoment.isValid() && newFrom.getTime() != originalFrom.getTime()) {
                this._contextObj.set(this.fromDate, newFrom);
            }

            // do some calculation here, then set the value in this._contextObj
        },

        /**
         * since the datepair widget supports multiple heterogeneous libaries for formatting, we need to convert them.
         *  Maybe we can just find two libraries that use the same formatting as Moment?
         */
        _convertToMomentFormatString: function(formatString) {
            // TIMEPICKER CHANGES
            //a --> a
            //g|G --> h|H
            //h|H --> ??
            //i --> m
            //s --> s
            // DATEPICKER CHANGES
            // m --> M
            // d --> D
            // yyyy --> YYYY
            return formatString
                .split('m').join('M')
                .split('d').join('D')
                .split('yyyy').join('YYYY')
                .split('g').join('h')
                .split('G').join('H')
                .split('i').join('m');
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback);
        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["DatePair/widget/DateTime"]);