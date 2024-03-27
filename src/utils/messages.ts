import { HttpStatus } from '@nestjs/common';

export const MESSAGES = {
  EMAIL_ALREADY_EXIST:
    'Email already exists. Please try again with a different email address.',
  USER_INACTIVE: 'USer inactive. Please verify your email address.',
  INVALID_CREDENTIALS:
    'Invalid credentials. Please try with correct credentials.',
  INVALID_OTP: 'Invalid OTP. Please try with correct otp',
  RESET_LINK_EXPIRED: 'Link expired.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
};
export const SWAGGER_MESSAGES = {
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  },
  [HttpStatus.UNAUTHORIZED]: {
    status: HttpStatus.UNAUTHORIZED,
    description: MESSAGES.UNAUTHORIZED,
  },
  [HttpStatus.BAD_REQUEST]: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  },
};
