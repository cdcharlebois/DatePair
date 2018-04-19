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
            _date: null,
            _time: null,

            // nodes
            inBetweenNode: null,

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
                dojoClass.add(this.errorNode, "hidden");

                this._addStyling();
            },

            _addPlaceholders: function() {
                if (this.timePlaceholder) {
                    $(this.startTimeNode).attr("placeholder", this.timePlaceholder);
                    $(this.startTimeNode).removeProp("readonly");
                }
                if (this.datePlaceholder) {
                    $(this.startDateNode).attr("placeholder", this.datePlaceholder);
                    $(this.startDateNode).removeProp("readonly");
                }
            },

            _addLabel: function() {
                this.labelNode.innerText = this.label;
                if (this.labelWidth === 0) {
                    console.debug("trying to infer column width...");
                    if (this.domNode.previousElementSibling) {
                        console.debug("checking previous element sibling...");
                        if (dojoClass.contains(this.domNode.previousElementSibling, "form-group")) {
                            console.debug("previous element sibling is a form group!");
                            if (dojoClass.contains(this.domNode.previousElementSibling.firstElementChild, "control-label")) {
                                console.debug("found a width!");
                                var widthClass = this.domNode.previousElementSibling.firstElementChild.className.match(/col-sm-\d+/);
                                var width = widthClass && widthClass[0] && widthClass[0].split("-")[2];
                                if (width && !isNaN(width * 1)) {
                                    console.debug("valid width!");
                                    dojoClass.add(this.labelNode, "col-sm-" + width);
                                    dojoClass.add(this.controlNode, "col-sm-" + (12 - width));
                                }
                            }
                        }
                    }
                } else {
                    dojoClass.add(this.labelNode, "col-sm-" + this.labelWidth);
                    dojoClass.add(this.controlNode, "col-sm-" + (12 - this.labelWidth));
                }

            },

            _addStyling: function() {
                dojoClass.add(this.domNode, this.displayAsModal ? "dt-modal" : "dt-classic");
                this._addPlaceholders();
                if (this.showLabel) {
                    dojoClass.add(this.domNode, "form-group");
                    this._addLabel();
                } else {
                    dojoClass.add(this.labelNode, "hidden");
                }
                dojoStyle.set(this.inputsNode, "display", "flex");
                dojoStyle.set(this.inputsNode, "align-items", "center");
            },

            _setDisabled: function() {
                $("input", this.domNode).prop("disabled", true);
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
             *  value.select: number | Array
             *  type:  "date" | "time"
             * }
             */
            _handleDateTimeChange: function(data) {
                var sel = data.value.select;
                if ("undefined" === typeof sel) {
                    this._contextObj.set(this.fromDate, null); // triggers subscription, which calls this again
                } else {
                    // if highlight is set, or the value is not either an Array or Number, return (subscription hits this)
                    if (data.value.highlight || !(Array.isArray(sel) || typeof sel === "number")) return;
                    if (data.type === "date") {
                        // sel is either number or array
                        if (Array.isArray(sel)) {
                            // need to correct the month
                            sel[1]++;
                        }
                        this._date = Array.isArray(sel) ? new Date(sel) : sel;
                    } else {
                        this._time = sel;
                    }
                    var newDate = new Date((this._date || 0) + (this._time || 0) * 60 * 1000);
                    this._contextObj.set(this.fromDate, newDate);
                }

            },

            _getDatePickerOptions: function() {
                return new Promise(lang.hitch(this, function(resolve, reject) {
                    var defaultDatePickerOptions = {
                        format: this.dateFormat,
                        onSet: lang.hitch(this, function(data) {
                            this._handleDateTimeChange({ type: "date", value: data });
                        }),
                        onRender: lang.hitch(this, this._showYearsNav)
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
                            this.dp = this._initDatepicker($(".date", this.domNode), options);
                            resolve();
                        }));
                    }))
                    .then(lang.hitch(this, this._getTimePickerOptions))
                    .then(lang.hitch(this, function(options) {
                        return new Promise(lang.hitch(this, function(resolve) {
                            this.tp = this._initTimepicker($(".time", this.domNode), options);
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
                        this._resetSubscriptions();
                        this._updateRendering(callback);
                    }))
                    .catch(lang.hitch(this, function(err) {
                        console.error(err);
                        this._updateRendering(callback);
                    }));

            },

            _setDateTimePickerValues: function(datetime) {
                if (datetime) {
                    this._date = new Date(datetime).setHours(0, 0, 0, 0);
                    this._time = (new Date(datetime) - new Date(datetime).setHours(0, 0, 0, 0)) / 1000 / 60;
                    if (this.dp) {
                        this.dp.set("select", new Date(datetime));
                    }
                    if (this.tp) {
                        this.tp.set("select", new Date(datetime));
                    }
                } else {
                    if (this.dp) {
                        this.dp.set("clear");
                    }
                    if (this.tp) {
                        this.tp.set("clear");
                    }

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

            /**
             * Reset Subscriptions
             */
            _resetSubscriptions: function() {
                this.unsubscribeAll();
                // attr
                this.subscribe({
                    guid: this._contextObj.getGuid(), // the guid
                    attr: this.fromDate, // the attributeName
                    callback: lang.hitch(this, function(guid, attr, attrValue) {
                        this._setDateTimePickerValues(attrValue);
                        this._clearValidation();
                    })
                });
                //object
                this.subscribe({
                    guid: this._contextObj.getGuid(), // the guid
                    callback: lang.hitch(this, function(guid, attr, attrValue) {
                        this._setDateTimePickerValues(attrValue);
                        this._clearValidation();
                    })
                });
                this.subscribe({
                    guid: this._contextObj.getGuid(),
                    val: true,
                    callback: lang.hitch(this, function(validations) {
                        this._handleValidations(validations);
                    })
                });
            },

            /**
             * Handle Validations
             */
            _handleValidations: function(validations) {
                var validation = validations[0],
                    message = validation.getReasonByAttribute(this.fromDate);
                this._showValidation(message); // update widget DOM
            },

            _showValidation: function(message) {
                dojoHtml.set(this.errorNode, message);
                dojoClass.remove(this.errorNode, "hidden");
                dojoStyle.set(this.errorNode, "margin-top", "8px");
            },

            _clearValidation: function() {
                dojoClass.add(this.errorNode, "hidden");
            },

            /**
             * Show Years Nav
             * ---
             * show the buttons to navigate up or down a year
             * @since Nov 28, 2017
             */
            _showYearsNav: function() {
                var $upButton = $(document.createElement("span")),
                    $downButton = $(document.createElement("span")),
                    $yearNode = $(".picker__year", this.domNode);
                $upButton
                    .text("+")
                    .addClass("picker__year-change")
                    .on("click", lang.hitch(this, this._onClickUpYear));
                $downButton
                    .text("-")
                    .addClass("picker__year-change")
                    .on("click", lang.hitch(this, this._onClickDownYear));
                $upButton.insertAfter($yearNode);
                $downButton.insertBefore($yearNode);
            },

            _onClickUpYear: function() {
                var newDate = new Date((this._date || 0));
                newDate.setFullYear(newDate.getFullYear() + 1);
                this.dp.set("select", newDate * 1);
            },
            _onClickDownYear: function() {
                var newDate = new Date((this._date || 0));
                newDate.setFullYear(newDate.getFullYear() - 1);
                this.dp.set("select", newDate * 1);
            },

        });
    });

require(["DatePair/widget/DateTime"]);