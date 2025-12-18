import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowRight, Loader2, IdCard, Smartphone, RefreshCw } from 'lucide-react';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';

// Mock users database for demo
const mockUsersDB = [
  { memberId: 'KMPDU-2024-00456', password: 'member123', role: 'member' as const, name: 'Dr. Sarah Wanjiku', branch: 'Nairobi Branch', phone: '+254 7** ***456' },
  { memberId: 'KMPDU-2024-00789', password: 'member123', role: 'member' as const, name: 'Dr. John Mwangi', branch: 'Mombasa Branch', phone: '+254 7** ***789' },
  { memberId: 'KMPDU-ADM-001', password: 'admin123', role: 'admin' as const, name: 'James Ochieng', branch: 'Headquarters', phone: '+254 7** ***001' },
  { memberId: 'KMPDU-ADM-002', password: 'admin123', role: 'admin' as const, name: 'Dr. Peter Ochieng', branch: 'National', phone: '+254 7** ***002' },
];

type LoginStep = 'credentials' | 'otp';

export default function Login() {
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<LoginStep>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [pendingUser, setPendingUser] = useState<typeof mockUsersDB[0] | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user in mock database
    const user = mockUsersDB.find(
      u => u.memberId.toLowerCase() === memberId.toLowerCase() && u.password === password
    );

    if (user) {
      setPendingUser(user);
      setStep('otp');
      toast({
        title: 'OTP Sent',
        description: `A verification code has been sent to ${user.phone}`,
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid membership number or password. Please try again.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    setIsLoading(true);

    // Simulate OTP verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock OTP verification (accept any 6-digit code for demo)
    if (otp.length === 6 && pendingUser) {
      login(pendingUser.role);
      toast({
        title: `Welcome, ${pendingUser.name}`,
        description: 'Blockchain verification complete. Redirecting...',
      });
      navigate(pendingUser.role === 'admin' ? '/admin' : '/member');
    } else {
      toast({
        title: 'Verification Failed',
        description: 'Invalid OTP code. Please try again.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'OTP Resent',
      description: `A new verification code has been sent to ${pendingUser?.phone}`,
    });
    setIsResending(false);
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setOtp('');
    setPendingUser(null);
  };

  const electionEndDate = new Date('2024-12-05T18:00:00');

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tOCAyMGwtOC04aDRWMzZoOHY2aDRsLTggOHptOC0yOGw4IDhoLTRWMjBoLTh2LTZoLTRsOC04eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Logo variant="light" />
          
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold leading-tight">
                KMPDU 2024<br />
                National Elections
              </h1>
              <p className="mt-4 text-lg text-white/80 max-w-md">
                Exercise your democratic right. Your vote shapes the future of healthcare in Kenya.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/60 uppercase tracking-wide">Voting closes in</p>
              <CountdownTimer targetDate={electionEndDate} variant="hero" />
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/60 text-sm">
            <Shield className="h-5 w-5" />
            <span>End-to-end encrypted • Blockchain verified • Auditable</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          {step === 'credentials' ? (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <IdCard className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Enter your KMPDU membership credentials to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberId">KMPDU Membership Number</Label>
                    <Input
                      id="memberId"
                      type="text"
                      placeholder="KMPDU-2024-XXXXX"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      className="h-12 text-lg font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base gap-2"
                    disabled={isLoading || !memberId || !password}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
                
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  By signing in, you agree to the election terms and conditions
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Smartphone className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to {pendingUser?.phone}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/50 border border-accent flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">
                      Blockchain-verified authentication ensures your vote integrity
                    </span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base gap-2"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Sign In
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="gap-2"
                    onClick={handleResendOtp}
                    disabled={isResending}
                  >
                    {isResending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Resend Code
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToCredentials}
                  >
                    Back to Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
