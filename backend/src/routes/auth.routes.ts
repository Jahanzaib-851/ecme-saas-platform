import { Router } from "express";
import {
  signIn,
  signUp,
  signOut,
  refreshTokenHandler,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  googleSignIn,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../schemas/auth.schema";

const router = Router();

// Public auth routes
router.post("/google", googleSignIn);
router.post("/sign-in", validate(signInSchema), signIn);
router.post("/sign-up", validate(signUpSchema), signUp);
router.post("/sign-out", signOut);
router.post("/refresh-token", refreshTokenHandler);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

// Protected profile routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, validate(updateProfileSchema), updateProfile);
router.put("/change-password", authenticate, validate(changePasswordSchema), changePassword);

export default router;
