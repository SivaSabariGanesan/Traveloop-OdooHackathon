import { z } from 'zod';

// Strong password validation with complexity requirements
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*...)');

// Sanitize and validate string inputs
const sanitizeString = (str: string) => str.trim();

export const registerSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters')
    .transform(sanitizeString)
    .refine(val => !/[<>]/.test(val), 'First name contains invalid characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must not exceed 50 characters')
    .transform(sanitizeString)
    .refine(val => !/[<>]/.test(val), 'Last name contains invalid characters'),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(sanitizeString),
  password: passwordSchema,
  phone: z.string()
    .max(20, 'Phone number too long')
    .optional()
    .transform(val => val ? sanitizeString(val) : val),
  city: z.string()
    .max(100, 'City name too long')
    .optional()
    .transform(val => val ? sanitizeString(val) : val),
  country: z.string()
    .max(100, 'Country name too long')
    .optional()
    .transform(val => val ? sanitizeString(val) : val),
});

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(sanitizeString),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  firstName: z.string()
    .min(1, 'First name cannot be empty')
    .max(50, 'First name must not exceed 50 characters')
    .transform(sanitizeString)
    .refine(val => !/[<>]/.test(val), 'First name contains invalid characters')
    .optional(),
  lastName: z.string()
    .min(1, 'Last name cannot be empty')
    .max(50, 'Last name must not exceed 50 characters')
    .transform(sanitizeString)
    .refine(val => !/[<>]/.test(val), 'Last name contains invalid characters')
    .optional(),
  phone: z.string()
    .max(20, 'Phone number too long')
    .transform(sanitizeString)
    .optional(),
  city: z.string()
    .max(100, 'City name too long')
    .transform(sanitizeString)
    .optional(),
  country: z.string()
    .max(100, 'Country name too long')
    .transform(sanitizeString)
    .optional(),
});

// Schema for refresh token endpoint
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
