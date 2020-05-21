import { createError } from 'apollo-errors';

export const WrongCredentialsError = createError('WrongCredentialsError', {
  message: 'The provided credentials are invalid.',
});
