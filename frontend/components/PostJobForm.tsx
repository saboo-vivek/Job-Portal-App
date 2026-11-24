import React, { useState, useEffect } from "react";
import { Job, Employer, JobType, LocationType } from "../types";
import { Briefcase, MapPin, DollarSign, Award, Building2 } from "lucide-react";
import { Button, Input, Select } from "./ui";

interface PostJobFormProps {
  onSave: (job: Job | Omit<Job, "id" | "applicants" | "shortlisted" | "rejected">) => void;
  onCancel: () => void;
  companyId?: string; // Provided by CompanyDashboard
  companies?: Employer[]; // Provided by AdminDashboard
  employers?: Employer[]; // Also support employers prop for compatibility
  jobToEdit?: Job | null; // Provided for editing
}

const PostJobForm: React.FC<PostJobFormProps> = ({
  companyId,
  companies: initialCompanies,
  employers,
  jobToEdit,
  onSave,
  onCancel,
}) => {
  const companyList = initialCompanies || employers || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    experienceLevel: "Mid-Level",
    salaryMin: 70000,
    salaryMax: 110000,
    jobType: JobType.FullTime,
    locationType: LocationType.Onsite,
    companyId: companyId || (companyList.length > 0 ? (companyList[0]._id || companyList[0].id) : ""),
  });

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title,
        description: jobToEdit.description,
        location: jobToEdit.location,
        experienceLevel: jobToEdit.experienceLevel,
        salaryMin: jobToEdit.salaryMin,
        salaryMax: jobToEdit.salaryMax,
        jobType: jobToEdit.jobType,
        locationType: jobToEdit.locationType,
        companyId: jobToEdit.companyId,
      });
    }
  }, [jobToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobToEdit) {
      onSave({ ...jobToEdit, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Admin Company Selector */}
      {companyList.length > 0 && !companyId && (
        <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-100">
          <label
            htmlFor="companyId"
            className="block text-xs font-semibold uppercase tracking-wider text-violet-800 mb-1.5 flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            Posting Organization
          </label>
          <select
            name="companyId"
            id="companyId"
            value={formData.companyId}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
            required
          >
            {companyList.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Job Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          Job Title
        </label>
        <Input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Senior Full-Stack Engineer (React / Node)"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          Job Overview & Key Requirements
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          placeholder="Outline responsibilities, day-to-day work, technical requirements, benefits, and tech stack..."
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          required
        />
      </div>

      {/* Location & Experience Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Location
          </label>
          <Input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA or Remote"
            required
          />
        </div>

        <div>
          <label
            htmlFor="experienceLevel"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-slate-400" />
            Experience Level
          </label>
          <select
            name="experienceLevel"
            id="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
            required
          >
            <option value="Entry-Level">Entry-Level (0-2 yrs)</option>
            <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
            <option value="Senior">Senior (5+ yrs)</option>
            <option value="Lead / Staff">Lead / Staff (8+ yrs)</option>
            <option value="Executive">Director / VP / Exec</option>
          </select>
        </div>
      </div>

      {/* Job Type & Location Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="jobType"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Employment Type
          </label>
          <select
            name="jobType"
            id="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
          >
            {Object.values(JobType).map((jt) => (
              <option key={jt} value={jt}>
                {jt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="locationType"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Workplace Model
          </label>
          <select
            name="locationType"
            id="locationType"
            value={formData.locationType}
            onChange={handleChange}
            className="w-full h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
          >
            {Object.values(LocationType).map((lt) => (
              <option key={lt} value={lt}>
                {lt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="salaryMin"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Min Annual Salary ($)
          </label>
          <Input
            type="number"
            name="salaryMin"
            id="salaryMin"
            value={formData.salaryMin}
            onChange={handleNumberChange}
            min={0}
            step={5000}
            required
          />
        </div>

        <div>
          <label
            htmlFor="salaryMax"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Max Annual Salary ($)
          </label>
          <Input
            type="number"
            name="salaryMax"
            id="salaryMax"
            value={formData.salaryMax}
            onChange={handleNumberChange}
            min={0}
            step={5000}
            required
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {jobToEdit ? "Update Job Posting" : "Publish Job Posting"}
        </Button>
      </div>
    </form>
  );
};

export default PostJobForm;
