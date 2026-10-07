import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MemoryStore from "memorystore";
import bcrypt from "bcrypt";
import type { Express, RequestHandler } from "express";
import type { AdminRole } from "@shared/schema";
import { storage } from "./storage";

const LEGACY_ADMIN_USERNAME = "admin";
const LEGACY_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@clearcutlandmanagement.com";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      role: AdminRole;
    }
  }
}

export function setupAuth(app: Express) {
  const SessionStore = MemoryStore(session);

  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({ checkPeriod: 86400000 }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      if (LEGACY_ADMIN_PASSWORD && username === LEGACY_ADMIN_USERNAME && password === LEGACY_ADMIN_PASSWORD) {
        return done(null, { id: "legacy-admin", username: LEGACY_ADMIN_USERNAME, role: "super_admin" as AdminRole });
      }

      try {
        const adminUser = await storage.getAdminUserByEmail(username);
        if (!adminUser) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const match = await bcrypt.compare(password, adminUser.passwordHash);
        if (!match) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, {
          id: adminUser.id,
          username: adminUser.displayName || adminUser.email,
          role: adminUser.role as AdminRole,
        });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, JSON.stringify({ id: user.id, username: user.username, role: user.role }));
  });

  passport.deserializeUser((data: string, done) => {
    try {
      const user = JSON.parse(data);
      done(null, user);
    } catch {
      done(null, false);
    }
  });
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
};

export function requireRole(allowedRoles: AdminRole[]): RequestHandler {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userRole = (req.user as Express.User)?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    return next();
  };
}

export async function seedDefaultAdmin() {
  if (!LEGACY_ADMIN_PASSWORD) {
    console.warn("ADMIN_PASSWORD is not set; skipping default admin seed.");
    return;
  }
  try {
    const existing = await storage.getAdminUserByEmail(DEFAULT_ADMIN_EMAIL);
    if (!existing) {
      const hash = await bcrypt.hash(LEGACY_ADMIN_PASSWORD, 10);
      await storage.createAdminUser({
        email: DEFAULT_ADMIN_EMAIL,
        passwordHash: hash,
        displayName: "Super Admin",
        role: "super_admin",
      });
      console.log(`Seeded default super admin user: ${DEFAULT_ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error("Failed to seed default admin:", err);
  }
}
