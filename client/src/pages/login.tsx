import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BitcoinIcon } from '@/components/ui/bitcoin-icon';
import { useAuth } from '@/hooks/use-auth';
import { WalletModal } from '@/components/shared/WalletModal';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      // Redirect to dashboard after successful login
      setLocation('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <BitcoinIcon className="text-primary text-4xl mr-2" />
            <h1 className="text-3xl font-bold">BitLend</h1>
          </div>
          <p className="text-muted-foreground">Bitcoin P2P Lending Platform</p>
        </div>

        <Card>
          <Tabs defaultValue="email">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account to access your dashboard
              </CardDescription>
              <TabsList className="grid grid-cols-2 mt-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <TabsContent value="email">
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your@email.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center w-full">
                  <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="text-center w-full">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a href="#" className="text-primary hover:underline">Sign up</a>
                  </p>
                </div>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="wallet">
              <CardContent className="text-center py-6">
                <div className="inline-flex items-center justify-center rounded-full bg-muted p-6 mb-4">
                  <BitcoinIcon className="text-primary text-4xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect with MetaMask</h3>
                <p className="text-muted-foreground mb-6">
                  Use your cryptocurrency wallet to sign in securely without a password.
                </p>
                <Button 
                  className="w-full"
                  onClick={handleConnectWallet}
                >
                  <i className="ri-wallet-3-line mr-2"></i>
                  Connect Wallet
                </Button>
              </CardContent>
              
              <CardFooter className="text-center">
                <p className="text-sm text-muted-foreground w-full">
                  By connecting your wallet, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                </p>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
      
      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
}
