

import type { RepaymentInstallment, LeasePaymentInstallment } from '../views/types';

export const generateRepaymentSchedule = (principal: number, annualRate: number, tenureMonths: number, startDate: string): RepaymentInstallment[] => {
    const schedule: RepaymentInstallment[] = [];
    if (tenureMonths <= 0) return schedule;
    
    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    let balance = principal;

    for (let i = 1; i <= tenureMonths; i++) {
        const interest = balance * monthlyRate;
        const principalComponent = emi - interest;
        balance -= principalComponent;
        
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        schedule.push({
            id: `inst-${startDate}-${i}-${principal}`,
            installmentNumber: i,
            dueDate: dueDate.toISOString().split('T')[0],
            principal: principalComponent,
            interest: interest,
            totalAmount: emi,
            status: 'Pending',
        });
    }
    return schedule;
};

export const generateLeasePaymentSchedule = (monthlyPayment: number, tenureMonths: number, startDate: string): LeasePaymentInstallment[] => {
    const schedule: LeasePaymentInstallment[] = [];
     if (tenureMonths <= 0) return schedule;

    for (let i = 1; i <= tenureMonths; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        
        schedule.push({
            id: `linst-${startDate}-${i}-${monthlyPayment}`,
            installmentNumber: i,
            dueDate: dueDate.toISOString().split('T')[0],
            amount: monthlyPayment,
            status: 'Pending',
        });
    }
    return schedule;
};