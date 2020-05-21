import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

import { UserInput } from './account.interface';
import bcrypt from 'bcrypt';
import { IResolvers } from 'graphql-tools';

export const resolvers: IResolvers = {
  Query: {
    // Login Resolver
    login: async (_, { email, password }, context) => {
      try {
        const user = await prisma.user.findOne({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error('User does not exists');
        }

        if (!(await bcrypt.compare(password, user.password))) {
          throw new Error('Password is incorrect');
        }

        context.request.session.user = user;

        return {
          result: 'Success',
          message: 'Log in Successful',
        };
      } catch (error) {
        return {
          result: 'Failure',
          message: 'Invalid Creds',
        };
      }
    },

    logout: async (_, __, context) => {
      try {
        context.request.session.destroy();
        return {
          result: 'Success',
          message: 'Logged Out',
        };
      } catch (error) {
        return {
          result: 'Failer',
          message: error,
        };
      }
    },

    users: async (_, __, context) => {
      const allUsers = await prisma.user.findMany();
      return allUsers;
    },
  },

  Mutation: {
    // Add User Resolver
    createUser: async (_: any, { userInput }: { userInput: UserInput }) => {
      try {
        const existingUser = await prisma.user.findOne({
          where: {
            email: userInput.email,
          },
        });

        if (existingUser) {
          throw new Error('User already exists');
        }

        bcrypt
          .hash(userInput.password, bcrypt.genSaltSync(10))
          .then(async (hashedPassword: string) => {
            await prisma.user.create({
              data: {
                firstName: userInput.firstName,
                lastName: userInput.lastName,
                email: userInput.email,
                password: hashedPassword,
              },
            });
          })
          .catch((e: any) => {
            throw e;
          });

        return true;
      } catch (error) {
        logger.error(error);
        return false;
      }
    },
  },
};
