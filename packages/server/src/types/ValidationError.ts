interface ValidationError {
  location: string;
  param: string;
  msg: string;
  value: string;
}

export default ValidationError;
