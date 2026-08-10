import { BadgeCheck, Briefcase, Building2, Calendar, Clock, MapPin, UserCheck } from 'lucide-react';

const DetailField = ({ label, value, icon: Icon, badge }) => (
  <div className="flex items-start gap-3 rounded-xl border border-[#edf2f7] bg-[#f8fafc] p-3.5">
    {Icon && (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#4f46e5] border border-[#e2e8f0] shadow-2xs">
        <Icon size={18} />
      </span>
    )}
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-medium text-[#64748b]">{label}</p>
      <div className="mt-0.5 flex items-center gap-2">
        <p className="text-sm font-semibold text-[#0f172a] truncate">{value || 'N/A'}</p>
        {badge && (
          <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-[#4f46e5]">
            {badge}
          </span>
        )}
      </div>
    </div>
  </div>
);

const OrganizationTab = ({ profile }) => (
  <div className="space-y-6">
    {/* Employment & Role Card */}
    <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
      <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
        <Briefcase size={18} className="text-[#4f46e5]" /> Employment & Organizational Details
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField label="Employee ID" value={profile.id} icon={BadgeCheck} badge="Official" />
        <DetailField label="Department" value={profile.department} icon={Building2} />
        <DetailField label="Designation" value={profile.designation} icon={Briefcase} />
        <DetailField label="System Role" value={profile.role} icon={UserCheck} />
        <DetailField label="Reporting Manager" value={profile.manager} icon={UserCheck} />
        <DetailField label="Date of Joining" value={profile.joinDate} icon={Calendar} />
      </div>
    </div>

    {/* Work Shift & Location Card */}
    <div className="rounded-2xl border border-[#e5eaf2] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
      <h2 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
        <Clock size={18} className="text-[#14a65a]" /> Work Schedule & Location
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailField label="Work Shift" value={profile.workShift} icon={Clock} />
        <DetailField label="Primary Work Location" value={profile.location} icon={MapPin} />
      </div>
    </div>
  </div>
);

export default OrganizationTab;
