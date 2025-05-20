import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBTC } from '@/lib/utils';
import { MetricCard } from '@/components/shared/MetricCard';
import { LoanTable } from '@/components/shared/LoanTable';
import { TransactionItem } from '@/components/shared/TransactionItem';
import { MarketplaceLoanCard } from '@/components/shared/MarketplaceLoanCard';
import { useToast } from '@/hooks/use-toast';
import { Loan } from '@shared/schema';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Query user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/user/stats'],
  });
  
  // Query active loans
  const { data: activeLoans, isLoading: loansLoading } = useQuery({
    queryKey: ['/api/loans/active'],
  });
  
  // Query recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });
  
  // Query marketplace loans
  const { data: marketplaceLoans, isLoading: marketplaceLoading } = useQuery({
    queryKey: ['/api/loans/marketplace'],
  });

  const handleViewLoanDetails = (loan: Loan) => {
    setLocation(`/loans/${loan.id}`);
  };

  const handleAcceptLoan = (loan: Loan) => {
    toast({
      title: 'Coming Soon',
      description: 'This feature is under development',
    });
  };

  const recentTransactions = transactions?.slice(0, 3) || [];
  const highlightedMarketplaceLoans = marketplaceLoans?.slice(0, 4) || [];
  
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div variants={fadeIn}>
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-4">Request a Loan</h2>
              <p className="text-muted-foreground mb-4">Need Bitcoin? Create a loan request and get matched with lenders.</p>
              <Link href="/marketplace/request">
                <Button className="mt-auto w-full">
                  <i className="ri-add-line mr-2"></i> Request Loan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={fadeIn}>
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-4">Lend Bitcoin</h2>
              <p className="text-muted-foreground mb-4">Put your Bitcoin to work by offering loans to borrowers.</p>
              <Link href="/marketplace/offer">
                <Button variant="outline" className="mt-auto w-full">
                  <i className="ri-coin-line mr-2"></i> Offer Loan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Stats Overview */}
      <motion.div 
        className="mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={fadeIn}>
            <MetricCard
              title="Total Borrowed"
              value={statsLoading ? "Loading..." : formatBTC(stats?.totalBorrowed || 0)}
              icon="arrow-down"
              iconColor="primary"
              changeValue="12.3%"
              changeText="vs last month"
              isPositive={true}
              isBitcoin={true}
            />
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <MetricCard
              title="Total Lent"
              value={statsLoading ? "Loading..." : formatBTC(stats?.totalLent || 0)}
              icon="arrow-up"
              iconColor="accent"
              changeValue="8.7%"
              changeText="vs last month"
              isPositive={true}
              isBitcoin={true}
            />
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <MetricCard
              title="Active Loans"
              value={statsLoading ? "Loading..." : stats?.activeLoans || 0}
              icon="time"
              iconColor="success"
              changeValue="2"
              changeText="new this week"
              isPositive={true}
              isBitcoin={false}
            />
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <MetricCard
              title="Interest Earned"
              value={statsLoading ? "Loading..." : formatBTC(stats?.interestEarned || 0)}
              icon="percent"
              iconColor="warning"
              changeValue="5.2%"
              changeText="vs last month"
              isPositive={true}
              isBitcoin={true}
            />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Your Active Loans */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Active Loans</h2>
          <Link href="/loans">
            <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
              View All <i className="ri-arrow-right-line ml-1"></i>
            </Button>
          </Link>
        </div>
        
        <Card>
          {loansLoading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading active loans...</p>
            </div>
          ) : (
            <LoanTable 
              loans={activeLoans || []} 
              onViewDetails={handleViewLoanDetails} 
            />
          )}
        </Card>
      </motion.div>
      
      {/* Recent Transactions and Loan Marketplace */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.5
            }
          }
        }}
      >
        {/* Recent Transactions */}
        <motion.div className="md:col-span-1" variants={fadeIn}>
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <Link href="/transactions">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium">
                    View All
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {transactionsLoading ? (
                  <p className="text-muted-foreground text-center py-4">Loading transactions...</p>
                ) : recentTransactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent transactions</p>
                ) : (
                  recentTransactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Loan Marketplace */}
        <motion.div className="md:col-span-2" variants={fadeIn}>
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Loan Marketplace</h2>
                <Link href="/marketplace">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium">
                    Browse All
                  </Button>
                </Link>
              </div>
              
              {marketplaceLoading ? (
                <p className="text-muted-foreground text-center py-4">Loading marketplace loans...</p>
              ) : highlightedMarketplaceLoans.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No marketplace loans available</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {highlightedMarketplaceLoans.map(loan => (
                    <MarketplaceLoanCard 
                      key={loan.id} 
                      loan={loan}
                      rating={4.5}
                      onAccept={handleAcceptLoan}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
