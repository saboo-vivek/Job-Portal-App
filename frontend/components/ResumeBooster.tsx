import React, { useState } from "react";
import { boostResume } from "../services/apiService";
import { Sparkles, Copy, Check, ArrowRight, Lightbulb, Loader2 } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, showToast } from "./ui";

const QUICK_EXAMPLES = [
  "Built React and Node.js web applications, improved API response times, and collaborated in an agile team.",
  "Led full-stack engineering team to scale cloud microservices, cutting server latency by 45% using AWS and Docker.",
  "Designed intuitive UX wireframes, design systems in Figma, and frontend components in Tailwind CSS.",
];

const ResumeBooster: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [boostedText, setBoostedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBoost = async () => {
    if (!inputText.trim()) {
      setError("Please enter your resume summary or work experience bullet points.");
      return;
    }
    setIsLoading(true);
    setError("");
    setBoostedText("");

    try {
      const result = await boostResume(inputText);
      setBoostedText(result);
      showToast.success("AI has refined your resume summary!");
    } catch (e: any) {
      setError(e?.response?.data?.msg || "An unexpected error occurred while generating suggestions.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!boostedText) return;
    navigator.clipboard.writeText(boostedText);
    setCopied(true);
    showToast.info("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-all">
      <CardHeader className="pb-3 border-b border-slate-100 bg-gradient-to-r from-violet-50/50 via-slate-50 to-indigo-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              AI Resume Booster
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                Powered by AI
              </span>
            </CardTitle>
            <p className="text-xs text-slate-500">
              Transform passive duty descriptions into high-impact, metrics-driven achievements.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Quick Example Starters */}
        <div>
          <span className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Quick Starters:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(example)}
                className="text-left text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-violet-50 hover:text-violet-700 text-slate-600 border border-slate-200/60 transition-colors line-clamp-1 max-w-full"
              >
                &ldquo;{example.slice(0, 48)}...&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Your summary or bullet points:</span>
            <span>{inputText.length} chars</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (error) setError("");
            }}
            placeholder="Paste your resume summary or responsibilities here..."
            className="w-full h-28 p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all resize-none"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-100">
            {error}
          </p>
        )}

        <Button
          onClick={handleBoost}
          disabled={isLoading || !inputText.trim()}
          className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-violet-500/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enhancing with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Boost My Summary
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </>
          )}
        </Button>

        {/* Boosted Output */}
        {boostedText && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/60 border border-violet-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                Enhanced Output:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans bg-white/70 p-3 rounded-lg border border-violet-100/80">
              {boostedText}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeBooster;
