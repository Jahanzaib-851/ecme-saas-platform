import { createHash, randomBytes } from "crypto";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, RefreshToken, OtpToken } from "../models/Auth.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "../utils/jwt";
import type { IUser } from "../models/Auth.model";
import admin from "../config/firebase";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const OTP_EXPIRY_MINUTES = 5;

function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

function mapUserToResponse(user: IUser) {
  return {
    userId: user._id,
    userName: user.userName,
    authority: [user.role],
    avatar: user.avatar ?? "",
    email: user.email,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    dialCode: user.dialCode ?? "",
    phoneNumber: user.phoneNumber ?? "",
    country: user.country ?? "",
    address: user.address ?? "",
    postcode: user.postcode ?? "",
    city: user.city ?? "",
  };
}

function setRefreshCookie(res: Response, token: string): void {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp(req: Request, res: Response) {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ status: "failed", message: "An account with this email already exists." });
    }

    const user = await User.create({ email, password, userName });

    const accessToken = generateAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ userId: String(user._id) });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    await RefreshToken.create({ token: refreshToken, userId: user._id, expiresAt });

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      status: "success",
      token: accessToken,
      user: mapUserToResponse(user),
    });
  } catch (error: any) {
    return res.status(500).json({ status: "failed", message: error.message ?? "Internal server error" });
  }
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: "failed", message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password as string);
    if (!passwordMatch) {
      return res.status(401).json({ status: "failed", message: "Invalid email or password." });
    }

    const accessToken = generateAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ userId: String(user._id) });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    await RefreshToken.create({ token: refreshToken, userId: user._id, expiresAt });

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      status: "success",
      token: accessToken,
      user: mapUserToResponse(user),
    });
  } catch (error: any) {
    return res.status(500).json({ status: "failed", message: "Internal server error" });
  }
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(token);
    } catch {
      res.clearCookie("refreshToken", { path: "/" });
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) await RefreshToken.deleteOne({ _id: storedToken._id });
      res.clearCookie("refreshToken", { path: "/" });
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      res.clearCookie("refreshToken", { path: "/" });
      return res.status(401).json({ message: "User not found" });
    }

    await RefreshToken.deleteOne({ _id: storedToken._id });

    const newAccessToken = generateAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({ userId: String(user._id) });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    await RefreshToken.create({ token: newRefreshToken, userId: user._id, expiresAt });

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
      status: "success",
      token: newAccessToken,
      user: mapUserToResponse(user),
    });
  } catch {
    return res.status(500).json({ status: "failed", message: "Error refreshing token" });
  }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (token) {
    await RefreshToken.deleteOne({ token });
  }
  res.clearCookie("refreshToken", { path: "/" });
  return res.status(200).json({ status: "success", message: "Signed out successfully" });
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ status: "success", data: true });
    }

    await OtpToken.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpToken.create({ email, otpHash, expiresAt });

    // Production: replace console.log with your email provider (nodemailer, SendGrid, etc.)
    console.log(`[OTP] ${email} → ${otp} (expires in ${OTP_EXPIRY_MINUTES} min)`);

    const responseData =
      process.env.NODE_ENV !== "production" ? { sent: true, otp } : true;

    return res.status(200).json({ status: "success", data: responseData });
  } catch {
    return res.status(500).json({ status: "failed", message: "Error processing request" });
  }
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    const otpHash = hashOtp(otp);

    const otpRecord = await OtpToken.findOne({ email, otpHash });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      if (otpRecord) await OtpToken.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ status: "failed", message: "Invalid or expired OTP." });
    }

    await OtpToken.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found." });
    }

    const resetToken = generateAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({ status: "success", data: { resetToken } });
  } catch {
    return res.status(500).json({ status: "failed", message: "Error verifying OTP" });
  }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(req: Request, res: Response) {
  try {
    const { password, resetToken } = req.body;

    let userId: string | undefined;

    if (resetToken) {
      try {
        const payload = verifyAccessToken(resetToken);
        userId = payload.userId;
      } catch {
        return res.status(401).json({ status: "failed", message: "Invalid or expired reset token." });
      }
    } else {
      const userReq = (req as any).user;
      if (!userReq) {
        return res.status(401).json({ status: "failed", message: "Authentication required." });
      }
      userId = userReq.userId;
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found." });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ status: "success", data: true });
  } catch {
    return res.status(500).json({ status: "failed", message: "Error resetting password" });
  }
}

// ─── Get Profile ──────────────────────────────────────────────────────────────

export async function getProfile(req: Request, res: Response) {
  try {
    const userReq = (req as any).user;
    const user = await User.findById(userReq.userId).select("-password");
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found." });
    }
    return res.status(200).json({ status: "success", data: mapUserToResponse(user as IUser) });
  } catch {
    return res.status(500).json({ status: "failed", message: "Error fetching profile" });
  }
}

// ─── Update Profile ───────────────────────────────────────────────────────────

export async function updateProfile(req: Request, res: Response) {
  try {
    const userReq = (req as any).user;
    const { userName, avatar, firstName, lastName, dialCode, phoneNumber, country, address, postcode, city } = req.body;

    const updates: Record<string, unknown> = {};
    if (userName) updates.userName = userName;
    if (avatar !== undefined) updates.avatar = avatar;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (dialCode !== undefined) updates.dialCode = dialCode;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (country !== undefined) updates.country = country;
    if (address !== undefined) updates.address = address;
    if (postcode !== undefined) updates.postcode = postcode;
    if (city !== undefined) updates.city = city;

    const user = await User.findByIdAndUpdate(
      userReq.userId,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found." });
    }

    return res.status(200).json({ status: "success", data: mapUserToResponse(user as IUser) });
  } catch {
    return res.status(500).json({ status: "failed", message: "Error updating profile" });
  }
}

// ─── Change Password (authenticated — requires current password) ──────────────

export async function changePassword(req: Request, res: Response) {
  try {
    const userReq = (req as any).user;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userReq.userId);
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password as string);
    if (!passwordMatch) {
      return res.status(400).json({ status: "failed", message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ status: "success", data: true });
  } catch {
    return res.status(500).json({ status: "failed", message: "Error changing password" });
  }
}

// ─── Google OAuth Sign-In ─────────────────────────────────────────────────────

export async function googleSignIn(req: Request, res: Response) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ status: "failed", message: "Firebase ID token required." });
    }

    // Verify the Firebase ID token
    let decoded: admin.auth.DecodedIdToken;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch {
      return res.status(401).json({ status: "failed", message: "Invalid or expired Google token." });
    }

    const { uid, email, name, picture } = decoded;
    if (!email) {
      return res.status(400).json({ status: "failed", message: "Google account has no email." });
    }

    // Find existing user or create one
    let user = await User.findOne({ $or: [{ googleId: uid }, { email }] });

    if (!user) {
      // New user — create with a random unusable password
      user = await User.create({
        email,
        userName: name ?? email.split("@")[0],
        avatar: picture ?? null,
        googleId: uid,
        password: randomBytes(32).toString("hex"),
      });
    } else {
      // Link Google ID to existing account if not already linked
      if (!user.googleId) user.googleId = uid;
      if (picture && !user.avatar) user.avatar = picture;
      await user.save();
    }

    const accessToken = generateAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ userId: String(user._id) });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    await RefreshToken.create({ token: refreshToken, userId: user._id, expiresAt });

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      status: "success",
      token: accessToken,
      user: mapUserToResponse(user as IUser),
    });
  } catch (error: any) {
    return res.status(500).json({ status: "failed", message: error.message ?? "Google sign-in failed." });
  }
}
