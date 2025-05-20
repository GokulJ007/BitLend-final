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
      {/* Welcome Banner */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-none bg-gradient-to-r from-primary/90 to-primary">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to BitLend</h2>
              <p className="text-white/80 max-w-md">Your secure platform for P2P Bitcoin lending. Browse the marketplace to find the perfect loan opportunities.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/marketplace">
                  <Button size="lg" variant="secondary" className="font-medium">
                    <i className="ri-store-2-line mr-2"></i> Visit Marketplace
                  </Button>
                </Link>
                <Link href="/wallet">
                  <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-medium">
                    <i className="ri-wallet-3-line mr-2"></i> Manage Wallet
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full bg-white/10 animate-ping-slow"></div>
                <div className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/20"></div>
                <i className="ri-bit-coin-line text-white text-5xl md:text-6xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-bold mb-2 md:mb-0">Your Portfolio Overview</h2>
          <div className="flex items-center bg-muted rounded-full px-3 py-1.5 text-sm">
            <span className="text-primary font-medium flex items-center">
              <i className="ri-time-line mr-1.5"></i> Last updated: Just now
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={fadeIn}>
            <div className="stat-card-hover rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex justify-between mb-3">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-primary/10 p-2">
                    <i className="ri-arrow-down-line text-xl text-primary"></i>
                  </div>
                  <h3 className="font-medium text-muted-foreground">Total Borrowed</h3>
                </div>
                <div className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success flex items-center">
                  <i className="ri-arrow-up-line mr-0.5"></i> 12.3%
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{statsLoading ? "..." : formatBTC(stats?.totalBorrowed || 0)}</span>
                </div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <div className="stat-card-hover rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex justify-between mb-3">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-accent/10 p-2">
                    <i className="ri-arrow-up-line text-xl text-accent"></i>
                  </div>
                  <h3 className="font-medium text-muted-foreground">Total Lent</h3>
                </div>
                <div className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success flex items-center">
                  <i className="ri-arrow-up-line mr-0.5"></i> 8.7%
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{statsLoading ? "..." : formatBTC(stats?.totalLent || 0)}</span>
                </div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <div className="stat-card-hover rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex justify-between mb-3">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-success/10 p-2">
                    <i className="ri-time-line text-xl text-success"></i>
                  </div>
                  <h3 className="font-medium text-muted-foreground">Active Loans</h3>
                </div>
                <div className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success flex items-center">
                  <i className="ri-add-line mr-0.5"></i> 2
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{statsLoading ? "..." : stats?.activeLoans || 0}</span>
                </div>
                <p className="text-xs text-muted-foreground">new this week</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <div className="stat-card-hover rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex justify-between mb-3">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-warning/10 p-2">
                    <i className="ri-percent-line text-xl text-warning"></i>
                  </div>
                  <h3 className="font-medium text-muted-foreground">Interest Earned</h3>
                </div>
                <div className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success flex items-center">
                  <i className="ri-arrow-up-line mr-0.5"></i> 5.2%
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{statsLoading ? "..." : formatBTC(stats?.interestEarned || 0)}</span>
                </div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </div>
            </div>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-xl font-bold mb-2 md:mb-0">Your Active Loans</h2>
          <Link href="/loans">
            <Button variant="outline" className="text-primary hover:bg-primary/5 text-sm font-medium flex items-center">
              View All Loans <i className="ri-arrow-right-line ml-1"></i>
            </Button>
          </Link>
        </div>
        
        <Card className="border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          {loansLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading your active loans...</p>
            </div>
          ) : activeLoans && activeLoans.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <i className="ri-inbox-line text-3xl text-muted-foreground"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">No active loans</h3>
              <p className="text-muted-foreground mb-4">You don't have any active loans at the moment.</p>
              <Link href="/marketplace">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  Browse Marketplace
                </Button>
              </Link>
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
          <Card className="h-full rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-1.5 rounded-md mr-2">
                    <i className="ri-exchange-funds-line text-lg text-primary"></i>
                  </div>
                  <h2 className="text-lg font-bold">Recent Transactions</h2>
                </div>
                <Link href="/transactions">
                  <Button variant="ghost" className="text-primary hover:bg-primary/5 text-sm font-medium">
                    View All <i className="ri-arrow-right-line ml-1"></i>
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {transactionsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Loading transactions...</p>
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                      <i className="ri-file-list-line text-2xl text-muted-foreground"></i>
                    </div>
                    <h3 className="text-base font-medium mb-1">No transactions yet</h3>
                    <p className="text-sm text-muted-foreground">Your transaction history will appear here</p>
                  </div>
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
          <Card className="h-full rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="bg-accent/10 p-1.5 rounded-md mr-2">
                    <i className="ri-store-2-line text-lg text-accent"></i>
                  </div>
                  <h2 className="text-lg font-bold">Marketplace Opportunities</h2>
                </div>
                <Link href="/marketplace">
                  <Button variant="outline" className="text-accent border-accent/30 hover:bg-accent/5 text-sm font-medium">
                    Browse All <i className="ri-arrow-right-line ml-1"></i>
                  </Button>
                </Link>
              </div>
              
              {marketplaceLoading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-accent mb-4"></div>
                  <p className="text-muted-foreground">Loading marketplace opportunities...</p>
                </div>
              ) : highlightedMarketplaceLoans.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                    <i className="ri-store-2-line text-4xl text-muted-foreground"></i>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No loans available</h3>
                  <p className="text-muted-foreground mb-4 max-w-sm mx-auto">Check back later for new loan opportunities or visit the marketplace</p>
                  <Link href="/marketplace">
                    <Button className="bg-accent text-white hover:bg-accent/90">
                      Visit Marketplace
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {highlightedMarketplaceLoans.map(loan => (
                    <div key={loan.id} className="marketplace-card-hover">
                      <MarketplaceLoanCard 
                        loan={loan}
                        rating={4.5}
                        onAccept={handleAcceptLoan}
                      />
                    </div>
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
