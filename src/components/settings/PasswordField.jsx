import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const fieldClassName = 'w-full rounded-md border border-[#dfe6f0] bg-white px-3 py-2.5 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6659f5] focus:ring-2 focus:ring-[#ecebff]';

const PasswordField = ({ label, placeholder, error, register }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Field label={label}>
      <div className="relative">
        <input className={`${fieldClassName} pr-10`} type={isPasswordVisible ? 'text' : 'password'} placeholder={placeholder} {...register} />
        <button
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#667085] transition hover:text-[#101828]"
          onClick={() => setIsPasswordVisible((visible) => !visible)}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <ErrorMessage error={error} />
    </Field>
  );
};

const Field = ({ label, children }) => <label className="block text-sm font-medium text-[#344767]">{label}{children}</label>;
const ErrorMessage = ({ error }) => error ? <p className="mt-1.5 text-xs text-[#f04438]">{error.message}</p> : null;

export default PasswordField;
