import { X } from "lucide-react";

const AnnouncementForm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7edf5] px-6 py-4">
          <h2 className="text-xl font-bold text-[#101828]">New Announcement</h2>
          <button onClick={onClose} className="rounded-md p-2 transition hover:bg-slate-100" type="button" aria-label="Close new announcement form"><X size={20} /></button>
        </div>

        <form className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#344767]">Title</label>
              <input type="text" placeholder="Enter announcement title" className="w-full rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344767]">Department</label>
              <select className="w-full rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm"><option>HR</option><option>Finance</option><option>IT</option><option>Marketing</option></select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344767]">Status</label>
              <select className="w-full rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm"><option>Draft</option><option>Published</option><option>Scheduled</option><option>Archived</option></select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#344767]">Description</label>
            <textarea rows={4} placeholder="Enter announcement description" className="w-full resize-none rounded-lg border border-[#d0d5dd] px-4 py-3 text-sm" />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#e7edf5] pt-5">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#d0d5dd] px-5 py-2.5 text-sm font-medium text-[#344767] hover:bg-slate-50">Cancel</button>
            <button type="button" className="rounded-lg bg-[#4b3df2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4032e8]">Save Announcement</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;
