import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email format"),
  password: strongPassword,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const resetPasswordSchema = z.object({
  password: strongPassword,
  resetToken: z.string().optional(),
});

export const updateProfileSchema = z.object({
  userName: z.string().min(2).max(50).optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal('')),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  dialCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  postcode: z.string().optional(),
  city: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: strongPassword,
});
