import { useState } from 'react';
import { Phone, Save, User } from 'lucide-react';

const PersonalInfoTab = ({ profile, onSave }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    gender: profile.gender || 'Male',
    dateOfBirth: profile.dateOfBirth || '',
    address: profile.address || '',
    emergencyName: profile.emergencyContact?.name || '',
    emergencyRelation: profile.emergencyContact?.relation || '',
    emergencyPhone: profile.emergencyContact?.phone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primary Details Card */}
      <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
        <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
          <User size={18} className="text-[#4f46e5]" /> Personal Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#344767] mb-1">Residential Address</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact Card */}
      <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
        <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
          <Phone size={18} className="text-[#14a65a]" /> Emergency Contact
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Contact Name</label>
            <input
              type="text"
              name="emergencyName"
              value={formData.emergencyName}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Relationship</label>
            <input
              type="text"
              name="emergencyRelation"
              value={formData.emergencyRelation}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#344767] mb-1">Contact Phone</label>
            <input
              type="text"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dce3ee] bg-white px-3.5 py-2.5 text-sm text-[#101828] outline-none transition focus:border-[#4f46e5]"
            />
          </div>
        </div>
      </div>

      {/* Form Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#4f46e5,#3730a3)] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition hover:opacity-95"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoTab;
