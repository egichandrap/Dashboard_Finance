
"use client";
const API_BASE_URL = "http://localhost:19000";

import React, { useState, useEffect } from 'react';
import ChartData from './chartData';

const sidebarItems = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'Analytics', icon: '📈' },
  { name: 'My Wallet', icon: '👛' },
  { name: 'Accounts', icon: '👥' },
  { name: 'Settings', icon: '⚙️' },
  { name: 'Security', icon: '🛡️' },
  { name: 'Help Centre', icon: '❓' },
];

const summaryCards = [
  { title: 'Total Balance', amount: '$0.00', icon: '💰', changePositive: true },
  { title: 'Total Income', amount: '$0.00', icon: '💵', changePositive: true },
  { title: 'Total Saving', amount: '$0.00', icon: '🏦', changePositive: true },
  { title: 'Total Outcome', amount: '$0.00', icon: '📉', changePositive: false },
];

// Placeholder data for analytics chart
const analyticsData = [
  { month: 'Jan', income: 42000, outcome: 30000 },
  { month: 'Feb', income: 30000, outcome: 38000 },
  { month: 'Mar', income: 34000, outcome: 32000 },
  { month: 'Apr', income: 42000, outcome: 30000 },
  { month: 'May', income: 48000, outcome: 35000 },
  { month: 'Jun', income: 30000, outcome: 20000 },
  { month: 'Jul', income: 32000, outcome: 30000 },
  { month: 'Aug', income: 30000, outcome: 28000 },
  { month: 'Sep', income: 30000, outcome: 28000 },
  { month: 'Oct', income: 30000, outcome: 28000 },
  { month: 'Nov', income: 30000, outcome: 28000 },
  { month: 'Dec', income: 30000, outcome: 28000 },
];

// Placeholder cards data
const cards = [
  { type: 'Credit Card', number: '1234 5678 9101 1121', name: 'Jack Lewis', expiry: '06/21', brand: 'Mastercard' },
  { type: 'Credit Card', number: '1234 5678 9101 1121', name: 'Jack Lewis', expiry: '06/21', brand: 'VISA' },
];

// Placeholder transactions data
const initialTransactions = [
  { id: 1, name: 'Adobe After Effect', date: 'Sat, 20 Apr 2020', price: '$80.09', status: 'Completed', type: 'Outcome', saving: true},
  { id: 2, name: "Mcdonald's", date: 'Fri, 19 Apr 2020', price: '$7.03', status: 'Completed', type: 'Outcome', saving: false },
];

// Placeholder installment data
const installments = [
  { title: 'House Installments', collected: 120, total: 2000 },
  { title: 'Car Installments', collected: 500, total: 5000 },
];

const defaultChartData = [
  { name: "Income", value: 160000 },
  { name: "Expense", value: 70000 },
  { name: "Saving", value: 30000 },
];

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('10 May - 20 May');

  // const parsePrice = (price) => parseFloat(price.replace('$', ''));

  // // Count Persentase Changes
  // const toPercentChange = (oldVal, newVal) =>{
  //   if (oldVal === 0) return 'N/A';
  //   const diff = newVal - oldVal;
  //   const pct = (diff / oldVal) * 100;
  //   const sign = pct >= 0 ? '+' : '';
  //   return `${sign}${pct.toFixed(2)}%`;
  // }

  // const prevTransactions = transactions.slice(0, -1);

  // // Calculate Before Totals
  // const prevTotalIncome = prevTransactions
  // .filter(t => t.status === 'INCOME')
  // .reduce((sum, t) => sum + parsePrice(t.price), 0);
  
  // const prevTotalExpense = prevTransactions
  // .filter(t => t.status === 'EXPENSE')
  // .reduce((sum, t) => sum + parsePrice(t.price), 0);
  
  // const prevTotalSaving = prevTransactions
  // .filter(t => t.saving === true)
  // .reduce((sum, t) => sum + parsePrice(t.price), 0);
  
  // const prevTotalBalance = prevTotalIncome - prevTotalExpense;

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.status === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.price.replace('$', '')), 0);

  const totalExpense = transactions
    .filter(t => t.status === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.price.replace('$', '')), 0);

  const totalSaving = transactions
    .filter(t => t.saving == true)
    .reduce((sum, t) => sum + parseFloat(t.price.replace('$', '')), 0);

  const totalBalance = totalIncome - totalExpense;

  // Update summary cards with calculated values
  const updatedSummaryCards = [
    { title: 'Total Balance', amount: `$${totalBalance.toLocaleString('en-US')}`, icon: '💰', changePositive: true },
    { title: 'Total Income', amount: `$${totalIncome.toLocaleString('en-US')}`, icon: '💵', changePositive: true },
    { title: 'Total Saving', amount: `$${totalSaving.toLocaleString('en-US')}`, icon: '🏦', changePositive: true },
    { title: 'Total Outcome', amount: `$${totalExpense.toLocaleString('en-US')}`, icon: '📉', changePositive: false },
  ];

  // const updatedSummaryCards = [
  //   { title: 'Total Balance', amount: `$${totalBalance.toLocaleString('en-US')}`, change: toPercentChange(prevTotalBalance, totalBalance), icon: '💰', changePositive: true },
  //   { title: 'Total Income', amount: `$${totalIncome.toLocaleString('en-US')}`, change: toPercentChange(prevTotalIncome, totalIncome), icon: '💵', changePositive: true },
  //   { title: 'Total Saving', amount: `$${totalSaving.toLocaleString('en-US')}`, change: toPercentChange(prevTotalSaving, totalSaving), icon: '🏦', changePositive: true },
  //   { title: 'Total Outcome', amount: `$${totalExpense.toLocaleString('en-US')}`, change: toPercentChange(prevTotalExpense, totalExpense), icon: '📉', changePositive: false },
  // ];

  // Fetch transactions from API backend with Authorization header
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    fetch(`${API_BASE_URL}/api/transactions/list`, {
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
  }, []);

  return (
    <div className={darkMode ? 'dark flex h-screen' : 'flex h-screen'}>
      {/* Sidebar */}
      <aside className="bg-purple-700 text-white w-64 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center mb-10">
            <div className="bg-blue-400 rounded-full p-2 mr-2">🔥</div>
            <span className="font-bold text-xl">uifry™</span>
          </div>
          <nav>
            {sidebarItems.map((item) => (
              <div key={item.name} className="flex items-center mb-6 cursor-pointer hover:bg-purple-600 rounded p-2">
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </nav>
          <hr className="my-6 border-purple-500" />
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <span className="mr-3">🌙</span>
              <span>Dark Mode</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="flex items-center mt-10">
          <img src="https://i.pravatar.cc/40" alt="User" className="rounded-full mr-3" />
          <div>
            <div>Egichandrap</div>
            <div className="text-sm text-purple-300">Backend Developer</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {updatedSummaryCards.map((card) => (
          <div key={card.title} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{card.icon}</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{card.title}</div>
                <div className="text-xl font-bold">{card.amount}</div>
              </div>
            </div>
            <div className={card.changePositive ? 'text-green-500' : 'text-red-500'}></div>
          </div>
        ))}
        </section>

        {/* Analytics Chart Placeholder */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow">
          <h2 className="text-lg font-semibold mb-4">Analytics</h2>
          <ChartData />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cards Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">Cards</h2>
            {cards.map((card, idx) => (
              <div key={idx} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <div>{card.type}</div>
                  <div>{card.brand}</div>
                </div>
                <div className="text-xl font-mono mb-2">{card.number}</div>
                <div className="flex justify-between text-sm">
                  <div>{card.name}</div>
                  <div>{card.expiry}</div>
                </div>
              </div>
            ))}
            <button className="w-full border border-blue-500 text-blue-500 rounded-lg py-2 mt-2 hover:bg-blue-50">
              + Create new card
            </button>
          </section>

          {/* Transaction List Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Transaction</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search for anything...."
                  className="border border-gray-300 rounded px-3 py-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="10 May - 20 May"
                  className="border border-gray-300 rounded px-3 py-1"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                />
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2">Name</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((t) => (
                    <tr key={t.id} className="border-b border-gray-200">
                      <td className="py-2">{t.name}</td>
                      <td className="py-2">{t.date}</td>
                      <td className="py-2">{t.price}</td>
                      <th className="py-2">{t.status}</th>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>

          {/* Installment Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Installment</h2>
              <button className="text-blue-500 text-sm">See all</button>
            </div>
            {installments.map((inst, idx) => {
              const progress = (inst.collected / inst.total) * 100;
              return (
                <div key={idx} className="mb-4">
                  <div className="font-semibold mb-1">{inst.title}</div>
                  <div className="w-full bg-gray-300 rounded-full h-3 mb-1">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>Collected</div>
                    <div>
                      ${inst.collected.toFixed(2)}/${inst.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>

      <style jsx>{`
        /* Toggle switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 20px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #4f46e5;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
}
