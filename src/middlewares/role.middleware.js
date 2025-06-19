import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...roles)=>{
    return (req, _, next)=> {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `Access denied for role: ${req.user.role}` );
            
        }
        next();
    };
};