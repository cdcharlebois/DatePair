---
typora-copy-images-to: ./assets
typora-root-url: .
---

![badge](https://img.shields.io/badge/mendix-7.5.0-green.svg) ![badge](https://img.shields.io/badge/mobile-friendly-green.svg)

# DateTime & DatePair


### Installation

1. Install the widget in your project
2. Include the **DateTime** widget on a page where you'd like to display an independent date and time picker for a Datetime attribute. Include the **DatePair** widget on a page where you'd like to display a linked pair of Datetime attributes (i.e. a start and end datetime, for appointments, etc)
3. Configure the widget:
   ![17FF3ADE-3D12-47F7-B48F-A25A05467E2A](/assets/17FF3ADE-3D12-47F7-B48F-A25A05467E2A.png)

+ `DateTime` : The attribute(s) to use for the Datetimes displayed
+ `Time Format` : The format of the timepicker (follows [this formatting](http://php.net/manual/en/function.date.php))
+ `Date Format` : the format of the datepicker (follows [this formatting](http://bootstrap-datepicker.readthedocs.io/en/latest/options.html#format))
+ `Editable` : Should the fields be editable? (Entity `isReadOnlyAttr()` will override this.)

### Typical usage scenario

- Scheduling appointments (since is shows the duration when both are on the same day)

### Known Limitations

- none

###### Based on the Mendix Widget Boilerplate

See [AppStoreWidgetBoilerplate](https://github.com/mendix/AppStoreWidgetBoilerplate/) for an example
