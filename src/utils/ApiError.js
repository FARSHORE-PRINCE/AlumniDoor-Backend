// Custom error class for handling API errors
class ApiError extends Error {
    constructor(
        statusCode,          // HTTP status code (e.g., 404, 500)
        message = "Something went wrong", // Default error message
        errors = [],         // Additional error details (optional)
        stack = ""           // Stack trace (optional)
    ) {
        super(message);      // Call parent Error class with the message
        this.statusCode = statusCode; // Store HTTP status code
        this.data = null;    // Placeholder for additional data (if needed)
        this.message = message; // Store the error message
        this.success = false;   // Always false for errors
        this.errors = errors;   // Store additional error details

        // If a custom stack trace is provided, use it; otherwise, generate one
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the class to use it in other files
export { ApiError };
