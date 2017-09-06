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

    "dojo/text!DatePair/widget/template/DatePair.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, Datepair, _timepicker, _datepicker, widgetTemplate) {
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
            // console.log($);
            console.log($.fn.timepicker);
            console.log($.fn.datepicker);
            console.log($.fn.datepair);
            // console.log(_datepair);

            // this.$dp.on('rangeSelected', lang.hitch(this, function() {
            //     this._contextObj.set(this.fromDate(new Date()))
            //     this._contextObj.set(this.toDate(new Date()))
            // }))
            // this._setupListeners();
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            $('.time', this.domNode.firstElementChild).timepicker({
                showDuration: true,
                timeFormat: this.timeFormat
            }).on('change', lang.hitch(this, function(event) {
                //this._contextObj.set('To', new Date())
                console.log(`TODO: update context object values`)
                this._pushValuesToContext();
            }));

            $('.date', this.domNode.firstElementChild).datepicker({
                format: this.dateFormat,
                autoclose: true
            }).on('change', lang.hitch(this, function(event) {
                console.log(`TODO: update context object values`)
                this._pushValuesToContext();
            }));
            var dp = new Datepair(this.domNode.firstElementChild);
            console.log(dp)


            this._contextObj = obj;
            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _pushValuesToContext: function() {
            var originalFrom = this._contextObj.get(this.fromDate),
                originalTo = this._contextObj.get(this.toDate);

            // do some calculation here, then set the value in this._contextObj
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