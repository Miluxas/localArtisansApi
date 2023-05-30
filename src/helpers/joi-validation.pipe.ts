
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatError = (errors = []) => {
  const usefulErrors = {};
  errors.forEach((error) => {
    const key = error.path[0];
    if (!usefulErrors.hasOwnProperty(key)) usefulErrors[key] = [];
    usefulErrors[key].push(error.message);
  });
  return usefulErrors;
};

