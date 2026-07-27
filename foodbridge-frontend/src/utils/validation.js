import { z } from 'zod';

export const otpRequestSchema = z.object({
  phone_number: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^\+?[0-9\s\-()]+$/, { message: 'Invalid phone number format' }),
});

export const otpVerifySchema = z.object({
  phone_number: z.string().min(10),
  otp_code: z
    .string()
    .length(6, { message: 'OTP must be exactly 6 digits' })
    .regex(/^[0-9]+$/, { message: 'OTP must contain only numbers' }),
});

export const emailLoginSchema = z.object({
  identity: z
    .string()
    .min(3, { message: 'Email or phone number is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  remember_me: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    full_name: z.string().min(2, { message: 'Full name is required' }),
    phone_number: z
      .string()
      .min(10, { message: 'Valid phone number is required' }),
    email: z
      .string()
      .email({ message: 'Valid email address is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirm_password: z.string(),
    role: z.enum(['donor', 'ngo', 'volunteer', 'corporate'], {
      required_error: 'Please select a role',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export const forgotPasswordSchema = z.object({
  identity: z.string().min(3, { message: 'Email or phone number is required' }),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: 'Reset token is required' }),
    new_password: z
      .string()
      .min(8, { message: 'New password must be at least 8 characters' }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });
