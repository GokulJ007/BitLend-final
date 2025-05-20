import React from 'react';
import { Loan } from '@shared/schema';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BitcoinIcon } from '@/components/ui/bitcoin-icon';
import { formatBTC, getLoanStatusBadgeClass, getLoanTypeClass } from '@/lib/utils';

interface LoanCardProps {
  loan: Loan;
  onViewDetails?: (loan: Loan) => void;
  onRepay?: (loan: Loan) => void;
  showRepayButton?: boolean;
}

export function LoanCard({ 
  loan, 
  onViewDetails, 
  onRepay,
  showRepayButton = false
}: LoanCardProps) {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(loan);
    }
  };

  const handleRepay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRepay) {
      onRepay(loan);
    }
  };

  const typeClass = getLoanTypeClass(loan.type);
  const statusClass = getLoanStatusBadgeClass(loan.status);
  const isBorrowing = loan.type === 'request';

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={handleViewDetails}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`text-xs py-1 px-2 rounded-full font-medium ${typeClass}`}>
              {isBorrowing ? 'Borrowed' : 'Lent'}
            </span>
            <h3 className="font-semibold mt-2 flex items-center">
              <BitcoinIcon className="text-primary mr-1" size={18} />
              <span>{formatBTC(loan.amount)}</span>
            </h3>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Interest Rate</p>
            <p className="font-semibold text-primary">{loan.interest}%</p>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <div>
            <p>Duration</p>
            <p className="font-medium text-foreground">{loan.durationMonths} months</p>
          </div>
          <div>
            <p>Status</p>
            <p className={`text-xs py-1 px-2 rounded-full font-medium ${statusClass}`}>
              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
            </p>
          </div>
          <div>
            <p>Collateral</p>
            <p className="font-medium text-foreground">{loan.hasCollateral ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        {loan.createdAt && (
          <p className="text-xs text-muted-foreground">
            Created on {new Date(loan.createdAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
      
      {(showRepayButton && loan.status === 'active' && isBorrowing) && (
        <CardFooter className="pt-0 pb-4 px-5">
          <Button onClick={handleRepay} className="w-full" variant="outline">
            Make Repayment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
