import { useEffect, useState } from 'react';
import { Camera, CheckCircle2, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

const ProfileHeader = ({ profile, onAvatarChange, uploading = false }) => {
  const [avatarPreview, setAvatarPreview] = useState(profile?.profilePhoto || null);

  useEffect(() => {
    setAvatarPreview(profile?.profilePhoto || null);
  }, [profile?.profilePhoto]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    try {
      if (onAvatarChange) {
        await onAvatarChange(file);
      }
    } catch {
      setAvatarPreview(profile?.profilePhoto || null);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_3px_12px_rgba(16,24,40,0.02)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative group size-24 rounded-2xl bg-[linear-gradient(135deg,#03142d,#4f46e5)] text-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt={profile.name} className="size-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold tracking-wider text-white">{profile.initials}</span>
            )}
            <label className={`absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer ${uploading ? 'pointer-events-none opacity-100' : ''}`}>
              <Camera size={18} />
              <span className="text-[10px] font-semibold mt-1">{uploading ? 'Uploading...' : 'Change'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading || !onAvatarChange} />
            </label>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">{profile.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 text-xs font-semibold text-[#059669]">
                <CheckCircle2 size={13} /> {profile.status}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-[#4338ca]">
                <ShieldCheck size={13} /> Verified
              </span>
            </div>

            <p className="text-sm font-semibold text-[#4338ca]">
              {profile.designation} <span className="text-[#cbd5e1] font-normal">•</span> <span className="text-[#475569] font-medium">{profile.department}</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748b] pt-1">
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#6366f1]" /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} className="text-[#6366f1]" /> {profile.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#6366f1]" /> {profile.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-center">
          <span className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 py-2 text-xs font-bold text-[#1e293b] shadow-2xs">
            ID: {profile.id}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-[#f1f5f9] mt-6 pt-5 sm:grid-cols-4">
        {Object.entries(profile.stats || {}).map(([key, val]) => (
          <div key={key} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5 text-center sm:text-left transition hover:border-[#cbd5e1]">
            <p className="text-[11px] font-medium text-[#64748b] capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="mt-1 text-xl font-bold text-[#0f172a]">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileHeader;
