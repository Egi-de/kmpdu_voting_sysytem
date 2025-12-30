import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, ArrowRight, Loader2, IdCard, LockKeyhole } from "lucide-react";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Login() {
  const [memberId, setMemberId] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login({ memberId, nationalId });
      setStep("otp");
      toast.info("OTP sent! Please enter the code.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.verifyOtp({ memberId, otp });
      
      // Store token
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }

      // Map API user to App user format
      const apiUser = response.user || response; // Adjust based on actual response structure
      const userObj: any = {
        id: apiUser.id || apiUser.memberId,
        memberId: apiUser.memberId,
        name: apiUser.memberName || apiUser.name,
        email: apiUser.email || "",
        phone: apiUser.mobileNumber || apiUser.phone,
        role: apiUser.role?.toLowerCase() || "member",
        branch: apiUser.branch,
        hasVoted: apiUser.hasVoted,
        isActive: apiUser.isActive
      };

      login(userObj);
      toast.success("Login Successful!");

      // Redirect based on role
      const role = userObj.role.toLowerCase();
      if (role === "superuseradmin") {
        navigate("/superuseradmin");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/member/ballot");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const electionEndDate = new Date("2026-12-05T18:00:00");

  return (
    <div className="force-light min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tOCAyMGwtOC04aDRWMzZoOHY2aDRsLTggOHptOC0yOGw4IDhoLTRWMjBoLTh2LTZoLTRsOC04eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Logo variant="light" />

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold leading-tight">
                KMPDU 2026
                <br />
                National Elections
              </h1>
              <p className="mt-4 text-lg text-white/80 max-w-md">
                Exercise your democratic right. Your vote shapes the future of
                healthcare in Kenya.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/60 uppercase tracking-wide">
                Voting closes in
              </p>
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

          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="text-center pb-6 bg-secondary/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-4 border-background shadow-sm">
                {step === 'credentials' ? <IdCard className="h-8 w-8 text-primary" /> : <LockKeyhole className="h-8 w-8 text-primary" />}
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {step === 'credentials' ? 'Voter Login' : 'Enter One-Time Password'}
              </CardTitle>
              <CardDescription className="text-base">
                {step === 'credentials' 
                  ? 'Enter your credentials to access the voting dashboard' 
                  : 'We sent a code to your registered mobile number'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-6 sm:px-8">
              {step === 'credentials' ? (
                <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="memberId" className="text-base font-medium">
                      KMPDU Member ID
                    </Label>
                    <Input
                      id="memberId"
                      type="text"
                      placeholder="e.g. KMPDU-2026-XXXXX"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      className="h-12 text-lg font-mono tracking-wide bg-secondary/5"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationalId" className="text-base font-medium">
                      National ID Number
                    </Label>
                    <Input
                      id="nationalId"
                      type="password"
                      placeholder="Enter National ID"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="h-12 text-lg tracking-widest bg-secondary/5"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading || !memberId || !nationalId}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-8">
                  <div className="flex justify-center">
                    <InputOTP 
                      maxLength={6} 
                      value={otp} 
                      onChange={(value) => setOtp(value)}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                      </InputOTPGroup>
                      <div className="w-4"></div>
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                        <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
                    disabled={isLoading || otp.length < 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying OTP...
                      </>
                    ) : (
                      <>
                        Login to Vote
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <button 
                      type="button" 
                      onClick={() => setStep("credentials")}
                      className="text-sm text-muted-foreground hover:text-primary underline"
                    >
                      Back to login
                    </button>
                  </div>
                </form>
              )}

              <p className="mt-8 text-center text-xs text-muted-foreground">
                Protected by end-to-end encryption. <br />
                KMPDU Electoral Commission © 2026
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
