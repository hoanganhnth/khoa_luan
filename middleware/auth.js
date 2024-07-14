import Constants from "../utils/constants.js";
import { Role, UserRole, User, Profile } from "../models/index.js";
import jwt from 'jsonwebtoken'
export function auth(req, res, next) {
  if (req.user?.id) return next();

  return res.sendStatus(Constants.STATUS_CODES.UNAUTHORIZED_ERROR);
}
export function authentication(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader?.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        req.user = {};
        return next();
      }
      try {
        const user = await User.findById(decoded.id).select({
          password: 0,
          refresh_token: 0,
        });
        if (user) {
          req.user = user.toObject({ getters: true });
        } else {
          req.user = {};
        }

        return next();
      } catch (error) {
        console.error(Constants.MESSAGES.AUTHENTICATION_ERROR, error);
        return res.status(Constants.STATUS_CODES.FORBIDDEN_ERROR).json({ message: Constants.MESSAGES.AUTHENTICATION_ERROR});
      }
    });
  } else {
    req.user = {};
    return next();
  }
}
const checkUserRole = (allowedRole) => async (req, res, next) => {
  try {
    if (req.user?.id) {
      try {
        const role = await Role.findById(rolePermission.role_id);
        if (!role) {
          return res.status(403).json({ message: "Role not found" });
        }
        if (role.name === allowedRole) {
          return next(); // Cho phép tiếp tục nếu có quyền
        } else {
          return res.sendStatus(Constants.STATUS_CODES.FORBIDDEN_ERROR); // Từ chối quyền nếu không có quyền
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    return res.sendStatus(Constants.STATUS_CODES.UNAUTHORIZED_ERROR);
  } catch (error) {
    console.error(error);
    return res.sendStatus(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};

export const isAdmin = checkUserRole(Constants.ROLES.ADMIN);
export const isRecruiter = checkUserRole(Constants.ROLES.RECRUITER);