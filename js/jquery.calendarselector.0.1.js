/**
 * jQuery Calendar Selector plugin
 * This jQuery plugin add a calendar picker.
 * @name jquery.calendarselector.0.1.js
 * @author Jun Ichikawa
 * @version 0.1
 * @date Nov 1, 2012
 * @category jQuery plugin
 * @copyright (c) 2012 Jun Ichikawa
 * @example Visit https://github.com/sparkgene/calendarselector
 */
;(function($) {

    $.fn.CalendarSelector = function(options) {
 
        var elements = this;
        var opts = $.extend({}, $.fn.CalendarSelector.defaults, options);
        
        elements.each(function() {
        	init($(this), opts);
        });
 
        return this;
    };
 
	var
	_options = null,
	_thisMonthStartDate = null,
	_thisMonthEndDate = null,
	_thisGridStartDate = null,
	_thisGridEndDate = null,
	_gridCellArray = new Array(),
	_width = 0,
	_height = 0,
	_selectedDay = null;
	
	var
	_SECONDS_IN_DAY = 86400000,
	_WEEKDAY_CELL_HEIGHT = 20,
	_NAVIGATOR_HEIGHT = 20,
	_CLASS_CALENDAR_OUTER = "calendarselector_outer",
	_CLASS_CALENDAR_NAVIGATOR = "navigator",
	_CLASS_CALENDAR_NAVIBTN_LEFT = "navi_btn_left",
	_CLASS_CALENDAR_NAVIBTN_RIGHT = "navi_btn_right",
	_CLASS_CALENDAR_NAVI_TITLE = "navi_title",
	_CLASS_CALENDAR_GRID = "grid_outer",
	_CLASS_CALENDAR_WEEKDAY_CELL = "weekday_cell",
	_CLASS_CALENDAR_DATE_CELL = "date_cell",
	_CLASS_CALENDAR_DATE_CELL_ON = "date_cell_on",
	_CLASS_CALENDAR_DATE_CELL_TARGET_MONTH = "date_cell_target_month",
	_CLASS_CALENDAR_DATE_CELL_TARGET_MONTH_ON = "date_cell_target_month_on";
	
	//===============
	// Initialization
	//===============
	function init($obj, opts) {
		var dt;
		_options = opts;
		_selectedDay = opts.selectedDay;
		if( _options.defaultDate == null ){
			dt = new Date();
		}
		else{
			dt = is_date(_options.defaultDate);
			if( dt === false ){
				dt = new Date();
			}
		}
		createGrid($obj, dt);

	}
	
	function is_date(str){
		try{
    		if( str.match(/^\d{4}\/\d{2}\/\d{2}$/) ){
    			// yyyy/mm/dd
    			var dtarr = str.split("/");
    			return new Date(parseInt(dtarr[0]), parseInt(dtarr[1]) -1, 1);
    		}
    		else if( str.match(/^\d{4}\-\d{2}\-\d{2}$/) ){
    			// yyyy/mm/dd
    			var dtarr = str.split("-");
    			return new Date(parseInt(dtarr[0]), parseInt(dtarr[1]) -1, 1);	    			
    		}
    		else if( str.match(/^\d{8}$/) ){
    			return new Date(parseInt(str.substr(0, 4)), parseInt(str.substr(4, 2)) -1, 1);
    		}
		}
		catch(e){
			return false;
		}
		return false;
	}
	
	function createGrid($obj, targetDate){
		
		$(".calendarselector_outer").remove();
		
		_thisMonthStartDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
		_thisMonthEndDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
		
		var target_month = targetDate.getMonth();
		_thisGridStartDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
		_thisGridEndDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
		if( targetDate.getDay() > _options.startDay ){
			var days = targetDate.getDay() - _options.startDay;
			_thisGridStartDate.setTime( targetDate.getTime() - (_SECONDS_IN_DAY * days) );
		}
		else if( targetDate.getDay() < _options.startDay ){
			var days = 7 - _options.startDay + targetDate.getDay();
			_thisGridStartDate.setTime( targetDate.getTime() - (_SECONDS_IN_DAY * days) );
		}
		
		var endDay = _options.startDay - 1;
		if( endDay < 0 ) endDay = 6;
		if( _thisGridEndDate.getDay() < endDay ){
			var days = endDay - _thisGridEndDate.getDay();
			_thisGridEndDate.setTime( _thisGridEndDate.getTime() + (_SECONDS_IN_DAY * days) );
		}
		else if( endDay < _thisGridEndDate.getDay() ){
			var days = 7 - _thisGridEndDate.getDay() + endDay;
			_thisGridEndDate.setTime( _thisGridEndDate.getTime() + (_SECONDS_IN_DAY * days) );				
		}

		var dateCount = ((_thisGridEndDate - _thisGridStartDate) / _SECONDS_IN_DAY) + 1;			
		var _cellWidth = Math.floor((_options.width - 10 - 14) / 7) - 3;
		var _cellHeight = Math.floor((_options.height - _WEEKDAY_CELL_HEIGHT - _NAVIGATOR_HEIGHT - 20) / (dateCount / 7)) - 5;
		var _outer_width = ((_cellWidth + 1) * 7) + 19;

		var cal_outer = $("<div>")
	      .addClass(_CLASS_CALENDAR_OUTER)
	      .width(_outer_width);
		
		var cal_navi = $("<div>")
	      .addClass(_CLASS_CALENDAR_NAVIGATOR)
	      .width(_outer_width)
	      .height(_NAVIGATOR_HEIGHT);
		
		var navi_left = $("<a href='#'>").addClass(_CLASS_CALENDAR_NAVIBTN_LEFT).text("<<");
		var navi_right = $("<a href='#'>").addClass(_CLASS_CALENDAR_NAVIBTN_RIGHT).text(">>");
		var navi_title = $("<div>")
			.addClass(_CLASS_CALENDAR_NAVI_TITLE)
			.text(_thisMonthStartDate.getFullYear() + "  " + _options.monthString[target_month])
			.width(_outer_width-100);

		var cal_grid = $("<div>")
	      .addClass(_CLASS_CALENDAR_GRID)
	      .width(_outer_width-5);

		var weekday_idx = _thisGridStartDate.getDay();
		for(i = 0;i<7;i++){
			$("<div>")
		      .addClass(_CLASS_CALENDAR_WEEKDAY_CELL)
		      .width(_cellWidth)
		      .height(_WEEKDAY_CELL_HEIGHT)
		      .text(_options.weekdayString[weekday_idx])
		      .appendTo(cal_grid);
			weekday_idx++
			if( weekday_idx >= 7 ) weekday_idx = 0;
		}
		
		$("<div>").addClass("float_clear").appendTo(cal_grid);

		var wk_day = _thisGridStartDate;
		var date_str = "";
		for(i=0;i<dateCount;i++){
			var cell = $("<div>")
		      .addClass(_CLASS_CALENDAR_DATE_CELL)
		      .width(_cellWidth)
		      .height(_cellHeight)
		      .attr("data-date", getFormatDate(wk_day));
			
			if( wk_day.getMonth() == target_month ){
				date_str = wk_day.getDate();
				cell.addClass(_CLASS_CALENDAR_DATE_CELL_TARGET_MONTH);
				if( _options.selectedDay.indexOf(getFormatDate(wk_day)) >= 0 ){
					cell.attr("data-on", "1")
						.addClass(_CLASS_CALENDAR_DATE_CELL_TARGET_MONTH_ON);
				}
			}
			else{
				date_str = (wk_day.getMonth() + 1) + "/" + wk_day.getDate();
				if( _options.selectedDay.indexOf(getFormatDate(wk_day)) >= 0 ){
					cell.attr("data-on", "1")
						.addClass(_CLASS_CALENDAR_DATE_CELL_ON);
				}
			}

			cell.text(date_str).appendTo(cal_grid);
			
			cell.on("click", function(){
				if($(this).attr("data-on") == "1" ){
					$(this).removeAttr("data-on");
					if( $(this).hasClass(_CLASS_CALENDAR_DATE_CELL_TARGET_MONTH) ){
						$(this).removeClass(_CLASS_CALENDAR_DATE_CELL_TARGET_MONTH_ON);							
					}
					else{
						$(this).removeClass(_CLASS_CALENDAR_DATE_CELL_ON);														
					}
					delArray($(this).attr("data-date"));
					_options.dateClicked.call(this, $(this).attr("data-date"), false);
				}
				else{
					$(this).attr("data-on", "1");
					if( $(this).hasClass(_CLASS_CALENDAR_DATE_CELL_TARGET_MONTH) ){
						$(this).addClass(_CLASS_CALENDAR_DATE_CELL_TARGET_MONTH_ON);							
					}
					else{
						$(this).addClass(_CLASS_CALENDAR_DATE_CELL_ON);														
					}
					_selectedDay.push($(this).attr("data-date"));
					_options.dateClicked.call(this, $(this).attr("data-date"), true);
				}
			});

			wk_day.setTime(wk_day.getTime() + _SECONDS_IN_DAY);
		}

		$("<div>").addClass("float_clear").appendTo(cal_grid);

		navi_left.appendTo(cal_navi);
		navi_title.appendTo(cal_navi);
		navi_right.appendTo(cal_navi);
		cal_navi.appendTo(cal_outer);
		cal_grid.appendTo(cal_outer);
		cal_outer.appendTo($obj);
		
		navi_left.on("click",function(){last_month($obj)})
		navi_right.on("click",function(){next_month($obj)})
	}

	function next_month($obj){
		var dt = new Date(_thisMonthStartDate.getFullYear(), _thisMonthStartDate.getMonth() + 1, 1);
		createGrid($obj, dt);
	}

	function last_month($obj){
		var dt = new Date(_thisMonthStartDate.getFullYear(), _thisMonthStartDate.getMonth() - 1, 1);
		createGrid($obj, dt);
	}
	
	function getFormatDate(wk){
		var m = "00" + (wk.getMonth() + 1);
		var d = "00" + wk.getDate();
		return wk.getFullYear() + "-" + m.substr( m.length -2 , 2 ) + "-" + d.substr( d.length -2 , 2 );
	}
	
	function delArray(dt){
		if( _selectedDay.length <= 0 ) return;

		var i, len = _selectedDay.length - 1;
		for(i = len; i >= 0; i--){
			if(_selectedDay[i] == dt){
				_selectedDay.splice(i,1);
			}
		}
	}

	function dateClickedCallback(dt, isOn){
		;
	}

    $.fn.CalendarSelector.defaults = {
    		width: 			500, // width not including margins, borders or padding
    		height:	 		400, // height not including margins, borders or padding
    		defaultDate:	null, // Specify the date which want to show first. The date format "yyyy/mm/dd", "yyyy-mm-dd", "yyyymmdd" can be specified.

    		// Weekday name used for header 
    		weekdayString:	new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
    		// Month name used for header 
    		monthString:	new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
    		// Most left column Day. 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
    		startDay:		0,
    		// default highlighted date. The date format is only "yyyy-mm-dd"
    		selectedDay:	[],
    		// callback function for recive clicked date.
    		dateClicked:	dateClickedCallback
    };

    $.extend($.fn.CalendarSelector , {
    	getSelectedDate : function(){
    		return _selectedDay;
    	}
    });
}) (jQuery);