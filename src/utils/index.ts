import { CoreOutput } from 'src/common/dtos/output.dto';

export const logErrorAndReturnFalse = (
  error: any,
  errorMessage: string,
): CoreOutput => {
  console.error(error);

  return { ok: false, error: errorMessage };
};
