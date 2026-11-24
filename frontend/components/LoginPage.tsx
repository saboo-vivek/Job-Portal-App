import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

type UserRole = "SEEKER" | "EMPLOYER" | "ADMIN";

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole) => void;
  error: string | null;
  onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  error,
  onSwitchToSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserRole>("SEEKER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(email.trim(), password, userType);
      setIsSubmitting(false);
    }, 200);
  };

  const handleQuickLogin = (role: UserRole) => {
    let quickEmail = "";
    const quickPassword = "Demo@12345";

    if (role === "SEEKER") {
      quickEmail = "demo.seeker@jobexecutive.com";
    } else if (role === "EMPLOYER") {
      quickEmail = "demo.employer@jobexecutive.com";
    } else if (role === "ADMIN") {
      quickEmail = "demo.admin@jobexecutive.com";
    }

    setIsSubmitting(true);
    setEmail(quickEmail);
    setPassword(quickPassword);
    setUserType(role);

    setTimeout(() => {
      onLogin(quickEmail, quickPassword, role);
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      {/* Container Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl p-8 sm:p-10 space-y-7 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#6C5CE7] via-[#4338CA] to-[#38BDF8]" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#6C5CE7]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#38BDF8] flex items-center justify-center text-white mx-auto shadow-glow-violet">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral">
            Welcome to Job Executive
          </h2>
          <p className="text-xs sm:text-sm text-neutral-secondary">
            Sign in to access your recruitment workspace or career pipeline
          </p>
        </div>

        {/* Quick Demo Login Pill Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-secondary px-1">
            <span className="flex items-center gap-1 text-[#6C5CE7]">
              <Zap className="w-3.5 h-3.5" />
              1-Click Demo Access
            </span>
            <span className="text-[10px] text-slate-400">Pre-seeded accounts</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("SEEKER")}
              disabled={isSubmitting}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                userType === "SEEKER"
                  ? "bg-white text-[#6C5CE7] border-[#6C5CE7]/30 shadow-sm"
                  : "bg-white/60 text-slate-600 border-slate-200 hover:bg-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Job Seeker</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("EMPLOYER")}
              disabled={isSubmitting}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                userType === "EMPLOYER"
                  ? "bg-white text-cyan-700 border-cyan-400/40 shadow-sm"
                  : "bg-white/60 text-slate-600 border-slate-200 hover:bg-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Employer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("ADMIN")}
              disabled={isSubmitting}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                userType === "ADMIN"
                  ? "bg-white text-indigo-700 border-indigo-400/40 shadow-sm"
                  : "bg-white/60 text-slate-600 border-slate-200 hover:bg-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 text-[11px] font-semibold text-neutral-secondary uppercase tracking-wider">
            Or Sign In With Email
          </span>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-secondary"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-slate-50/50 text-sm text-neutral focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-secondary"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-11 py-2.5 rounded-2xl border border-border bg-slate-50/50 text-sm text-neutral focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-neutral focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Role Segmented Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-secondary">
              Account Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`py-2 px-3 rounded-2xl border cursor-pointer text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  userType === "SEEKER"
                    ? "bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#6C5CE7]/30 shadow-xs"
                    : "bg-slate-50 text-neutral-secondary border-border hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="SEEKER"
                  checked={userType === "SEEKER"}
                  onChange={() => setUserType("SEEKER")}
                  className="sr-only"
                />
                <Briefcase className="w-3.5 h-3.5" />
                Seeker
              </label>

              <label
                className={`py-2 px-3 rounded-2xl border cursor-pointer text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  userType === "EMPLOYER"
                    ? "bg-cyan-50 text-cyan-700 border-cyan-300 shadow-xs"
                    : "bg-slate-50 text-neutral-secondary border-border hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="EMPLOYER"
                  checked={userType === "EMPLOYER"}
                  onChange={() => setUserType("EMPLOYER")}
                  className="sr-only"
                />
                <Building2 className="w-3.5 h-3.5" />
                Employer
              </label>

              <label
                className={`py-2 px-3 rounded-2xl border cursor-pointer text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  userType === "ADMIN"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs"
                    : "bg-slate-50 text-neutral-secondary border-border hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="ADMIN"
                  checked={userType === "ADMIN"}
                  onChange={() => setUserType("ADMIN")}
                  className="sr-only"
                />
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full mt-4 font-bold shadow-glow-violet"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? "Authenticating..." : `Sign In as ${userType}`}
          </Button>

          {/* Footer toggle to Signup */}
          <div className="pt-2 text-center text-xs text-neutral-secondary">
            Don’t have an account yet?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-bold text-[#6C5CE7] hover:underline"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
