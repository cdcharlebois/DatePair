/**
 * TODO:
 *  - clean up imports
 *  - put handlers in the right place, make sure that uninitialize is working properly
 *  - [nice to] clean up the formatting strings
 *  - 
 */

define([
    "dojo/_base/declare",
    "DatePair/widget/DateTime",
    "dojo/text!DatePair/widget/template/DatePair.html",
    // external
    "DatePair/lib/jquery-1.11.2",
    "DatePair/lib/datepair",
    "DatePair/lib/jquery.timepicker",
    "DatePair/lib/bootstrap.datepicker",
    "DatePair/lib/moment",
    "dojo/_base/lang",
    "dojo/dom-style"
], function(declare, DateTimeWidget, widgetTemplate, _jQuery, Datepair, _timepicker, _datepicker, Moment, lang, dojoStyle) {
    var $ = _jQuery.noConflict(true);
    return declare("DatePair.widget.DatePair", [DateTimeWidget], {

        templateString: widgetTemplate,

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
            $('.end.date').datepicker('update', new Date(obj.get(this.toDate)))
            $('.end.time').timepicker('setTime', new Date(obj.get(this.toDate)))

            var dp = new Datepair(this.domNode.firstElementChild);
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
            var _toDateHandle = this.subscribe({
                guid: this._contextObj.getGuid(), // the guid
                attr: this.toDate, // the attributeName
                callback: lang.hitch(this, function(guid, attr, attrValue) {
                    // this._updateButtonTitle(); // do something
                    $('.end.date').datepicker('update', new Date(attrValue))
                    $('.end.time').timepicker('setTime', new Date(attrValue))
                })
            });
            // this.unsubscribeAll();
            this._handles.push(_fromDateHandle);
            this._handles.push(_toDateHandle);
            this._updateRendering(callback);
        },
        /**
         * take values from the custom text fields and update the values in the context
         */
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
        }
    });
});

require(["DatePair/widget/DatePair"]);