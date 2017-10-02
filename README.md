---
typora-copy-images-to: ./assets
typora-root-url: .
---

![badge](https://img.shields.io/badge/mendix-7.5.0-green.svg) ![badge](https://img.shields.io/badge/mobile-friendly-green.svg)

# DateTime

![Here it is](./basic.gif)


### Installation

1. Install the widget in your project
2. Include the **DateTime** widget on a page where you'd like to display an independent date and time picker for a Datetime attribute. Individual widgets **Date**, and **Time** are also available, with just their specific set of properties.
3. Configure the widget:
   ![F4033A56-F66C-4A78-9440-75B74C12FB78](/assets/F4033A56-F66C-4A78-9440-75B74C12FB78.png)

+ `DateTime` : The attribute(s) to use for the Datetimes displayed
+ `Editable` : Should the fields be editable? (Entity `isReadOnlyAttr()` will override this.)

##### Date Settings

![A0942FB4-1D46-4029-B175-B240D007FBE6](/assets/A0942FB4-1D46-4029-B175-B240D007FBE6.png)

- `Date Format`: the format to display the date. Follow [this guide](http://amsul.ca/pickadate.js/date/#formatting-rules).

- `Earliest Selectable Date`: The earliest date a user can select, in days relative to today.

- `Earliest Date Attr` : An attribute containing the earliest date a user can select (overrides `Earliest Selectable Date`)

- `Start Open` : Should the control start open?

##### Date Restrictions

![52D4B46E-BF9D-4ABD-A198-266E19CBF955](/assets/52D4B46E-BF9D-4ABD-A198-266E19CBF955.png)

- `Disabled Days` : Days of the week that the user may not select.
- `Date Entity`, `Microflow`, `Date Attribute` : In conjunction, these properties allow you disable a list of days. Configure a microflow **Microflow**, such that it returns a list of entities **Date Entity**, having an attribute **Date Attribute**. The dates present in **Date Attribute** will be greyed out in the picker and unavailable for the user to select.

##### Time Settings

![F29E1981-7D6E-463F-A756-4831AC17C11A](/assets/F29E1981-7D6E-463F-A756-4831AC17C11A.png)

- `Time Format` : The format to display the time. Follow [this guide](http://amsul.ca/pickadate.js/time/#formatting-rules).
- `Interval` : Interval of times to select (in minutes)
- `Earliest Selectable Time` : Enter an integer to have the earliest selectable time be relative to now, or a 24h time.

##### Time Restrictions

![96A8138E-2874-49E9-8392-8A7E6C277000](/assets/96A8138E-2874-49E9-8392-8A7E6C277000.png)

`Time Entity, Times Microflow, Time Attribute` : In conjunction, these properties allow you disable a list of days. Configure a microflow **Times Microflow**, such that it returns a list of entities **Time Entity**, having an attribute **Time Attribute**. The times present in **Time Attribute** will be greyed out in the picker and unavailable for the user to select.

`Disabled Times` : Comma-separated list of times, in 24h format.

### Typical usage scenario

- For better control over the UI when a user needs to pick a date or time.

### Known Limitations

- none at this time.

###### Based on the Mendix Widget Boilerplate

See [AppStoreWidgetBoilerplate](https://github.com/mendix/AppStoreWidgetBoilerplate/) for an example
