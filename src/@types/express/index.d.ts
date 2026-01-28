import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    /**
     * A unique identifier attached to each request. Populated by the requestId middleware.
     */
    id?: string;
  }
}