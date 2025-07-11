import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



/*
  - `express()` creates an Express application instance.
  - This `app` is our main backend server where we define middleware & routes.
*/

const app = express()


/*
    What is CORS? 
  - CORS (Cross-Origin Resource Sharing) prevents unauthorized websites from accessing your backend.
  - Example: If your frontend is at `example.com` and your backend is at `api.example.com`, CORS allows them to talk.
  - `credentials: true` allows cookies & tokens to be sent with requests (important for authentication!).
*/

app.use(cors({
    origin: process.env.CORS_ORIGIN, // Restricts requests to allowed domains (from .env)
    credentials: true // Allows cookies & authentication headers to be sent
}))

/*
    `express.json({ limit: "16kb" })`
  - This middleware enables Express to parse JSON data in requests.
  - The `limit: "16kb"` ensures request bodies don’t exceed 16KB (prevents excessive memory usage).
  - Example: If a user sends `{ "name": "John" }`, this middleware makes sure we can access `req.body.name`.
*/

app.use(express.json({limit: "16kb"}))

/*
     `express.urlencoded({ extended: true, limit: "16kb" })`
  - Parses URL-encoded data (like form submissions `application/x-www-form-urlencoded`).
  - `extended: true` allows complex nested objects to be sent.
  - Example: If a form sends `name=John&age=25`, this makes sure we can access `req.body.name` and `req.body.age`.
*/

app.use(express.urlencoded({extended: true, limit: "16kb"}))

/*
     `express.static("public")`
  - Serves static files (images, CSS, JavaScript) from the `public` folder.
  - Example: If `public/logo.png` exists, you can access it at `http://yourserver.com/logo.png`.
*/

app.use(express.static("public"))

/*
     `cookieParser()`
  - Enables Express to read cookies from requests.
  - Useful for authentication (storing tokens in cookies instead of headers).
  - Example: If a user logs in, their token is stored in a cookie like `accessToken=xyz123`.
*/

app.use(cookieParser())



//routes import
import userRouter from "./routes/user.routes.js";
import userRoleMetricsRoutes from "./routes/userRoleMetrics.routes.js";




// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/mentor-student", userRoleMetricsRoutes);

//http://localhost:8000/api/v1/users/register
export { app }