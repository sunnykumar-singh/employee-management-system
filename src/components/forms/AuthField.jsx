import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const AuthField = ({ label, name, type = 'text', icon: Icon, error, register, ...inputProps }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  return (
    <div>
      <label className="sr-only" htmlFor={name}>
        {label}
      </label>
      <div className="flex items-center border-b border-slate-300/45 pb-3 transition-colors focus-within:border-[#e5ad45]">
        {Icon && <Icon className="mr-4 shrink-0 text-slate-200" size={21} strokeWidth={1.4} aria-hidden="true" />}
        <input
          id={name}
          type={inputType}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-slate-400"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          {...register}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            className="ml-2 rounded p-1 text-slate-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff size={19} strokeWidth={1.5} /> : <Eye size={19} strokeWidth={1.5} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-3 text-center text-xs font-medium text-rose-300" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default AuthField;
