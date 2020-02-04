const Errors = {
  BadRequest: {
    status: 400,
    message: 'Request has wrong format.',
  },
  Unauthorized: {
    status: 401,
    message: 'Authentication credentials not valid.',
  },
  Forbidden: {
    status: 403,
    message: "You're missing permission to execute this request.",
  },
  NotFound: {
    status: 404,
    message: 'Resource  not found.',
  },
  UnprocessableEntity: {
    status: 422,
    message: "Request can't be processed",
  },
  InternalServerError: {
    status: 500,
    message: 'Internal server error',
  },
};

class ErrorREST extends Error {
  public status: number;
  public message: string;
  public data?: any;
  public constructor(status: number, message: string, data?: any) {
    super();
    Object.setPrototypeOf(this, ErrorREST.prototype);
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export { ErrorREST, Errors };
