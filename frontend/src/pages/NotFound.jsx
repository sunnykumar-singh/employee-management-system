import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="flex min-h-dvh flex-col items-center justify-center bg-[#f8fafc] px-6 text-center">
    <p className="text-sm font-semibold text-[#4b3df2]">404</p>
    <h1 className="mt-2 text-3xl font-bold text-[#101828]">Page not found</h1>
    <p className="mt-2 text-sm text-[#667085]">The page you are looking for does not exist.</p>
    <Link className="mt-6 rounded-lg bg-[#4b3df2] px-4 py-2.5 text-sm font-medium text-white" to="/login">
      Back to login
    </Link>
  </main>
);

export default NotFound;
