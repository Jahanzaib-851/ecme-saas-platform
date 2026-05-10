import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  userName: string;
  email: string;
  password?: string;
  googleId?: string;
  role: "ADMIN" | "USER" | "DEVELOPER";
  avatar: string | null;
  firstName?: string;
  lastName?: string;
  dialCode?: string;
  phoneNumber?: string;
  country?: string;
  address?: string;
  postcode?: string;
  city?: string;
}

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    googleId: { type: String, sparse: true, index: true },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "DEVELOPER"],
      default: "USER",
    },
    avatar: { type: String, default: null },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    dialCode: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    country: { type: String, trim: true },
    address: { type: String, trim: true },
    postcode: { type: String, trim: true },
    city: { type: String, trim: true },
  },
  { timestamps: true }
);

// email is already indexed via `unique: true` in the schema definition above
userSchema.index({ userName: 1 });

userSchema.pre<IUser>("save", async function (this: IUser) {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Refresh Token ────────────────────────────────────────────────────────────

export interface IRefreshToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
}

const tokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
});

// TTL index — MongoDB auto-deletes expired tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ─── OTP Token ────────────────────────────────────────────────────────────────

export interface IOtpToken extends Document {
  email: string;
  otpHash: string; // SHA-256 hash — never store OTPs in plain text
  expiresAt: Date;
}

const otpTokenSchema = new Schema<IOtpToken>({
  email: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ─── Exports ──────────────────────────────────────────────────────────────────

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export const RefreshToken: Model<IRefreshToken> = mongoose.model<IRefreshToken>(
  "RefreshToken",
  tokenSchema
);
export const OtpToken: Model<IOtpToken> = mongoose.model<IOtpToken>(
  "OtpToken",
  otpTokenSchema
);
