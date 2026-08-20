import { ToastContainer } from 'react-toastify';
import employeeManagementLogo from '../assets/images/employee-management-logo.png';

const AuthLayout = ({ title, children }) => (
  <main className="min-h-dvh bg-[#3d4351] text-white lg:grid lg:grid-cols-[35fr_65fr]">
    <aside className="flex items-center justify-center px-8 py-7 sm:py-9 lg:min-h-dvh lg:flex-col lg:px-10">
      <img
        className="w-28 shrink-0 object-contain sm:w-36 lg:w-64"
        src={employeeManagementLogo}
        alt="Employee Management System logo"
      />
      <p className="mt-7 hidden text-center text-2xl font-semibold leading-tight tracking-tight text-white lg:block">
        Employee Management System
      </p>
    </aside>
    <section className="flex min-h-[calc(100dvh-13.25rem)] items-center justify-center px-10 py-14 sm:min-h-0 sm:px-16 sm:py-16 lg:min-h-dvh lg:px-12 xl:px-20">
      <div className="w-full max-w-md">
        <h1 className="text-left text-[2rem] font-bold leading-none tracking-tight sm:text-4xl">{title}</h1>
        <div className="mt-16 sm:mt-20">{children}</div>
      </div>
    </section>
    <ToastContainer position="top-right" theme="dark" />
  </main>
);

export default AuthLayout;
