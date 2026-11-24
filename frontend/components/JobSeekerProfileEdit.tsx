import React, { useState, ChangeEvent } from "react";
import { JobSeeker } from "../types";
import { Button, Input } from "./ui";
import { Camera, FileText, ExternalLink, Sparkles, X, Plus } from "lucide-react";

interface JobSeekerProfileEditProps {
  seeker: JobSeeker;
  onSave: (updatedSeeker: JobSeeker) => void;
  onCancel: () => void;
}

const JobSeekerProfileEdit: React.FC<JobSeekerProfileEditProps> = ({
  seeker,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<JobSeeker>({
    ...seeker,
    skills: seeker.skills || [],
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    seeker.photoUrl || null
  );
  const [resumeUrl, setResumeUrl] = useState<string>(seeker.resumeUrl || "");
  const [newSkillInput, setNewSkillInput] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setFormData((prev) => ({
        ...prev,
        photoUrl: result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !formData.skills?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), trimmed],
      }));
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skillToRemove),
    }));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      resumeUrl: resumeUrl.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="relative group">
          <img
            src={
              photoPreview ||
              seeker.photoUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                seeker.name || "candidate"
              )}`
            }
            alt="Profile Preview"
            className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/20 shadow-sm"
          />
          <label className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-xl shadow-md hover:bg-primary-focus cursor-pointer transition-transform hover:scale-105">
            <Camera className="w-3.5 h-3.5" />
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoChange}
            />
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-900">Profile Photo</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            PNG, JPG or WebP up to 5MB. Click camera to change.
          </p>
        </div>
      </div>

      {/* Basic Info Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Full Name
          </label>
          <Input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="e.g. Jane Doe"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Email Address
          </label>
          <Input
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="e.g. jane@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Phone Number
          </label>
          <Input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="e.g. +1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Expected Salary ($ / Year)
          </label>
          <Input
            type="number"
            name="expectedSalary"
            value={formData.expectedSalary || ""}
            onChange={handleChange}
            placeholder="e.g. 95000"
          />
        </div>
      </div>

      {/* Skills Manager */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          Skills & Technologies
        </label>
        <div className="flex gap-2 mb-2.5">
          <Input
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={handleKeyDownSkill}
            placeholder="Type skill & press Enter (e.g. TypeScript, React)"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSkill}
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          {(formData.skills && formData.skills.length > 0) ? (
            formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-400 self-center">
              No skills added yet. Add your core languages, frameworks, or tools.
            </p>
          )}
        </div>
      </div>

      {/* Resume URL */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-primary" />
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Resume / CV Link (Google Drive, Notion, PDF URL)
          </label>
        </div>
        <Input
          type="url"
          placeholder="https://drive.google.com/file/d/... or personal portfolio URL"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
        />
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-500">
            Tip: For Google Drive, set access to <b>Anyone with link → Viewer</b>
          </span>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-focus hover:underline"
            >
              Preview Link <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default JobSeekerProfileEdit;
