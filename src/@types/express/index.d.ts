import "express-serve-static-core";
import type { auth } from "../../auth/auth.js";

type Session = typeof auth.$Infer.Session;

declare module "express-serve-static-core" {
  interface Request {
    /**
     * A unique identifier attached to each request. Populated by the requestId middleware.
     */
    id?: string;
    session?: Session;
  }
}
