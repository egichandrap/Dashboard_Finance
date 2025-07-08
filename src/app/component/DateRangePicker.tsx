"use client";

import React, { useState, useRef, useEffect } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

interface DateRangePickerProps {
  dateRange: {
    startDate: Date;
    endDate: Date;
    key: string;
  };
  onDateRangeChange: (range: { startDate: Date; endDate: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onDateRangeChange }) => {
  const [showCalendar, setShowCalendar] = React.useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // Close calendar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputClick = () => {
    setShowCalendar(true);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <div className="flex items-center space-x-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start
          </label>
          <input
            type="text"
            readOnly
            value={format(dateRange.startDate, "yyyy/MM/dd")}
            onClick={handleInputClick}
            className="border border-gray-300 rounded px-3 py-1 cursor-pointer dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <span className="text-gray-500 dark:text-gray-400">-</span>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End
          </label>
          <input
            type="text"
            readOnly
            value={format(dateRange.endDate, "yyyy/MM/dd")}
            onClick={handleInputClick}
            className="border border-gray-300 rounded px-3 py-1 cursor-pointer dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>
      {showCalendar && (
        <div className="absolute z-50 mt-2">
          <DateRange
            editableDateInputs={true}
            onChange={(ranges: RangeKeyDict) => {
              const selection = ranges.selection;
              onDateRangeChange({
                startDate: selection.startDate || new Date(),
                endDate: selection.endDate || new Date(),
              });
            }}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            maxDate={new Date()}
            months={2}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
