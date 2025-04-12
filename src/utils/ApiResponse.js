// Custom response class for structuring API responses
class ApiResponse {
    constructor(
        statusCode,          // HTTP status code (e.g., 200, 404)
        data,                // Actual data to be sent in the response
        message = "Success"  // Default success message
    ) {
        this.statusCode = statusCode; // Store HTTP status code
        this.data = data;             // Store the response data
        this.message = message;       // Store the response message
        this.success = statusCode < 400; // True if status code is less than 400 (success)
    }
}

// Export the class to use it in other files
export { ApiResponse };
