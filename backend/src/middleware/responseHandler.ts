import { Request, Response, NextFunction } from "express";

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  res.sendSuccess = (data: unknown, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
  };

  res.sendError = (message = "Error occurred", statusCode = 500, error: unknown = null) => {
    return res.status(statusCode).json({ success: false, message, error });
  };

  next();
};