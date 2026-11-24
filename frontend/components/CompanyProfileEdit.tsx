import React, { useState, ChangeEvent } from "react";
import { Employer } from "../types";
import { Building2, Globe, Mail, Phone, MapPin, Camera, FileText } from "lucide-react";
import { Button, Input } from "./ui";

interface CompanyProfileEditProps {
  employer: Employer;
  onSave: (updatedCompany: Employer) => void;
  onCancel: () => void;
}

const CompanyProfileEdit: React.FC<CompanyProfileEditProps> = ({
  employer,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Employer>(employer);
  const [logoPreview, setLogoPreview] = useState<string | null>(employer.logo || null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "logo") {
          const result = reader.result as string;
          setLogoPreview(result);
          setFormData((prev) => ({ ...prev, logo: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Logo Header */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="relative group">
          <img
            src={
              logoPreview ||
              employer.logo ||
              `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                employer.name || "company"
              )}`
            }
            alt="Company Logo Preview"
            className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary/20 shadow-sm bg-white"
          />
          <label className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-xl shadow-md hover:bg-primary-focus cursor-pointer transition-transform hover:scale-105">
            <Camera className="w-3.5 h-3.5" />
            <input
              id="logo-upload"
              name="logo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-900">Company Brand Logo</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Square PNG, SVG or WebP recommended. Displays across all job postings.
          </p>
        </div>
      </div>

      {/* Basic Company Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            Company Legal Name
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="e.g. Acme Technologies Inc."
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            About Company & Culture
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your organization's mission, values, tech stack, and workplace culture..."
            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Website URL
            </label>
            <Input
              type="url"
              name="website"
              id="website"
              value={formData.website || ""}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Recruitment Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="careers@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Contact Phone
            </label>
            <Input
              type="text"
              name="contactInfo"
              id="contactInfo"
              value={formData.contactInfo || ""}
              onChange={handleChange}
              placeholder="+1 (555) 234-5678"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Office Headquarters
            </label>
            <Input
              type="text"
              name="officeAddress"
              id="officeAddress"
              value={formData.officeAddress || ""}
              onChange={handleChange}
              placeholder="San Francisco, CA or Remote"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Organization Profile
        </Button>
      </div>
    </form>
  );
};

export default CompanyProfileEdit;
