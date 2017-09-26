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

        // external
        "DatePair/lib/jquery-1.11.2",
        "DatePair/lib/picker",
        "DatePair/lib/picker.date",
        "DatePair/lib/picker.time",
        // "DatePair/lib/datepair",
        // "DatePair/lib/jquery.timepicker",
        // "DatePair/lib/bootstrap.datepicker",

        // "DatePair/lib/moment",

        "dojo/text!DatePair/widget/template/DateTime.html"
    ],
    function(declare,
        _WidgetBase,
        _TemplatedMixin,
        dom,
        dojoDom,
        dojoProp,
        dojoGeometry,
        dojoClass,
        dojoStyle,
        dojoConstruct,
        dojoArray,
        lang,
        dojoText,
        dojoHtml,
        dojoEvent,
        _jQuery,
        _picker,
        _datepicker,
        _timepicker,
        // Datepair,
        // _timepicker,
        // _datepicker,
        // Moment,
        widgetTemplate) {
        "use strict";

        var $ = _jQuery.noConflict(true);

        return declare("DatePair.widget.DateTime", [_WidgetBase, _TemplatedMixin], {

            templateString: widgetTemplate,

            timeFormat: null,
            dateFormat: null,
            fromDate: null,
            widgetBase: null,

            _date: null,
            _time: null,

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
                $("input", this.domNode.firstElementChild).prop("disabled", true);
            },

            _initDatepicker: function($el, options) {
                // var $el = $(node);
                console.log("initializing datepicker on the following node: ");
                console.log($el);
                var $input = $el.pickadate(options);
                return $input.pickadate("picker");
            },

            _initTimepicker: function($el, options) {
                console.log("initializing timepicker on the following node: ");
                console.log($el);
                var $input = $el.pickatime(options);
                return $input.pickatime("picker");
            },

            /**
             * data :: {
             *  value: number
             *  type:  "date" | "time"
             * }
             */
            _handleDateTimeChange: function(data) {
                if (data.value.highlight || typeof data.value.select === "object") return; // do nothing because this is hit by the subscription
                if (data.type === "date") {
                    this._date = data.value.select;
                } else {
                    this._time = data.value.select;
                }
                var newDate = new Date((this._date || 0) + (this._time || 0) * 60 * 1000);
                this._contextObj.set(this.fromDate, newDate);
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
                var min_d, max_d, min_t, max_t;
                if (this.rangeMinDate) {
                    min_d = new Date(this._contextObj.get(this.rangeMinDate));
                } else {
                    min_d = (this.rangeMinNumber * 1 !== 0 ? this.rangeMinNumber * 1 : null);
                }
                if (this.rangeMaxDate) {
                    max_d = new Date(this._contextObj.get(this.rangeMaxDate));
                } else {
                    max_d = (this.rangeMaxNumber * 1 !== 0 ? this.rangeMaxNumber * 1 : null);
                }
                if (this.rangeMinTimeNumber !== "0") {
                    if (this.rangeMinTimeNumber.indexOf(":") > -1) {
                        // this is a time, split into an array
                        min_t = this.rangeMinTimeNumber.split(":").map(function(i) { return i * 1; });
                    } else {
                        // this is a number (hopefully)
                        min_t = this.rangeMinTimeNumber * 1;
                    }
                }
                if (this.rangeMaxTimeNumber !== "0") {
                    if (this.rangeMaxTimeNumber.indexOf(":") > -1) {
                        // this is a time, split into an array
                        max_t = this.rangeMaxTimeNumber.split(":").map(function(i) { return i * 1; });
                    } else {
                        // this is a number (hopefully)
                        max_t = this.rangeMaxTimeNumber * 1;
                    }
                }

                // DATEPICKER OPTIONS
                var options_d = {
                        format: this.dateFormat,
                        min: min_d,
                        max: max_d,
                        disable: this.disabledDaysOfWeek.split(",").map(function(i) { return i * 1; }),
                        onSet: lang.hitch(this, function(data) {
                            this._handleDateTimeChange({ type: "date", value: data });
                        })
                    },
                    // TIMEPICKER OPTIONS
                    options_t = {
                        format: this.timeFormat,
                        interval: this.timeInterval,
                        min: min_t,
                        max: max_t,
                        onSet: lang.hitch(this, function(data) {
                            this._handleDateTimeChange({ type: "time", value: data });
                        })
                    };



                this.dp = this._initDatepicker($(".date", this.domNode.firstElementChild), options_d);
                this.tp = this._initTimepicker($(".time", this.domNode.firstElementChild), options_t);
                this._setDateTimePickerValues(this._contextObj.get(this.fromDate));



                var _fromDateHandle = this.subscribe({
                    guid: this._contextObj.getGuid(), // the guid
                    attr: this.fromDate, // the attributeName
                    callback: lang.hitch(this, function(guid, attr, attrValue) {
                        this._setDateTimePickerValues(attrValue);
                    })
                });
                // this.unsubscribeAll();
                this._handles.push(_fromDateHandle);

                this._updateRendering(callback);
            },

            _setDateTimePickerValues: function(datetime) {
                this._date = new Date(datetime).setHours(0, 0, 0, 0);
                this._time = (new Date(datetime) - new Date().setHours(0, 0, 0, 0)) / 1000 / 60;
                if (this.dp) {
                    this.dp.set("select", new Date(datetime));
                }
                if (this.tp) {
                    this.tp.set("select", new Date(datetime));
                }
            },

            resize: function(box) {
                logger.debug(this.id + ".resize");
            },

            /**
             * take values from the custom text fields and update the values in the context
             */
            // _pushValuesToContext: function() {
            //     var originalFrom = new Date(this._contextObj.get(this.fromDate)),
            //         input = {
            //             startDate: this.startDateNode.value,
            //             startTime: this.startTimeNode.value,
            //         },
            //         newFromMoment = new Moment(input.startDate + " " + input.startTime, this._convertToMomentFormatString(this.dateFormat + " " + this.timeFormat)),
            //         newFrom = newFromMoment.toDate()

            //     if (newFromMoment.isValid() && newFrom.getTime() !== originalFrom.getTime()) {
            //         this._contextObj.set(this.fromDate, newFrom);
            //     }

            //     // do some calculation here, then set the value in this._contextObj
            // },

            /**
             * since the datepair widget supports multiple heterogeneous libaries for formatting, we need to convert them.
             *  Maybe we can just find two libraries that use the same formatting as Moment?
             */
            _convertToMomentFormatString: function(formatString) {
                // TIMEPICKER
                // DATEPICKER
                // http://amsul.ca/pickadate.js/date/#formatting-rules
                return formatString
                    .split("m").join("M")
                    .split("d").join("D")
                    .split("yyyy").join("YYYY")
                    .split("g").join("h")
                    .split("G").join("H")
                    .split("i").join("m");
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
            },

            uninitialize: function() {
                this.unsubscribeAll();
            },
        });
    });

require(["DatePair/widget/DateTime"]);