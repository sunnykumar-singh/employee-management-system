import { LockKeyhole, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthField from '../../components/forms/AuthField.jsx';
import AuthLayout from '../../layouts/AuthLayout.jsx';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const onSubmit = (data) => {
    toast.success('Login successful!');
    if (data.email && data.email.toLowerCase().includes('employee')) {
      navigate('/employee/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };
  const onInvalid = () => toast.error('Please correct the highlighted fields.');

  return (
    <AuthLayout title="Log In">
      <form className="space-y-9" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        <AuthField
          label="Email"
          name="email"
          type="email"
          icon={UserRound}
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
          autoComplete="current-password"
          error={errors.password}
          register={register('password', {
            required: 'Password is required.',
            minLength: { value: 6, message: 'Password must be at least 6 characters.' },
          })}
        />
        <button
          className="mt-12 w-full rounded-full bg-[#1d2029] px-5 py-[1.08rem] text-[1.35rem] font-bold text-white shadow-[0_13px_20px_rgba(15,18,27,0.38)] transition hover:bg-[#161922] focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-[#3d4351]"
          type="submit"
        >
          Log in
        </button>
      </form>
      <p className="mt-5 text-center text-[13px] text-white">
        First time here?{' '}
        <Link className="font-bold text-slate-300 transition hover:text-white" to="/register">
          Sign Up.
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
