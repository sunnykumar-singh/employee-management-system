import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthField from '../../components/forms/AuthField.jsx';
import AuthLayout from '../../layouts/AuthLayout.jsx';

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = () => {
    toast.info('Self-registration is not available. Please contact an administrator.');
    navigate('/login');
  };
  const onInvalid = () => toast.error('Please correct the highlighted fields.');

  return (
    <AuthLayout title="Sign Up">
      <form className="space-y-7" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        <AuthField
          label="Full name"
          name="fullName"
          icon={UserRound}
          placeholder="Full name"
          autoComplete="name"
          error={errors.fullName}
          register={register('fullName', { required: 'Full name is required.' })}
        />
        <AuthField
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="Email"
          autoComplete="email"
          error={errors.email}
          register={register('email', {
            required: 'Email is required.',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
          })}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          icon={LockKeyhole}
          placeholder="Password"
          autoComplete="new-password"
          error={errors.password}
          register={register('password', {
            required: 'Password is required.',
            minLength: { value: 6, message: 'Password must be at least 6 characters.' },
          })}
        />
        <AuthField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          icon={LockKeyhole}
          placeholder="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          register={register('confirmPassword', {
            required: 'Please confirm your password.',
            validate: (value, formValues) => value === formValues.password || 'Passwords do not match.',
          })}
        />
        <button
          className="mt-8 w-full rounded-full bg-[#1d2029] px-5 py-[1.08rem] text-[1.35rem] font-bold text-white shadow-[0_13px_20px_rgba(15,18,27,0.38)] transition hover:bg-[#161922] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#3d4351]"
          type="submit"
        >
          Register
        </button>
      </form>
      <p className="mt-5 text-center text-[13px] text-white">
        Already have an account?{' '}
        <Link className="font-bold text-slate-300 transition hover:text-white" to="/login">
          Log In.
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
