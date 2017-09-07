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
    "widgets/DatePair/lib/datepair.js",
    "widgets/DatePair/lib/jquery.timepicker.js",
    // "widgets/DatePair/lib/jquery.datepair.js",
    "widgets/DatePair/lib/bootstrap.datepicker.js",
    "widgets/DatePair/lib/moment.js",

    "dojo/text!DatePair/widget/template/DatePair.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, Datepair, _timepicker, _datepicker, Moment, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    return declare("DatePair.widget.DatePair", [_WidgetBase, _TemplatedMixin], {

        templateString: widgetTemplate,

        timeFormat: null,
        dateFormat: null,
        fromDate: null,
        toDate: null,
        widgetBase: null,
        $dp: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
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
            $('.end.date').datepicker('update', new Date(obj.get(this.toDate)))
            $('.end.time').timepicker('setTime', new Date(obj.get(this.toDate)))
            var dp = new Datepair(this.domNode.firstElementChild);
            console.log(dp)


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
            var _toDateHandle = this.subscribe({
                guid: this._contextObj.getGuid(), // the guid
                attr: this.toDate, // the attributeName
                callback: lang.hitch(this, function(guid, attr, attrValue) {
                    // this._updateButtonTitle(); // do something
                    $('.end.date').datepicker('update', new Date(attrValue))
                    $('.end.time').timepicker('setTime', new Date(attrValue))
                })
            });
            this._handles.push(_fromDateHandle);
            this._handles.push(_toDateHandle);
            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _pushValuesToContext: function() {
            var originalFrom = new Date(this._contextObj.get(this.fromDate)),
                originalTo = new Date(this._contextObj.get(this.toDate)),
                input = {
                    startDate: this.startDateNode.value,
                    startTime: this.startTimeNode.value,
                    endDate: this.endDateNode.value,
                    endTime: this.endTimeNode.value
                },
                newFromMoment = Moment(input.startDate + ' ' + input.startTime, this._convertToMomentFormatString(this.dateFormat + ' ' + this.timeFormat)),
                newToMoment = Moment(input.endDate + ' ' + input.endTime, this._convertToMomentFormatString(this.dateFormat + ' ' + this.timeFormat)),
                newFrom = newFromMoment.toDate(),
                newTo = newToMoment.toDate();


            if (newFromMoment.isValid() && newFrom.getTime() != originalFrom.getTime()) {
                this._contextObj.set(this.fromDate, newFrom);
            }
            if (newToMoment.isValid() && newTo.getTime() != originalTo.getTime()) {
                this._contextObj.set(this.toDate, newTo);
            }



            // do some calculation here, then set the value in this._contextObj
        },
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

require(["DatePair/widget/DatePair"]);