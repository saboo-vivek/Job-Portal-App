import React, { useState } from "react";
import { JobSeeker, JobAlertsPreferences, JobType, LocationType } from "../types";
import { Bell, Sliders, Check, Plus, X } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent, Modal, Input, showToast } from "./ui";

interface JobAlertsManagerProps {
  seeker: JobSeeker;
  onSave: (updatedSeeker: JobSeeker) => void;
}

const JobAlertsManager: React.FC<JobAlertsManagerProps> = ({ seeker, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleAlerts = (enabled: boolean) => {
    onSave({ ...seeker, jobAlertsEnabled: enabled });
    showToast.info(enabled ? "Job alerts enabled" : "Job alerts disabled");
  };

  const handleSavePreferences = (preferences: JobAlertsPreferences) => {
    onSave({ ...seeker, jobAlertsPreferences: preferences });
    setIsModalOpen(false);
    showToast.success("Alert preferences updated!");
  };

  const defaultPreferences: JobAlertsPreferences = {
    keywords: [],
    jobTypes: [],
    locationTypes: [],
    minSalary: 0,
    ...seeker.jobAlertsPreferences,
  };

  return (
    <Card className="border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-all">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Job Notifications
              </CardTitle>
              <p className="text-xs text-slate-500">
                Personalized matches sent directly to your email
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={seeker.jobAlertsEnabled}
            onClick={() => handleToggleAlerts(!seeker.jobAlertsEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              seeker.jobAlertsEnabled ? "bg-primary" : "bg-slate-200"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                seeker.jobAlertsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">
            Status:{" "}
            <span
              className={`font-semibold ${
                seeker.jobAlertsEnabled ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {seeker.jobAlertsEnabled ? "Active & Listening" : "Paused"}
            </span>
          </span>
          {seeker.jobAlertsEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-8 text-xs gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              Preferences
            </Button>
          )}
        </div>

        {seeker.jobAlertsEnabled && (
          <div className="p-2.5 rounded-lg bg-slate-50 text-xs text-slate-600 space-y-1">
            <div className="flex flex-wrap gap-1">
              {defaultPreferences.keywords?.length > 0 ? (
                defaultPreferences.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-700"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="text-slate-400">All matching titles</span>
              )}
            </div>
            {defaultPreferences.minSalary > 0 && (
              <p className="text-[11px] text-slate-500 pt-1">
                Min Salary: ${defaultPreferences.minSalary.toLocaleString()}/yr
              </p>
            )}
          </div>
        )}
      </CardContent>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Customize Job Alert Preferences"
      >
        <PreferencesForm
          initialPreferences={defaultPreferences}
          onSave={handleSavePreferences}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Card>
  );
};

// Modal Preferences Form
const PreferencesForm: React.FC<{
  initialPreferences: JobAlertsPreferences;
  onSave: (prefs: JobAlertsPreferences) => void;
  onCancel: () => void;
}> = ({ initialPreferences, onSave, onCancel }) => {
  const [prefs, setPrefs] = useState<JobAlertsPreferences>(initialPreferences);
  const [keywordInput, setKeywordInput] = useState("");

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !prefs.keywords?.includes(trimmed)) {
      setPrefs((p) => ({
        ...p,
        keywords: [...(p.keywords || []), trimmed],
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setPrefs((p) => ({
      ...p,
      keywords: (p.keywords || []).filter((k) => k !== kw),
    }));
  };

  const handleToggleJobType = (jobType: JobType) => {
    const list = prefs.jobTypes || [];
    setPrefs((p) => ({
      ...p,
      jobTypes: list.includes(jobType)
        ? list.filter((t) => t !== jobType)
        : [...list, jobType],
    }));
  };

  const handleToggleLocationType = (locType: LocationType) => {
    const list = prefs.locationTypes || [];
    setPrefs((p) => ({
      ...p,
      locationTypes: list.includes(locType)
        ? list.filter((t) => t !== locType)
        : [...list, locType],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Target Keywords */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Keywords or Job Titles
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
            placeholder="e.g. Frontend Engineer, Product Designer"
          />
          <Button type="button" variant="outline" onClick={handleAddKeyword}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-slate-50 border border-slate-200">
          {(prefs.keywords || []).length > 0 ? (
            prefs.keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 self-center">
              No keyword filters set (receives all relevant alerts)
            </span>
          )}
        </div>
      </div>

      {/* Employment Types */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
          Employment Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(JobType).map((type) => {
            const isSelected = (prefs.jobTypes || []).includes(type);
            return (
              <button
                type="button"
                key={type}
                onClick={() => handleToggleJobType(type)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-violet-50 border-primary text-primary font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {type}
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Workplace Mode */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
          Workplace Location
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(LocationType).map((type) => {
            const isSelected = (prefs.locationTypes || []).includes(type);
            return (
              <button
                type="button"
                key={type}
                onClick={() => handleToggleLocationType(type)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-violet-50 border-primary text-primary font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {type}
                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Expected Salary */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Minimum Salary ($ / year)
        </label>
        <Input
          type="number"
          value={prefs.minSalary || 0}
          onChange={(e) =>
            setPrefs((p) => ({ ...p, minSalary: parseInt(e.target.value, 10) || 0 }))
          }
          placeholder="e.g. 60000"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Preferences
        </Button>
      </div>
    </form>
  );
};

export default JobAlertsManager;
