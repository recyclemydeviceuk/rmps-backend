import axios from 'axios';
import { env } from './env';

export const brevoClient = axios.create({
  baseURL: 'https://api.brevo.com/v3',
  headers: {
    'api-key':      env.BREVO_API_KEY,
    'Content-Type': 'application/json',
    accept:         'application/json',
  },
});
