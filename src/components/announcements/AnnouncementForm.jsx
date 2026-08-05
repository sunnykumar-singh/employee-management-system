import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const fieldClassName = "w-full rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm outline-none transition focus:border-[#4b3df2]";

const AnnouncementForm = ({ isOpen, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { title: '', category: '', department: '', status: '', message: '' } });

  useEffect(() => {
    if (!isOpen) return;
    reset({ title: '', category: '', department: '', status: '', message: '' });
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const closeForm = () => {
    reset();
    onClose();
  };

  const submitForm = (values) => onSave(values);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7edf5] px-6 py-4">
          <h2 className="text-xl font-bold text-[#101828]">New Announcement</h2>
          <button onClick={closeForm} className="rounded-md p-2 transition hover:bg-slate-100" type="button" aria-label="Close new announcement form"><X size={20} /></button>
        </div>

        <form className="space-y-5 p-6" onSubmit={handleSubmit(submitForm)} noValidate>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#344767]">Title</label>
              <input type="text" placeholder="Enter announcement title" className={fieldClassName} {...register('title', { required: true })} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344767]">Category</label>
              <select className={fieldClassName} {...register('category', { required: true })}><option value="">Select category</option><option>Event</option><option>Policy</option><option>Finance</option><option>IT</option></select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344767]">Department</label>
              <select className={fieldClassName} {...register('department', { required: true })}><option value="">Select department</option><option>HR</option><option>Finance</option><option>IT</option><option>Marketing</option></select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#344767]">Status</label>
              <select className={fieldClassName} {...register('status', { required: true })}><option value="">Select status</option><option>Draft</option><option>Published</option><option>Scheduled</option><option>Archived</option></select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#344767]">Announcement Message</label>
            <textarea rows={4} placeholder="Enter announcement message" className="w-full resize-none rounded-lg border border-[#d0d5dd] px-4 py-3 text-sm outline-none transition focus:border-[#4b3df2]" {...register('message', { required: true })} />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#e7edf5] pt-5">
            <button type="button" onClick={closeForm} className="rounded-lg border border-[#d0d5dd] px-5 py-2.5 text-sm font-medium text-[#344767] hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#4b3df2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4032e8] disabled:cursor-not-allowed disabled:opacity-60">Save Announcement</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;
