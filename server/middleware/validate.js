import { AppError } from '../utils/errors.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const messages = error.errors.map((err) => err.message);
    next(new AppError(messages.join(', '), 400));
  }
};