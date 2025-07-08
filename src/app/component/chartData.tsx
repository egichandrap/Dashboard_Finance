"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
} from "recharts";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const API_BASE_URL = "http://localhost:19000";

// warna mengikuti mock‑up
const COLOR_INCOME = "#5B50FF";   // ungu
const COLOR_OUTCOME = "#29C5FF";  // cyan

// helper: mapping indeks → nama bulan singkat
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// konversi nilai price string "$123" → number 123
const parsePrice = (p) => Number(p.replace(/\$/g, ""));

const AnalyticsBarChart = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedYear, setSelectedYear] = useState(""); // akan di‑set setelah data datang
    const [startIndex, setStartIndex] = useState(0); // for pagination of months

    /* ---------- Fetch transaksi ---------- */
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        fetch(`${API_BASE_URL}/api/transactions/list`, {
            headers: { Authorization: token || "" },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.data && Array.isArray(data.data)) {
                    const mapped = data.data.map((item) => ({
                        id: item.ID,
                        dateObj: new Date(item.CreatedAt),
                        price: parseFloat(item.Amount),      // asumsi Amount sudah number
                        status: item.Type,                   // "INCOME" | "EXPENSE"
                    }));
                    setTransactions(mapped);
                    // set tahun default = tahun transaksi terbaru
                    const years = [...new Set(mapped.map((t) => t.dateObj.getFullYear()))];
                    setSelectedYear(String(Math.max(...years)));
                }
            })
            .catch(console.error);
    }, []);

    /* ---------- Bangun data grafik ---------- */
    const chartData = useMemo(() => {
        if (!selectedYear) return [];

        // inisialisasi 12 bulan dengan 0
        const base = MONTHS.map((m) => ({ name: m, income: 0, outcome: 0 }));

        transactions
            .filter((t) => t.dateObj.getFullYear() === Number(selectedYear))
            .forEach((t) => {
                const monthIdx = t.dateObj.getMonth(); // 0‑11
                if (t.status === "INCOME") base[monthIdx].income += t.price;
                if (t.status === "EXPENSE") base[monthIdx].outcome += t.price;
            });

        // bulatkan ke satu desimal atau integer saja
        return base.map((b) => ({
            ...b,
            income: Number(b.income.toFixed(1)),
            outcome: Number(b.outcome.toFixed(1)),
        })).slice(startIndex, startIndex + 8); // show 8 months at a time
    }, [transactions, selectedYear, startIndex]);

    /* ---------- List tahun untuk dropdown ---------- */
    const years = useMemo(() => {
        const uniq = Array.from(new Set(transactions.map((t) => t.dateObj.getFullYear()))).sort();
        return uniq.map(String);
    }, [transactions]);

    // Pagination controls
    const canGoPrev = startIndex > 0;
    const canGoNext = startIndex + 8 < MONTHS.length;

    const handlePrev = () => {
        if (canGoPrev) setStartIndex(startIndex - 1);
    };

    const handleNext = () => {
        if (canGoNext) setStartIndex(startIndex + 1);
    };

    // YAxis tick formatter to show K values
    const yAxisTickFormatter = (value) => {
        if (value >= 1000) {
            return `${value / 1000}K`;
        }
        return value;
    };

    return (
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Analytics</h2>

                {/* Dropdown Year */}
                {years.length > 0 && (
                    <Listbox value={selectedYear} onChange={setSelectedYear}>
                        <div className="relative">
                            <Listbox.Button className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md text-sm">
                                {selectedYear}
                                <ChevronDownIcon className="h-4 w-4" />
                            </Listbox.Button>
                            <Listbox.Options className="absolute right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-md z-10">
                                {years.map((y) => (
                                    <Listbox.Option
                                        key={y}
                                        value={y}
                                        className="cursor-pointer px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
                                    >
                                        {y}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>
                )}
            </div>

            {/* Legend manual (dot + label) */}
            <div className="flex gap-4 mb-2 px-1">
                <div className="flex items-center gap-1 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: COLOR_INCOME }} />
                    <span className="dark:text-gray-100">Income</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: COLOR_OUTCOME }} />
                    <span className="dark:text-gray-100">Outcome</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-72 relative"> {/* tinggi dapat diubah */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={yAxisTickFormatter} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            formatter={(val) => `$${Number(val).toLocaleString("en-US")}`}
                            labelFormatter={(label) => `${label} ${selectedYear}`}
                        />
                        <Bar dataKey="income" fill={COLOR_INCOME} radius={[4, 4, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="outcome" fill={COLOR_OUTCOME} radius={[4, 4, 0, 0]} maxBarSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default AnalyticsBarChart;
