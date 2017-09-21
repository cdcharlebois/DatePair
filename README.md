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

+ `breakpoint` : Screen width (in pixels) to split between the large number of items and the small number
+ `Large Number` : Number of tabs to show above the breakpoint
+ `Small Number` : Number of tabs to show below the breakpoint
+ `Tabs Class (To Add)` : Add a class to the bar of tab headings

### Typical usage scenario

- When you have a lot of tabs and don't want them to stack 🍔
- Works nicely with **[Swipeable Tabs](https://github.com/cdcharlebois/SwipeableTabs)** widget

### Known Limitations

- none

###### Based on the Mendix Widget Boilerplate

See [AppStoreWidgetBoilerplate](https://github.com/mendix/AppStoreWidgetBoilerplate/) for an example
