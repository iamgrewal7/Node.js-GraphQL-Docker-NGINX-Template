import { WrongCredentialsError } from '../errors/errors';

export const authCheck = async (resolve: any, root: any, args: any, context: any, info: any) => {
  context.isAuthorized = info.operation.name.value === 'login' ? true : false;
  if (!(context.isAuthorized || context.request.session.user)) {
    throw new WrongCredentialsError();
  }
  const result = await resolve(root, args, context, info);
  return result;
};
