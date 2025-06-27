import { Mentor } from "../models/mentor.model.js";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


/*
🔁 1. subscribeToMentor
What it does: Allows a STUDENT to subscribe to a MENTOR.

✅ Checks that only a STUDENT can subscribe

✅ Ensures a Student document exists; if not, creates it

✅ Adds the mentorId to the student’s mentors array ($addToSet avoids duplicates)

✅ Adds the student to the mentor’s students array

✅ Returns the updated student with populated mentor info

*/
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

/*
🔄 2. unsubscribeMentor
What it does: Allows a STUDENT to unsubscribe from a mentor.

✅ Only STUDENT role is allowed

✅ Uses $pull to remove mentorId from student’s mentors

✅ Also removes the student from the mentor’s students array

📝 (Optional): You could auto-delete the mentor document if no students are left, but it’s commented out

*/
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

/*
🔄 3. unsubscribeStudent
What it does: Allows a MENTOR to remove a specific student from their list.

✅ Only MENTOR role is allowed

✅ Removes studentId from mentor’s students

✅ Also removes mentor from student’s mentors
*/
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

/*
🔢 4. getMyMentorCount
What it does: Lets a logged-in STUDENT see how many mentors they have.

Finds the student's mentor list length
Returns the count
*/
const getMyMentorCount = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  const count = student?.mentors?.length || 0;

  return res
    .status(200)
    .json(new ApiResponse(200, count, "Your mentor count"));
});

/*
🔢 5. getMyStudentCount
What it does: Lets a logged-in MENTOR see how many students they have.

Finds the mentor’s student list length

Returns the count
*/
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
