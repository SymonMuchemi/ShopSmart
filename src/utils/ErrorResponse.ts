class ErrorResponse extends Error {
    constructor(message: string, statusCode: number | 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;
