"use client";

import React, { useState, useEffect } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Link from 'next/link';

const sidebarItems = [
  { name: 'Dashboard', icon: '📊', href: '/' },
  { name: 'Analytics', icon: '📈', href: '/analytics' },
  { name: 'My Wallet', icon: '👛', href: '/my-wallet' },
  { name: 'Accounts', icon: '👥', href: '/accounts' },
  { name: 'Settings', icon: '⚙️', href: '/settings' },
  { name: 'Security', icon: '🛡️', href: '/security' },
  { name: 'Help Centre', icon: '❓', href: '/help-centre' },
];

export default function MyWallet() {
  const [darkMode, setDarkMode] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    amount: '',
    saving: false,
  });
  const [savingTransactions, setSavingTransactions] = useState<any[]>([]);
  const [totalSavingAmount, setTotalSavingAmount] = useState(0);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  const totalIncome = allTransactions
    .filter(t => t.Type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.Amount), 0);

  const totalExpense = allTransactions
    .filter(t => t.Type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.Amount), 0);

  const totalBalance = totalIncome - totalExpense;

  useEffect(() => {
    // Fetch all transactions
    const token = localStorage.getItem('authToken');
    fetch('http://localhost:19000/api/transactions/list', {
      headers: {
        Authorization: token || '',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setAllTransactions(data.data);
          const savingTxns = data.data.filter((item: any) => item.IsSaving === true);
          setSavingTransactions(savingTxns);
          const total = savingTxns.reduce((sum: number, item: any) => sum + item.Amount, 0);
          setTotalSavingAmount(total);
        } else {
          setAllTransactions([]);
          setSavingTransactions([]);
          setTotalSavingAmount(0);
        }
      })
      .catch((err) => {
        console.error(err);
        setAllTransactions([]);
        setSavingTransactions([]);
        setTotalSavingAmount(0);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const payload = {
      Type: formData.type,
      Category: formData.category,
      Amount: parseFloat(formData.amount),
      IsSaving: formData.saving,
    };
    console.log(payload);
    fetch('http://localhost:19000/api/transactions/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create transaction');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Transaction created:', data);
        // Refresh all transactions list
        return fetch('http://localhost:19000/api/transactions/list', {
          headers: {
            Authorization: token || '',
          },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          setAllTransactions(data.data);
          const savingTxns = data.data.filter((item: any) => item.IsSaving === true);
          setSavingTransactions(savingTxns);
          const total = savingTxns.reduce((sum: number, item: any) => sum + item.Amount, 0);
          setTotalSavingAmount(total);
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={darkMode ? 'dark flex h-screen' : 'flex h-screen'}>
      {/* Sidebar */}
      <aside className="bg-purple-700 text-white w-64 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center mb-10">
            <img src="https://i.pinimg.com/736x/ab/86/21/ab8621adf8390f840106197f204d0743.jpg" className="rounded-full p-2 mr-2" style={{ width: 80, height: 80 }} />
            <span className="font-bold text-xl">mumet</span>
          </div>
          <nav>
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center mb-6 rounded p-2 hover:bg-purple-600 ${item.name === 'Dashboard' ? 'bg-purple-900' : ''
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
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
          <img src="https://i.pinimg.com/736x/9e/a9/e4/9ea9e43b348a49cb36f1a8a29df3645c.jpg" alt="User" className="rounded-full mr-3" style={{ width: 50, height: 50 }} />
          <div>
            <div>Egichandrap</div>
            <div className="text-sm text-purple-300">Backend Developer</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">My Wallet</h1>

        {/* Total Balance with Eye Icon */}
        <div className="flex items-center mb-6">
          <div className="text-lg font-semibold mr-4">Total Balance:</div>
          <div className="text-xl font-bold mr-4">
            {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}` : '••••••'}
          </div>
          <button
            aria-label={balanceVisible ? 'Hide balance' : 'Show balance'}
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
          >
            {balanceVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        {/* Create Income Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-8 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Create Income</h2>

          <label className="block mb-2">
            <span className="text-gray-700 dark:text-gray-300">Type</span>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>
          </label>

          <label className="block mb-2">
            <span className="text-gray-700 dark:text-gray-300">Category</span>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter category"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-gray-700 dark:text-gray-300">Amount</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </label>

          <label className="block mb-4 flex items-center">
            <input
              type="checkbox"
              name="saving"
              checked={formData.saving}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">Saving</span>
          </label>

          <button
            type="submit"
            className="bg-purple-700 text-white rounded px-4 py-2 hover:bg-purple-800 focus:outline-none"
          >
            Create Income
          </button>
        </form>

        {/* Saving Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 max-w-md shadow">
          <h2 className="text-lg font-semibold mb-2">SAVING</h2>
          <p>Total Saving Amount: ${totalSavingAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })}</p>
          <ul className="mt-2 max-h-40 overflow-auto">
            {savingTransactions.map((txn) => (
              <li key={txn.ID} className="text-sm">
                {txn.Category} - ${txn.Amount.toLocaleString('en-US')}
              </li>
            ))}
          </ul>
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
