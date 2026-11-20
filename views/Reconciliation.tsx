import React, { useState, useMemo } from 'react';
import DataTable from '../components/DataTable';
import type { Transaction, BankStatementTransaction } from './types';
import { useAppContext } from '../AppContext';
import { TransactionStatus } from './types';
import TransactionAmount from '../components/TransactionAmount';
import { formatCurrency } from '../utils/formatters';

const Reconciliation: React.FC = () => {
    const { transactions, bankStatementTransactions, handleReconcile } = useAppContext();
    const [selectedBookTxns, setSelectedBookTxns] = useState<Set<string>>(new Set());
    const [selectedBankTxns, setSelectedBankTxns] = useState<Set<string>>(new Set());
    
    const unreconciledBookTxns = useMemo(() => transactions.filter(t => t.status !== TransactionStatus.RECONCILED), [transactions]);
    const unreconciledBankTxns = useMemo(() => bankStatementTransactions.filter(t => !t.isReconciled), [bankStatementTransactions]);

    const totalSelectedBook = useMemo(() => unreconciledBookTxns.filter(t => selectedBookTxns.has(t.id)).reduce((sum, t) => sum + (t.type === 'Credit' ? t.amount : -t.amount), 0), [selectedBookTxns, unreconciledBookTxns]);
    const totalSelectedBank = useMemo(() => unreconciledBankTxns.filter(t => selectedBankTxns.has(t.id)).reduce((sum, t) => sum + (t.type === 'Credit' ? t.amount : -t.amount), 0), [selectedBankTxns, unreconciledBankTxns]);
    
    const handleSelectBook = (id: string) => {
        const newSet = new Set(selectedBookTxns);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedBookTxns(newSet);
    };

    const handleSelectBank = (id: string) => {
        const newSet = new Set(selectedBankTxns);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedBankTxns(newSet);
    };

    const onReconcile = () => {
        if (totalSelectedBook !== totalSelectedBank || selectedBookTxns.size === 0) {
            alert('Selected totals must match and not be zero.');
            return;
        }
        handleReconcile(Array.from(selectedBookTxns), Array.from(selectedBankTxns));
        setSelectedBookTxns(new Set());
        setSelectedBankTxns(new Set());
    };

    const bookColumns = [
        { header: 'Select', accessor: 'id' as keyof Transaction, render: (row: Transaction) => <input type="checkbox" checked={selectedBookTxns.has(row.id)} onChange={() => handleSelectBook(row.id)} /> },
        { header: 'Date', accessor: 'date' as keyof Transaction },
        { header: 'Description', accessor: 'description' as keyof Transaction },
        { header: 'Amount', accessor: 'amount' as keyof Transaction, render: (row: Transaction) => <TransactionAmount amount={row.amount} type={row.type} /> },
    ];
    
    const bankColumns = [
        { header: 'Select', accessor: 'id' as keyof BankStatementTransaction, render: (row: BankStatementTransaction) => <input type="checkbox" checked={selectedBankTxns.has(row.id)} onChange={() => handleSelectBank(row.id)} /> },
        { header: 'Date', accessor: 'date' as keyof BankStatementTransaction },
        { header: 'Description', accessor: 'description' as keyof BankStatementTransaction },
        { header: 'Amount', accessor: 'amount' as keyof BankStatementTransaction, render: (row: BankStatementTransaction) => <TransactionAmount amount={row.amount} type={row.type as any} /> },
    ];

  return (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Bank Reconciliation</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DataTable columns={bookColumns} data={unreconciledBookTxns} title="Company Book Entries" itemsPerPage={5} />
            <DataTable columns={bankColumns} data={unreconciledBankTxns} title="Bank Statement Entries" itemsPerPage={5} />
        </div>
        
        <div className="mt-8 bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
            <div className="flex space-x-8 font-semibold">
                <p>Book Selected: <span className="font-mono">{formatCurrency(totalSelectedBook)}</span></p>
                <p>Bank Selected: <span className="font-mono">{formatCurrency(totalSelectedBank)}</span></p>
                <p>Difference: <span className={`font-mono ${totalSelectedBook - totalSelectedBank !== 0 ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(totalSelectedBook - totalSelectedBank)}</span></p>
            </div>
            <button
                onClick={onReconcile}
                disabled={totalSelectedBook !== totalSelectedBank || totalSelectedBook === 0}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed font-bold"
            >
                Reconcile
            </button>
        </div>
    </div>
  );
};

export default Reconciliation;