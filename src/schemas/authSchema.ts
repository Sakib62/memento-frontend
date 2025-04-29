import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signInSchema = z.object({
  identifier: z.string().min(1, 'Email/Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
