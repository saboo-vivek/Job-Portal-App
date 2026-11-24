import React, { useState } from "react";
import { Button } from "./ui/Button";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type UserRole = "SEEKER" | "EMPLOYER";

interface SignupPageProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => void;
  error: string | null;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({
  onRegister,
  error,
  onSwitchToLogin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("SEEKER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    setIsSubmitting(true);
    onRegister(name.trim(), email.trim(), password, role);
    setTimeout(() => setIsSubmitting(false), 300);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6">
      {/* Container Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl p-8 sm:p-10 space-y-7 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#6C5CE7] via-[#4338CA] to-[#38BDF8]" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#38BDF8]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#38BDF8] flex items-center justify-center text-white mx-auto shadow-glow-violet">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral">
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-neutral-secondary">
            Join Job Executive to discover top roles or hire exceptional talent
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="signup-name"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-secondary"
            >
              Full Name or Company Representative
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Connor"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-slate-50/50 text-sm text-neutral focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="signup-email"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-secondary"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-slate-50/50 text-sm text-neutral focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="signup-password"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-secondary"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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
              I Want To Join As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`py-3 px-4 rounded-2xl border cursor-pointer text-center text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === "SEEKER"
                    ? "bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#6C5CE7]/30 shadow-xs"
                    : "bg-slate-50 text-neutral-secondary border-border hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="signupRole"
                  value="SEEKER"
                  checked={role === "SEEKER"}
                  onChange={() => setRole("SEEKER")}
                  className="sr-only"
                />
                <Briefcase className="w-4 h-4" />
                <span>Job Seeker</span>
              </label>

              <label
                className={`py-3 px-4 rounded-2xl border cursor-pointer text-center text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === "EMPLOYER"
                    ? "bg-cyan-50 text-cyan-700 border-cyan-300 shadow-xs"
                    : "bg-slate-50 text-neutral-secondary border-border hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="signupRole"
                  value="EMPLOYER"
                  checked={role === "EMPLOYER"}
                  onChange={() => setRole("EMPLOYER")}
                  className="sr-only"
                />
                <Building2 className="w-4 h-4" />
                <span>Employer</span>
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
            {isSubmitting
              ? "Creating Account..."
              : `Register as ${role === "SEEKER" ? "Job Seeker" : "Employer"}`}
          </Button>

          {/* Footer toggle to Login */}
          <div className="pt-2 text-center text-xs text-neutral-secondary">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-[#6C5CE7] hover:underline"
            >
              Sign In Instead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
