import { z } from 'zod';
import { ROLES, PRICE_RANGES } from './constants.js';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum([ROLES.USER, ROLES.VEHICLE_OWNER, ROLES.ADMIN]).optional(),
});

export const vehicleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.string(),
  priceRange: z.enum(PRICE_RANGES),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  features: z.array(z.string()),
});

export const bookingSchema = z.object({
  date: z.string().datetime(),
  time: z.string(),
  partySize: z.number().min(1).max(20),
  specialRequests: z.string().optional(),
});