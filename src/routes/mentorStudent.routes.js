import express from "express";

import{
    subscribeToMentor,
    unsubscribeMentor,
    unsubscribeStudent,
    getMyMentorCount,
    getMyStudentCount
} from "../controllers/mentorStudent.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
    "/subscribe",
    verifyJWT,
    authorizeRoles("STUDENT"),
    subscribeToMentor
);

router.post(
    "/student/unsubscribe",
    verifyJWT,
    authorizeRoles("STUDENT"),
    unsubscribeMentor
);

router.post(
    "/mentor/unsubscribe",
    verifyJWT,
    authorizeRoles("MENTOR"),
    unsubscribeStudent
);

router.get(
    "/student/me/mentors/count",
    verifyJWT,
    authorizeRoles("STUDENT"),
    getMyMentorCount
)

router.get(
    "/mentor/me/students/count",
    verifyJWT,
    authorizeRoles("MENTOR"),
    getMyStudentCount
);


export default router