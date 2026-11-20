import React, { useState, useMemo } from 'react';
import type { CurrencyRate } from './types';
import { formatCurrency } from '../utils/formatters';
import CurrencyExchangeIcon from '../components/icons/CurrencyExchangeIcon';

const mockRates: CurrencyRate[] = [
    { id: '1', fromCurrency: 'USD', toCurrency: 'INR', rate: 83.50, lastUpdated: '2023-10-27 15:00 UTC' },
    { id: '2', fromCurrency: 'EUR', toCurrency: 'INR', rate: 88.25, lastUpdated: '2023-10-27 15:00 UTC' },
    { id: '3', fromCurrency: 'GBP', toCurrency: 'INR', rate: 101.75, lastUpdated: '2023-10-27 15:00 UTC' },
    { id: '4', fromCurrency: 'JPY', toCurrency: 'INR', rate: 0.55, lastUpdated: '2023-10-27 15:00 UTC' },
    { id: '5', fromCurrency: 'INR', toCurrency: 'USD', rate: 1 / 83.50, lastUpdated: '2023-10-27 15:00 UTC' },
];

const CurrencyExchange: React.FC = () => {
    const [amount, setAmount] = useState(100);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');

    const conversionResult = useMemo(() => {
        if (fromCurrency === toCurrency) return amount;
        const rate = mockRates.find(r => r.fromCurrency === fromCurrency && r.toCurrency === toCurrency);
        if (!rate) { // Try inverse
            const inverseRate = mockRates.find(r => r.fromCurrency === toCurrency && r.toCurrency === fromCurrency);
            if(inverseRate) return amount * (1/inverseRate.rate);
            return null;
        }
        return amount * rate.rate;
    }, [amount, fromCurrency, toCurrency]);

    const allCurrencies = useMemo(() => Array.from(new Set(mockRates.flatMap(r => [r.fromCurrency, r.toCurrency]))), []);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-full text-primary">
                    <CurrencyExchangeIcon />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Currency Exchange</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Conversion Calculator</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Amount</label>
                            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="flex items-end space-x-2">
                             <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700">From</label>
                                <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                    {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                             <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700">To</label>
                                <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                    {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="pt-4 text-center">
                            <p className="text-gray-500">{amount} {fromCurrency} =</p>
                            <p className="text-3xl font-bold text-primary mt-1">
                                {conversionResult !== null ? `${(conversionResult).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency}` : 'Rate unavailable'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Exchange Rates (vs INR)</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 font-semibold text-gray-600">Currency</th>
                                <th className="p-2 font-semibold text-gray-600">Rate</th>
                                <th className="p-2 font-semibold text-gray-600">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockRates.filter(r => r.toCurrency === 'INR').map(rate => (
                                <tr key={rate.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-bold text-gray-800">{rate.fromCurrency}</td>
                                    <td className="p-3 font-mono">{rate.rate.toFixed(4)}</td>
                                    <td className="p-3 text-sm text-gray-500">{rate.lastUpdated}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CurrencyExchange;
