import { Mentor } from "../models/mentor.model.js";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// STUDENT subscribes to MENTOR
const subscribeToMentor = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { mentorId } = req.body;

  if (req.user.role !== "STUDENT") {
    throw new ApiError(403, "Only students can subscribe to mentors");
  }

  // Ensure Student document exists, or create if missing
  let studentDoc = await Student.findOne({ user: studentId });
  if (!studentDoc) {
    studentDoc = await Student.create({ user: studentId, mentors: [] });
  }

  // Update student's mentor list
  const updatedStudent = await Student.findOneAndUpdate(
    { user: studentId },
    { $addToSet: { mentors: mentorId } },
    { new: true }
  ).populate("mentors", "fullName email currentProfession");

  // Update mentor's student list
  await Mentor.findOneAndUpdate(
    { user: mentorId },
    { $addToSet: { students: studentId } }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedStudent, "Mentor subscribed successfully")
    );
});

// STUDENT unsubscribes from MENTOR
const unsubscribeMentor = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { mentorId } = req.body;

  if (req.user.role !== "STUDENT") {
    throw new ApiError(403, "Only students can unsubscribe mentors");
  }

  await Student.findOneAndUpdate(
    { user: studentId },
    { $pull: { mentors: mentorId } }
  );

  await Mentor.findOneAndUpdate(
    { user: mentorId },
    { $pull: { students: studentId } }
  );

  // ❗ Finally, delete the mentor document if needed
//   await Mentor.findOneAndDelete({ user: mentorId });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Mentor unsubscribed"));
});

// MENTOR unsubscribes a STUDENT
const unsubscribeStudent = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;
  const { studentId } = req.body;

  if (req.user.role !== "MENTOR") {
    throw new ApiError(403, "Only mentors can unsubscribe students");
  }

  await Mentor.findOneAndUpdate(
    { user: mentorId },
    { $pull: { students: studentId } }
  );

  await Student.findOneAndUpdate(
    { user: studentId },
    { $pull: { mentors: mentorId } }
  );

  // ❗ Finally, delete the student document if needed
//   await Student.findOneAndDelete({ user: studentId });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Student unsubscribed"));
});

// Get mentor count for logged-in STUDENT
const getMyMentorCount = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  const count = student?.mentors?.length || 0;

  return res
    .status(200)
    .json(new ApiResponse(200, count, "Your mentor count"));
});

// Get student count for logged-in MENTOR
const getMyStudentCount = asyncHandler(async (req, res) => {
  const mentor = await Mentor.findOne({ user: req.user._id });
  const count = mentor?.students?.length || 0;

  return res
    .status(200)
    .json(new ApiResponse(200, count, "Your student count"));
});

export {
  subscribeToMentor,
  unsubscribeMentor,
  unsubscribeStudent,
  getMyMentorCount,
  getMyStudentCount,
};
