import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useAppContext } from '../AppContext';
import type { TellerTransaction } from './types';
import { formatCurrency } from '../utils/formatters';
import TransactionAmount from '../components/TransactionAmount';

const TellerOperations: React.FC = () => {
    const { tellerTransactions, customerAccounts, currentUser } = useAppContext();
    const [transactionType, setTransactionType] = useState<'Deposit' | 'Withdrawal'>('Deposit');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');

    const handleTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Simulating ${transactionType} of ${formatCurrency(Number(amount))} for account ${accountNumber}.`);
        setAccountNumber('');
        setAmount('');
    };

    const columns: Column<TellerTransaction>[] = [
        { header: 'Date', accessor: 'date' },
        { header: 'Type', accessor: 'transactionType' },
        { header: 'Account', accessor: 'accountNumber' },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Amount', accessor: 'amount', render: (row) => <TransactionAmount amount={row.amount} type={row.transactionType === 'Deposit' ? 'Credit' : 'Debit'} /> },
        { header: 'Teller', accessor: 'teller' },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Teller Operations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleTransaction} className="bg-white p-6 rounded-xl shadow-md space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Post Transaction</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                            <div className="mt-1 grid grid-cols-2 gap-2">
                                <button type="button" onClick={() => setTransactionType('Deposit')} className={`p-2 rounded-md font-semibold text-sm ${transactionType === 'Deposit' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-600'}`}>Deposit</button>
                                <button type="button" onClick={() => setTransactionType('Withdrawal')} className={`p-2 rounded-md font-semibold text-sm ${transactionType === 'Withdrawal' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-100 text-gray-600'}`}>Withdrawal</button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Customer Account Number</label>
                            <input type="text" id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="mt-1 w-full p-2 border-gray-300 border rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full p-2 border-gray-300 border rounded-md" required />
                        </div>
                        <button type="submit" className="w-full py-2 px-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark">
                            Post
                        </button>
                    </form>
                </div>
                <div className="lg:col-span-2">
                    <DataTable
                        columns={columns}
                        data={tellerTransactions}
                        title="Today's Teller Transactions"
                        itemsPerPage={5}
                    />
                </div>
            </div>
        </div>
    );
};

export default TellerOperations;