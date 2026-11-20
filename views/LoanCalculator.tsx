import React, { useState } from 'react';
import DataTable, { Column } from '../components/DataTable';
import { useBranding } from '../BrandingContext';
import { formatCurrency } from '../utils/formatters';

interface AmortizationEntry {
    id: string;
    month: number;
    principal: number;
    interest: number;
    totalPayment: number;
    endingBalance: number;
}

const ResultCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
);

const LoanCalculator: React.FC = () => {
    const { primaryColor } = useBranding();
    const [amount, setAmount] = useState(1000000);
    const [rate, setRate] = useState(9.5);
    const [tenure, setTenure] = useState(240);
    
    const [results, setResults] = useState<{
        emi: number;
        totalInterest: number;
        totalPayment: number;
        schedule: AmortizationEntry[];
    } | null>(null);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        
        const principal = amount;
        const annualRate = rate;
        const tenureMonths = tenure;

        if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) {
            alert("Please enter valid positive values for all fields.");
            return;
        }

        const monthlyRate = annualRate / 12 / 100;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        
        if (isNaN(emi)) {
            alert("Could not calculate EMI. Please check your inputs.");
            return;
        }
        
        const totalPayment = emi * tenureMonths;
        const totalInterest = totalPayment - principal;

        const schedule: AmortizationEntry[] = [];
        let balance = principal;

        for (let i = 1; i <= tenureMonths; i++) {
            const interest = balance * monthlyRate;
            const principalComponent = emi - interest;
            balance -= principalComponent;
            schedule.push({
                id: `month-${i}`,
                month: i,
                principal: principalComponent,
                interest: interest,
                totalPayment: emi,
                endingBalance: balance < 0 ? 0 : balance,
            });
        }

        setResults({ emi, totalInterest, totalPayment, schedule });
    };

    const scheduleColumns: Column<AmortizationEntry>[] = [
        { header: 'Month', accessor: 'month' },
        { header: 'Principal', accessor: 'principal', render: (row: AmortizationEntry) => formatCurrency(row.principal) },
        { header: 'Interest', accessor: 'interest', render: (row: AmortizationEntry) => formatCurrency(row.interest) },
        { header: 'Total Payment', accessor: 'totalPayment', render: (row: AmortizationEntry) => formatCurrency(row.totalPayment) },
        { header: 'Ending Balance', accessor: 'endingBalance', render: (row: AmortizationEntry) => formatCurrency(row.endingBalance) },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Loan & EMI Calculator</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleCalculate} className="bg-white p-6 rounded-xl shadow-md space-y-6">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
                            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 w-full p-3 border-gray-300 border rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="e.g., 1000000" />
                        </div>
                        <div>
                            <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
                            <input type="number" step="0.01" id="rate" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1 w-full p-3 border-gray-300 border rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="e.g., 9.5" />
                        </div>
                        <div>
                            <label htmlFor="tenure" className="block text-sm font-medium text-gray-700">Loan Tenure (Months)</label>
                            <input type="number" id="tenure" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="mt-1 w-full p-3 border-gray-300 border rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="e.g., 240" />
                        </div>
                        <button type="submit" className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                            Calculate
                        </button>
                    </form>
                </div>
                
                {results && (
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <ResultCard title="Monthly EMI" value={formatCurrency(results.emi)} />
                        <ResultCard title="Total Interest Payable" value={formatCurrency(results.totalInterest)} />
                        <ResultCard title="Total Payment" value={formatCurrency(results.totalPayment)} />
                    </div>
                )}
            </div>

            {results && (
                <div className="mt-8">
                    <DataTable
                        columns={scheduleColumns}
                        data={results.schedule}
                        title="Amortization Schedule"
                        itemsPerPage={12}
                    />
                </div>
            )}
        </div>
    );
};

export default LoanCalculator;