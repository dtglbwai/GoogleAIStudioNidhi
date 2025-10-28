import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { TransactionType } from '../types';

interface TransactionAmountProps {
  amount: number;
  type: TransactionType;
}

const TransactionAmount: React.FC<TransactionAmountProps> = ({ amount, type }) => {
  const formattedAmount = formatCurrency(amount);
  const isCredit = type === TransactionType.CREDIT;

  return (
    <span className={isCredit ? 'text-green-600' : 'text-red-600'}>
      {isCredit ? '+' : '-'} {formattedAmount}
    </span>
  );
};

export default TransactionAmount;
