export const getApiError = (error) => {
  const payload = error?.response?.data;
  if (payload?.fieldErrors && typeof payload.fieldErrors === 'object') {
    const firstFieldError = Object.values(payload.fieldErrors)[0];
    if (firstFieldError) return firstFieldError;
  }
  return payload?.message || error?.message || 'Something went wrong. Please try again.';
};
