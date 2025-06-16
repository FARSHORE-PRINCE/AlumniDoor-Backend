import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"



// asyncHandler makes sure we catch errors without breaking the whole app
const registerUser = asyncHandler( async (req, res)=> {
// Algorithm:
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // Future: Profile Pic, LinkedIn
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

  

  // Getting user details from the request body (aka what the frontend sends us)
    const { role, fullName, email, phone, degree, graduationYear, currentProfession, password } = req.body;
    //Future: linkedIn, profilePhoto
    // console.log("email: ", email);
    // console.log("req.body: ", req.body);

    // Checking if any required field is empty
    // .trim() removes spaces so "   " isn’t counted as valid input
    if ([role, fullName, email, phone, degree, graduationYear, currentProfession, password].some(field => !field?.toString().trim())) {
    throw new ApiError(400, "All fields are required.");
    }

    // Checking if this email is already taken
   // $or is a MongoDB operator that checks multiple conditions
    const existedUser= await User.findOne({email: req.body.email })
    
    if (existedUser) {
        throw new ApiError(409, "Email already registered")
    }

    // Creating a new user in the database
    const user = await User.create({
    role,
    fullName,
    email,
    phone,
    degree,
    graduationYear,
    currentProfession,
    password 
    });

    // Fetching the newly created user, but without sensitive info (password, refresh token)
   // .select("-password -refreshToken") removes those fields from the returned object
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // console.log(createdUser);

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // Sending back a success response
    return res.status(201).json(
         new ApiResponse(200, createdUser, "User registered Successfully")
    )

 /*
TL;DR of what’s happening here:

1. Grab user details from the request.
   
2. Check if any field is empty and throw an error if it is.

3. Make sure the email isn’t already taken by checking the database.

4. Save user data in the database.

7. Retrieve the user from the database again, but exclude sensitive fields (password, refresh token).

8. Send a success response with the user’s details (minus sensitive info).


👉 Why do we exclude password & refreshToken?
   - Security reasons! We don’t want to expose sensitive info in API responses.

👉 Why do we use .some() to check empty fields?
   - Because it quickly checks if *any* field is empty without looping through all of them manually.

👉 Why do we return res.status(201)?
   - 201 means "Created" in HTTP status codes, which is perfect for a successful registration.
*/
} );



export { registerUser }