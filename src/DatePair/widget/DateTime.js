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
        widgetTemplate) {
        "use strict";

        var $ = _jQuery.noConflict(true);

        return declare("DatePair.widget.DateTime", [_WidgetBase, _TemplatedMixin], {

            templateString: widgetTemplate,

            timeFormat: null,
            dateFormat: null,
            fromDate: null,
            widgetBase: null,
            modalCssString: '.picker{font-size:16px;text-align:left;line-height:1.2;color:#000;position:absolute;z-index:10000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker__input{cursor:default}.picker__input.picker__input--active{border-color:#0089ec}.picker__holder{width:100%;overflow-y:auto;-webkit-overflow-scrolling:touch;position:fixed;transition:background .15s ease-out,-webkit-transform 0s .15s;transition:background .15s ease-out,transform 0s .15s;-webkit-backface-visibility:hidden}.picker__frame,.picker__holder{top:0;bottom:0;left:0;right:0;-webkit-transform:translateY(100%);-ms-transform:translateY(100%);transform:translateY(100%)}.picker__frame{position:absolute;margin:0 auto;min-width:256px;max-width:666px;width:100%;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";filter:alpha(opacity=0);-moz-opacity:0;opacity:0;transition:all .15s ease-out}.picker__wrap{display:table;width:100%;height:100%}@media (min-height:33.875em){.picker__frame{overflow:visible;top:auto;bottom:-100%;max-height:80%}.picker__wrap{display:block}}.picker__box{background:#fff;display:table-cell;vertical-align:middle}@media (min-height:26.5em){.picker__box{font-size:1.25em}}@media (min-height:33.875em){.picker__box{display:block;font-size:1.33em;border:1px solid #777;border-top-color:#898989;border-bottom-width:0;border-radius:5px 5px 0 0;box-shadow:0 12px 36px 16px rgba(0,0,0,.24)}}@media (min-height:40.125em){.picker__frame{margin-bottom:7.5%}.picker__box{font-size:1.5em;border-bottom-width:1px;border-radius:5px}}.picker--opened .picker__holder{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);zoom:1;background:rgba(0,0,0,.32);transition:background .15s ease-out}.picker--opened .picker__frame{-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";filter:alpha(opacity=100);-moz-opacity:1;opacity:1}@media (min-height:33.875em){.picker--opened .picker__frame{top:auto;bottom:0}}' +
                '.picker__footer,.picker__header,.picker__table{text-align:center}.picker__day--highlighted,.picker__select--month:focus,.picker__select--year:focus{border-color:#0089ec}.picker__box{padding:0 1em}.picker__header{position:relative;margin-top:.75em}.picker__month,.picker__year{font-weight:500;display:inline-block;margin-left:.25em;margin-right:.25em}.picker__year{color:#999;font-size:.8em;font-style:italic}.picker__select--month,.picker__select--year{border:1px solid #b7b7b7;height:2em;padding:.5em;margin-left:.25em;margin-right:.25em}.picker__select--month{width:35%}.picker__select--year{width:22.5%}.picker__nav--next,.picker__nav--prev{position:absolute;padding:.5em 1.25em;width:1em;height:1em;box-sizing:content-box;top:-.25em}.picker__nav--prev{left:-1em;padding-right:1.25em}.picker__nav--next{right:-1em;padding-left:1.25em}@media (min-width:24.5em){.picker__select--month,.picker__select--year{margin-top:-.5em}.picker__nav--next,.picker__nav--prev{top:-.33em}.picker__nav--prev{padding-right:1.5em}.picker__nav--next{padding-left:1.5em}}.picker__nav--next:before,.picker__nav--prev:before{content:" ";border-top:.5em solid transparent;border-bottom:.5em solid transparent;border-right:.75em solid #000;width:0;height:0;display:block;margin:0 auto}.picker__nav--next:before{border-right:0;border-left:.75em solid #000}.picker__nav--next:hover,.picker__nav--prev:hover{cursor:pointer;color:#000;background:#b1dcfb}.picker__nav--disabled,.picker__nav--disabled:before,.picker__nav--disabled:before:hover,.picker__nav--disabled:hover{cursor:default;background:0 0;border-right-color:#f5f5f5;border-left-color:#f5f5f5}.picker--focused .picker__day--highlighted,.picker__day--highlighted:hover,.picker__day--infocus:hover,.picker__day--outfocus:hover{color:#000;cursor:pointer;background:#b1dcfb}.picker__table{border-collapse:collapse;border-spacing:0;table-layout:fixed;font-size:inherit;width:100%;margin-top:.75em;margin-bottom:.5em}@media (min-height:33.875em){.picker__table{margin-bottom:.75em}}.picker__table td{margin:0;padding:0}.picker__weekday{width:14.285714286%;font-size:.75em;padding-bottom:.25em;color:#999;font-weight:500}@media (min-height:33.875em){.picker__weekday{padding-bottom:.5em}}.picker__day{padding:.3125em 0;font-weight:200;border:1px solid transparent}.picker__day--today{position:relative}.picker__day--today:before{content:" ";position:absolute;top:2px;right:2px;width:0;height:0;border-top:.5em solid #0059bc;border-left:.5em solid transparent}.picker__day--disabled:before{border-top-color:#aaa}.picker__day--outfocus{color:#ddd}.picker--focused .picker__day--selected,.picker__day--selected,.picker__day--selected:hover{background:#0089ec;color:#fff}.picker--focused .picker__day--disabled,.picker__day--disabled,.picker__day--disabled:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__day--highlighted.picker__day--disabled,.picker__day--highlighted.picker__day--disabled:hover{background:#bbb}.picker__button--clear,.picker__button--close,.picker__button--today{border:1px solid #fff;background:#fff;font-size:.8em;padding:.66em 0;font-weight:700;width:33%;display:inline-block;vertical-align:bottom}.picker__button--clear:hover,.picker__button--close:hover,.picker__button--today:hover{cursor:pointer;color:#000;background:#b1dcfb;border-bottom-color:#b1dcfb}.picker__button--clear:focus,.picker__button--close:focus,.picker__button--today:focus{background:#b1dcfb;border-color:#0089ec;outline:0}.picker__button--clear:before,.picker__button--close:before,.picker__button--today:before{position:relative;display:inline-block;height:0}.picker__button--clear:before,.picker__button--today:before{content:" ";margin-right:.45em}.picker__button--today:before{top:-.05em;width:0;border-top:.66em solid #0059bc;border-left:.66em solid transparent}.picker__button--clear:before{top:-.25em;width:.66em;border-top:3px solid #e20}.picker__button--close:before{content:"\D7";top:-.1em;vertical-align:top;font-size:1.1em;margin-right:.35em;color:#777}.picker__button--today[disabled],.picker__button--today[disabled]:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__button--today[disabled]:before{border-top-color:#aaa}' +
                '.picker--focused .picker__list-item--highlighted,.picker__list-item--highlighted:hover,.picker__list-item:hover{background:#b1dcfb;cursor:pointer;color:#000}.picker__list{list-style:none;padding:.75em 0 4.2em;margin:0}.picker__list-item{border-bottom:1px solid #ddd;border-top:1px solid #ddd;margin-bottom:-1px;position:relative;background:#fff;padding:.75em 1.25em}@media (min-height:46.75em){.picker__list-item{padding:.5em 1em}}.picker__list-item--highlighted,.picker__list-item:hover{border-color:#0089ec;z-index:10}.picker--focused .picker__list-item--selected,.picker__list-item--selected,.picker__list-item--selected:hover{background:#0089ec;color:#fff;z-index:10}.picker--focused .picker__list-item--disabled,.picker__list-item--disabled,.picker__list-item--disabled:hover{background:#f5f5f5;color:#ddd;cursor:default;border-color:#ddd;z-index:auto}.picker--time .picker__button--clear{display:block;width:80%;margin:1em auto 0;padding:1em 1.25em;background:0 0;border:0;font-weight:500;font-size:.67em;text-align:center;text-transform:uppercase;color:#666}.picker--time .picker__button--clear:focus,.picker--time .picker__button--clear:hover{background:#e20;border-color:#e20;cursor:pointer;color:#fff;outline:0}.picker--time .picker__button--clear:before{top:-.25em;color:#666;font-size:1.25em;font-weight:700}.picker--time .picker__button--clear:focus:before,.picker--time .picker__button--clear:hover:before{color:#fff;border-color:#fff}.picker--time .picker__frame{min-width:256px;max-width:320px}.picker--time .picker__box{font-size:1em;background:#f2f2f2;padding:0}@media (min-height:40.125em){.picker--time .picker__box{margin-bottom:5em}}',

            classicCssString: '.picker,.picker__holder{width:100%;position:absolute}.picker{font-size:16px;text-align:left;line-height:1.2;color:#000;z-index:10000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker__input{cursor:default}.picker__input.picker__input--active{border-color:#0089ec}.picker__holder{overflow-y:auto;-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #aaa;border-top-width:0;border-bottom-width:0;border-radius:0 0 5px 5px;box-sizing:border-box;min-width:176px;max-width:466px;max-height:0;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";filter:alpha(opacity=0);-moz-opacity:0;opacity:0;-webkit-transform:translateY(-1em)perspective(600px)rotateX(10deg);transform:translateY(-1em)perspective(600px)rotateX(10deg);transition:-webkit-transform .15s ease-out,opacity .15s ease-out,max-height 0s .15s,border-width 0s .15s;transition:transform .15s ease-out,opacity .15s ease-out,max-height 0s .15s,border-width 0s .15s}.picker__frame{padding:1px}.picker__wrap{margin:-1px}.picker--opened .picker__holder{max-height:25em;-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";filter:alpha(opacity=100);-moz-opacity:1;opacity:1;border-top-width:1px;border-bottom-width:1px;-webkit-transform:translateY(0)perspective(600px)rotateX(0);transform:translateY(0)perspective(600px)rotateX(0);transition:-webkit-transform .15s ease-out,opacity .15s ease-out,max-height 0s,border-width 0s;transition:transform .15s ease-out,opacity .15s ease-out,max-height 0s,border-width 0s;box-shadow:0 6px 18px 1px rgba(0,0,0,.12)}' +
                '.picker__footer,.picker__header,.picker__table{text-align:center}.picker__day--highlighted,.picker__select--month:focus,.picker__select--year:focus{border-color:#0089ec}.picker__box{padding:0 1em}.picker__header{position:relative;margin-top:.75em}.picker__month,.picker__year{font-weight:500;display:inline-block;margin-left:.25em;margin-right:.25em}.picker__year{color:#999;font-size:.8em;font-style:italic}.picker__select--month,.picker__select--year{border:1px solid #b7b7b7;height:2em;padding:.5em;margin-left:.25em;margin-right:.25em}.picker__select--month{width:35%}.picker__select--year{width:22.5%}.picker__nav--next,.picker__nav--prev{position:absolute;padding:.5em 1.25em;width:1em;height:1em;box-sizing:content-box;top:-.25em}.picker__nav--prev{left:-1em;padding-right:1.25em}.picker__nav--next{right:-1em;padding-left:1.25em}@media (min-width:24.5em){.picker__select--month,.picker__select--year{margin-top:-.5em}.picker__nav--next,.picker__nav--prev{top:-.33em}.picker__nav--prev{padding-right:1.5em}.picker__nav--next{padding-left:1.5em}}.picker__nav--next:before,.picker__nav--prev:before{content:" ";border-top:.5em solid transparent;border-bottom:.5em solid transparent;border-right:.75em solid #000;width:0;height:0;display:block;margin:0 auto}.picker__nav--next:before{border-right:0;border-left:.75em solid #000}.picker__nav--next:hover,.picker__nav--prev:hover{cursor:pointer;color:#000;background:#b1dcfb}.picker__nav--disabled,.picker__nav--disabled:before,.picker__nav--disabled:before:hover,.picker__nav--disabled:hover{cursor:default;background:0 0;border-right-color:#f5f5f5;border-left-color:#f5f5f5}.picker--focused .picker__day--highlighted,.picker__day--highlighted:hover,.picker__day--infocus:hover,.picker__day--outfocus:hover{color:#000;cursor:pointer;background:#b1dcfb}.picker__table{border-collapse:collapse;border-spacing:0;table-layout:fixed;font-size:inherit;width:100%;margin-top:.75em;margin-bottom:.5em}@media (min-height:33.875em){.picker__table{margin-bottom:.75em}}.picker__table td{margin:0;padding:0}.picker__weekday{width:14.285714286%;font-size:.75em;padding-bottom:.25em;color:#999;font-weight:500}@media (min-height:33.875em){.picker__weekday{padding-bottom:.5em}}.picker__day{padding:.3125em 0;font-weight:200;border:1px solid transparent}.picker__day--today{position:relative}.picker__day--today:before{content:" ";position:absolute;top:2px;right:2px;width:0;height:0;border-top:.5em solid #0059bc;border-left:.5em solid transparent}.picker__day--disabled:before{border-top-color:#aaa}.picker__day--outfocus{color:#ddd}.picker--focused .picker__day--selected,.picker__day--selected,.picker__day--selected:hover{background:#0089ec;color:#fff}.picker--focused .picker__day--disabled,.picker__day--disabled,.picker__day--disabled:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__day--highlighted.picker__day--disabled,.picker__day--highlighted.picker__day--disabled:hover{background:#bbb}.picker__button--clear,.picker__button--close,.picker__button--today{border:1px solid #fff;background:#fff;font-size:.8em;padding:.66em 0;font-weight:700;width:33%;display:inline-block;vertical-align:bottom}.picker__button--clear:hover,.picker__button--close:hover,.picker__button--today:hover{cursor:pointer;color:#000;background:#b1dcfb;border-bottom-color:#b1dcfb}.picker__button--clear:focus,.picker__button--close:focus,.picker__button--today:focus{background:#b1dcfb;border-color:#0089ec;outline:0}.picker__button--clear:before,.picker__button--close:before,.picker__button--today:before{position:relative;display:inline-block;height:0}.picker__button--clear:before,.picker__button--today:before{content:" ";margin-right:.45em}.picker__button--today:before{top:-.05em;width:0;border-top:.66em solid #0059bc;border-left:.66em solid transparent}.picker__button--clear:before{top:-.25em;width:.66em;border-top:3px solid #e20}.picker__button--close:before{content:"\D7";top:-.1em;vertical-align:top;font-size:1.1em;margin-right:.35em;color:#777}.picker__button--today[disabled],.picker__button--today[disabled]:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__button--today[disabled]:before{border-top-color:#aaa}' +
                '.picker--focused .picker__list-item--highlighted,.picker__list-item--highlighted:hover,.picker__list-item:hover{background:#b1dcfb;cursor:pointer;color:#000}.picker__list{list-style:none;padding:.75em 0 4.2em;margin:0}.picker__list-item{border-bottom:1px solid #ddd;border-top:1px solid #ddd;margin-bottom:-1px;position:relative;background:#fff;padding:.75em 1.25em}@media (min-height:46.75em){.picker__list-item{padding:.5em 1em}}.picker__list-item--highlighted,.picker__list-item:hover{border-color:#0089ec;z-index:10}.picker--focused .picker__list-item--selected,.picker__list-item--selected,.picker__list-item--selected:hover{background:#0089ec;color:#fff;z-index:10}.picker--focused .picker__list-item--disabled,.picker__list-item--disabled,.picker__list-item--disabled:hover{background:#f5f5f5;color:#ddd;cursor:default;border-color:#ddd;z-index:auto}.picker--time .picker__button--clear{display:block;width:80%;margin:1em auto 0;padding:1em 1.25em;background:0 0;border:0;font-weight:500;font-size:.67em;text-align:center;text-transform:uppercase;color:#666}.picker--time .picker__button--clear:focus,.picker--time .picker__button--clear:hover{background:#e20;border-color:#e20;cursor:pointer;color:#fff;outline:0}.picker--time .picker__button--clear:before{top:-.25em;color:#666;font-size:1.25em;font-weight:700}.picker--time .picker__button--clear:focus:before,.picker--time .picker__button--clear:hover:before{color:#fff;border-color:#fff}.picker--time{min-width:256px;max-width:320px}.picker--time .picker__holder{background:#f2f2f2}@media (min-height:40.125em){.picker--time .picker__holder{font-size:.875em}}.picker--time .picker__box{padding:0;position:relative}',

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
                this.endDateNode.style.display = "none";
                this.endTimeNode.style.display = "none";
                this.toNode.style.display = "none";

                this._addStyling();
            },

            _addStyling: function() {
                dojoClass.add(this.domNode, this.displayAsModal ? "dt-modal" : "dt-classic");
            },

            _setDisabled: function() {
                $("input", this.domNode.firstElementChild).prop("disabled", true);
            },

            _initDatepicker: function($el, options) {
                // var $el = $(node);
                console.debug("initializing datepicker on the following node: ");
                console.debug($el);
                var $input = $el.pickadate(options);
                return $input.pickadate("picker");
            },

            _initTimepicker: function($el, options) {
                console.debug("initializing timepicker on the following node: ");
                console.debug($el);
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

            _getDatePickerOptions: function() {
                return new Promise(lang.hitch(this, function(resolve, reject) {
                    var defaultDatePickerOptions = {
                        format: this.dateFormat,
                        onSet: lang.hitch(this, function(data) {
                            this._handleDateTimeChange({ type: "date", value: data });
                        })
                    };
                    // OPTIONS FROM WIDGET PROPS
                    var customOptions = {
                        min: (this.rangeMinDate ? new Date(this._contextObj.get(this.rangeMinDate)) : (this.rangeMinNumber * 1 !== 0 ? this.rangeMinNumber * 1 : false)),
                        max: (this.rangeMaxDate ? new Date(this._contextObj.get(this.rangeMaxDate)) : (this.rangeMaxNumber * 1 !== 0 ? this.rangeMaxNumber * 1 : false)),
                        disable: this.disabledDaysOfWeek.split(/\s*\,\s*/).map(function(i) { return i * 1; })
                    };
                    if (this.disabledDatesMf) {
                        // check to make sure the sourceentity and attribute are setup
                        if (!(this.sourceentity && this.disabledDatesAttr)) {
                            var msg = "[DateTime] >>> Looks like you may have forgotten to set the disabled date entity and/or datetime attribute. Please check your widget configuration"
                                // console.error(msg);
                            reject(msg);
                        }
                        this._asyncCallMf(this.disabledDatesMf)
                            .then(lang.hitch(this, function(data) {
                                data.forEach(lang.hitch(this, function(d) {
                                    customOptions.disable.push(new Date(d.get(this.disabledDatesAttr)))
                                }));
                            }))
                            .then(lang.hitch(this, function() {
                                resolve(Object.assign(defaultDatePickerOptions, customOptions));
                            }));
                    } else {
                        resolve(Object.assign(defaultDatePickerOptions, customOptions));
                    }

                }));


            },

            _asyncCallMf: function(mfname) {
                return new Promise(lang.hitch(this, function(resolve, reject) {
                    mx.data.action({
                        params: {
                            applyto: "selection",
                            actionname: mfname,
                            guids: [this._contextObj.getGuid()]
                        },
                        callback: function(data) {
                            resolve(data);
                        },
                        error: function(err) {
                            reject(err);
                        }
                    });
                }));

            },

            _getTimePickerOptions: function() {
                return new Promise(lang.hitch(this, function(resolve, reject) {
                    var defaultTimePickerOptions = {
                        format: this.timeFormat,
                        onSet: lang.hitch(this, function(data) {
                            this._handleDateTimeChange({ type: "time", value: data });
                        })
                    };
                    // OPTIONS FROM WIDGET PROPS
                    var customOptions = {
                        min: false,
                        max: false,
                        interval: this.timeInterval,
                        disable: this.disabledTimeString.split(/\s*\,\s*/).map(function(pair) { return pair.split(":"); })
                    };
                    // var min_t, max_t;
                    if (this.rangeMinTimeNumber !== "0") {
                        if (this.rangeMinTimeNumber.indexOf(":") > -1) {
                            // this is a time, split into an array
                            customOptions.min = this.rangeMinTimeNumber.split(":").map(function(i) { return i * 1; });
                        } else {
                            // this is a number (hopefully)
                            customOptions.min = this.rangeMinTimeNumber * 1;
                        }
                    }
                    if (this.rangeMaxTimeNumber !== "0") {
                        if (this.rangeMaxTimeNumber.indexOf(":") > -1) {
                            // this is a time, split into an array
                            customOptions.max = this.rangeMaxTimeNumber.split(":").map(function(i) { return i * 1; });
                        } else {
                            // this is a number (hopefully)
                            customOptions.max = this.rangeMaxTimeNumber * 1;
                        }
                    }
                    if (this.disabledTimesMf) {
                        this._asyncCallMf(this.disabledTimesMf)
                            .then(lang.hitch(this, function(data) {
                                data.forEach(lang.hitch(this, function(d) {
                                    customOptions.disable.push(new Date(d.get(this.disabledTimesAttr)));
                                }));
                            }))
                            .then(lang.hitch(this, function() {
                                resolve(Object.assign(defaultTimePickerOptions, customOptions));
                            }));
                    } else {
                        resolve(Object.assign(defaultTimePickerOptions, customOptions));
                    }


                }));

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
                    .then(lang.hitch(this, this._getTimePickerOptions))
                    .then(lang.hitch(this, function(options) {
                        return new Promise(lang.hitch(this, function(resolve) {
                            this.tp = this._initTimepicker($(".time", this.domNode.firstElementChild), options);
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

            _setDateTimePickerValues: function(datetime) {
                this._date = new Date(datetime).setHours(0, 0, 0, 0);
                this._time = (new Date(datetime) - new Date(datetime).setHours(0, 0, 0, 0)) / 1000 / 60;
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