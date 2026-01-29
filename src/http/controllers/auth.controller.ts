import { Request, Response } from "express";

export class AuthController {
  me(req: Request, res: Response) {
    // Return current session (if any).
    return res.json(req.session ?? null);
  }
}
