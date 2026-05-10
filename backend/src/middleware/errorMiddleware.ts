import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Mongoose ObjectId cast failure (invalid ID in URL param)
  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({
      status: "failed",
      message: `Invalid value for field '${err.path}'.`,
    });
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    return res.status(409).json({
      status: "failed",
      message: `A record with this ${field} already exists.`,
    });
  }

  // Mongoose validation errors
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return res.status(422).json({
      status: "failed",
      message: messages.join("; "),
    });
  }

  // Custom ApiError with explicit statusCode
  const statusCode: number = err.statusCode ?? 500;
  const message: string = err.message ?? "Internal server error";

  return res.status(statusCode).json({
    status: "failed",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
