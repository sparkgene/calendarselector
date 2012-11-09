calendarselector
================

Add the Calendar Selector UI to your site.

This plugin works with 

 JQuery ([http://jquery.com/](http://jquery.com/)) tested with JQuery v1.8.*

### Demo

 
[Demo page](http://sparkgene.com/demos/calendarselector/demo.html)

### Usage

#### 1. You need to load the jQuery Library, the scraping Library and the scrapingJS stylesheet in the header of your html document:

```javascript
<script src="src/jquery.js"></script>
<script src="js/jquery.calendarselector.0.1.js"></script>
<link href="css/jquery.calendarselector.0.1.css" rel="stylesheet">
```

#### 2. Initialize the plugin.

```javascript
$(function() {
	var obj = $('#cal_area').CalendarSelector({
		width : 500,
		height : 400,
		dateClicked: dateClicked
	});
});
```

*****

### Options

| option name | default | description |
|:-----------|:------------|:------------|
| width | 500 | width (not including margins, borders or padding) |
| height | 400 | height not including margins, borders or padding |
| defaultDate | null | Specify the date which want to show first. The date format "yyyy/mm/dd", "yyyy-mm-dd", "yyyymmdd" can be specified. |
| weekdayString | new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat") | Weekday name used for header |
| monthString | new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec") | Month name used for header |
| startDay | 0 | Most left column Day. 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday |
| selectedDay | [] | default highlighted date. The date format is only "yyyy-mm-dd" |
| dateClicked | dateClickedCallback | callback function for recive clicked date. |
