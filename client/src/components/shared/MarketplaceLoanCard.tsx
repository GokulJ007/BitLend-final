import React from 'react';
import { Loan } from '@shared/schema';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BitcoinIcon } from '@/components/ui/bitcoin-icon';
import { formatBTC, getLoanTypeClass } from '@/lib/utils';

interface MarketplaceLoanCardProps {
  loan: Loan;
  rating?: number;
  onAccept: (loan: Loan) => void;
}

export function MarketplaceLoanCard({ 
  loan, 
  rating = 4.5,
  onAccept 
}: MarketplaceLoanCardProps) {
  const typeClass = getLoanTypeClass(loan.type);
  const isRequest = loan.type === 'request';
  
  const handleAccept = () => {
    onAccept(loan);
  };

  return (
    <Card className="border border-border rounded-xl p-4 transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`text-xs py-1 px-2 rounded-full font-medium ${typeClass}`}>
              {isRequest ? 'Loan Request' : 'Loan Offer'}
            </span>
            <h3 className="font-semibold mt-2 flex items-center">
              <BitcoinIcon className="text-primary mr-1" size={18} />
              <span>{formatBTC(loan.amount)}</span>
            </h3>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Interest Rate</p>
            <p className={`font-semibold ${isRequest ? 'text-primary' : 'text-accent'}`}>{loan.interest}%</p>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <div>
            <p>Duration</p>
            <p className="font-medium text-foreground">{loan.durationMonths} months</p>
          </div>
          <div>
            <p>{isRequest ? 'Borrower' : 'Lender'} Rating</p>
            <p className="font-medium text-foreground flex items-center">
              <i className="ri-star-fill text-warning mr-1"></i>
              <span>{rating}/5</span>
            </p>
          </div>
          <div>
            <p>Collateral</p>
            <p className="font-medium text-foreground">{loan.hasCollateral ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-0 pt-2">
        <Button 
          className="w-full" 
          variant={isRequest ? "default" : "outline"}
          onClick={handleAccept}
        >
          {isRequest ? 'Lend Now' : 'Borrow Now'}
        </Button>
      </CardFooter>
    </Card>
  );
}
