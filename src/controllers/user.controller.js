import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async(userId)=>{
    // Function to generate new access & refresh tokens for a user
try {
        const user = await User.findById(userId);
         // Find the user in the database using their ID

        const accessToken = user.generateAccessToken();
        // Generate a new access token

        const refreshToken= user.generateRefreshToken();
        // Generate a new refresh token

    
        user.refreshToken = refreshToken; // Store the refresh token in the database
        await user.save({ validateBeforeSave: false });
        // Save the user without triggering other validation rules

    
        return { accessToken, refreshToken }; // Return the tokens
} catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token");
}
  /* 

  👉 Why do we generate access and refresh tokens separately?
   - Access tokens expire quickly for security.
   - Refresh tokens last longer and are used to get new access tokens without logging in again.

   👉 Why do we set validateBeforeSave: false?
   - To prevent Mongoose from running unnecessary validations when updating only the refresh token.
*/
}





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


  // This function handles user login requests
  // It checks user credentials and returns access & refresh tokens
const loginUser = asyncHandler(async (req, res)=>{
// Algorithm:
    // req body -> data
    // email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, password} = req.body; // Extract email, username & password from request
    // console.log("Extracted email:", email); // Debugging: logs email to see if it was received

    if (!email) {
    // If email is not provided, throw an error
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email })// Search for user by email

    if (!user) {
    // If user isn't found, send a 404 error
        throw new ApiError(404, "User does not exist");
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
     // Check if provided password matches the stored hashed password
    


    if (!isPasswordValid) {
    // If password is wrong, send a 401 error (Unauthorized)
        throw new ApiError(401, "Invalid user credentials")
    }

    // Generate new access & refresh tokens for the user
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    // Fetch user details but exclude sensitive fields (password, refresh token)


    const options = {
        httpOnly: true,// Prevents JavaScript access to cookies for security or simply users cannot modify the cookies when we set this flag
        secure: true// Ensures cookies are sent only over HTTPS

    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)// Store access token in HTTP-only cookie
    .cookie("refreshToken", refreshToken, options)// Store refresh token in HTTP-only cookie
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
        /*
        👉 Why do we check for both email & username?
        - Users can log in using either, so we search by both.

        👉 Why do we exclude password & refreshToken from the response?
        - To prevent sensitive information from being exposed in API responses.

        👉 Why do we hash passwords & check using bcrypt?
        - Storing plain text passwords is insecure. bcrypt allows safe comparisons.

        👉 Why do we generate access & refresh tokens on login?
        - Access tokens provide short-term authentication, while refresh tokens allow users to stay logged in.

        👉 Why do we store tokens in cookies with httpOnly & secure?
        - httpOnly: Prevents JavaScript-based attacks (e.g., XSS)
        - secure: Ensures cookies are only sent over HTTPS for security.
        */

});



 // This function logs out the user by removing their refresh token from the database
const logoutUser = asyncHandler(async (req, res)=>{
// Algorithm:
    // req -> user info (from authentication middleware)
    // find user by id
    // remove refreshToken field from user document
    // set cookie options (httpOnly, secure)
    // clear accessToken and refreshToken cookies
    // send success response (User logged Out)
    
    // console.log("User after logout:", req.user); // Debugging: logs req.user(from auth.middleware.js) to see if it was received 
    // should work if token was verified
    
    await User.findByIdAndUpdate(
        req.user._id,// Find the user by their ID in MongoDB
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true, // Ensures the updated document is returned
        }
    );
    

      /*
    What is findByIdAndUpdate?
    - This is a MongoDB method (via Mongoose) that finds a document by its `_id` and updates it.
    - `$unset` removes a field from the document (in this case, refreshToken).
    - `{ new: true }` ensures we get the updated document after the change.
    */

    const options = {
        httpOnly: true, // Ensures cookies can't be accessed via JavaScript (security measure)
        secure: true // Ensures cookies are only sent over HTTPS
    }

    return res
    .status(200)
    .clearCookie("accessToken", options) // Remove accessToken cookie
    .clearCookie("refreshToken", options) // Remove refreshToken cookie
    .json(new ApiResponse(200, { }, "User logged Out"));

      /*
    Logout Process Notes:

    👉 Why do we unset refreshToken in the database?
    - This ensures the user can't use an old refresh token to get a new access token after logging out.
    - Think of it like taking away someone's membership card when they leave the club!

    👉 Why do we clear cookies?
    - Access & refresh tokens are stored in cookies, so clearing them fully logs the user out.
    - No tokens = No access = Secure logout!

    */
});


  // This function helps users stay logged in by refreshing their access token.
  // It checks if the refresh token is valid, then issues a new access token.
const refreshAccessToken = asyncHandler(async (req, res)=>{
// Algorithm:
   /*
1. Get refresh token from cookies or body.
2. If missing, return unauthorized error.
3. Try to:
   a. Verify refresh token with secret.
   b. Decode token and get user ID.
   c. Find user by ID in database.
   d. If user not found, return error.
   e. If token mismatch, return error.
   f. Generate new access and refresh tokens.
   g. Set tokens in secure, HTTP-only cookies.
   h. Return tokens and success message.
4. Catch errors and return unauthorized error.
 
   */

const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;  // Tries to get refresh token from cookies first, then from request body
// console.log("Incoming refresh token:", incomingRefreshToken);


if (!incomingRefreshToken) {
    // If there's no refresh token, the request is not allowed
    throw new ApiError(401, "unauthorized request")
}
try {
        // Step 1: Verify the refresh token using JWT (JSON Web Token)
        const decodeToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET // Uses a secret key to check if the token is valid
        )
    
        // Step 2: Find the user in the database using the user ID from the token
        const user = await User.findById(decodeToken?._id)// Finds user based on ID stored in the refresh token
    
        if (!user) {
        // If no user is found, the token is invalid
            throw new ApiError(401, "Invalid refresh token")
        }
    
         // Step 3: Check if the refresh token provided matches the one stored in the database
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        // Step 4: Set options for cookies (security settings)
        const options = {
            httpOnly: true,
            secure: true
        }
    
        // Step 5: Generate new access & refresh tokens for the user
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie( "accessToken", accessToken, options)// Stores new access token in secure cookie
        .cookie("refreshToken", newrefreshToken, options)// Stores new refresh token in secure cookie
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newrefreshToken
                },
                "Access token refreshed"
            )
        )
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token"); // Handles token verification errors
    
}
 /*
        Deep Dive into Refresh Token Flow:

        👉 What’s the purpose of a refresh token?
        - Access tokens expire quickly for security reasons.
        - Refresh tokens allow users to stay logged in without re-entering their password.

        👉 Why do we verify the refresh token?
        - To make sure it was created by our server and hasn’t been tampered with.
        - Prevents hackers from generating fake tokens.

        👉 Why do we check if the refresh token matches the one in the database?
        - If a hacker steals an old refresh token, they shouldn’t be able to use it.
        - Only the latest refresh token should be valid.

        👉 Why do we replace the refresh token every time?
        - If someone steals the refresh token, it becomes useless after the next login.
        - This makes our system more secure.

        👉 What happens if a refresh token is missing?
        - The user is logged out and must log in again.
        - Prevents unauthorized access when tokens are missing.

*/

});


const changeCurrentPassword = asyncHandler(async (req, res)=>{
//Algorithm:
/*
1. Extract oldPassword and newPassword from request body.
2. Find user by ID from req.user.
3. Verify if oldPassword is correct using user.isPasswordCorrect.
4. If incorrect, throw error "Invalid old password".
5. Update user's password to newPassword.
6. Save user without validation.
7. Respond with success message "Password changed successfully".
*/

    const {oldPassword, newPassword}= req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
        
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json( 
        new ApiResponse(200, {}, "Password changed successfully" )
    )
})


export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword
}