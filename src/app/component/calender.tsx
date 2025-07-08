"use client";

import React, { useState, useEffect } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

const API_BASE_URL = "http://localhost:19000";

const Calender = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (dateRange.startDate && dateRange.endDate) {
      const startDateStr = dateRange.startDate.toISOString().split('T')[0];
      const endDateStr = dateRange.endDate.toISOString().split('T')[0];
      fetch(`${API_BASE_URL}/api/transactions/search/date?startDate=${startDateStr}&endDate=${endDateStr}`, {
        headers: {
          Authorization: token || '',
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.data && Array.isArray(data.data)) {
            setTransactions(data.data.map((item: any) => ({
              id: item.ID,
              name: item.Category,
              date: new Date(item.CreatedAt).toDateString(),
              price: '$' + item.Amount.toFixed(0),
              status: item.Type,
              saving: item.IsSaving,
            })));
          } else {
            setTransactions([]);
          }
        })
        .catch(err => console.error(err));
    }
  }, [dateRange]);

  return (
    <div className="p-4">
      <DateRange
        editableDateInputs={true}
        onChange={(ranges: RangeKeyDict) => {
          const selection = ranges.selection;
          setDateRange({
            startDate: selection.startDate || new Date(),
            endDate: selection.endDate || new Date(),
            key: 'selection'
          });
        }}
        moveRangeOnFirstSelection={false}
        ranges={[dateRange]}
        maxDate={new Date()}
      />
      {/* Additional UI to display transactions or other content can be added here */}
    </div>
  );
};

export default Calender;
