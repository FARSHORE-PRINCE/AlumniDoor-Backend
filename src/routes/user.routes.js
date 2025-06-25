import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserRole,
    updateUserByRoleFields
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)


// Role update (MENTOR/ALUMNI only; STUDENT restricted)
router.route("/update-role").put(verifyJWT, updateUserRole);

// Role-based field update (MENTOR and ALUMNI only logic handled in controller)
router.route("/update-role-fields").put(verifyJWT, updateUserByRoleFields);

export default router