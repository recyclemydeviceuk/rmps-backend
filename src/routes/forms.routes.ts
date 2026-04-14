import { Router } from 'express';
import {
  // Newsletter
  getNewsletterSubmissions, subscribeNewsletter, unsubscribeNewsletter,
  // Contact
  getContactSubmissions, getContactSubmission, submitContact, updateContactStatus, deleteContact,
  // Warranty
  getWarrantySubmissions, getWarrantySubmission, submitWarranty, updateWarrantyStatus, deleteWarranty,
} from '../controllers/forms.controller';
import { validateBody } from '../middleware/validate';
import { newsletterSchema, contactSchema, warrantySchema } from '../validators/forms.validator';
import { authenticate } from '../middleware/auth';

const router = Router();

// ── Newsletter ────────────────────────────────────────────
// Public: submit subscription
router.post('/newsletter',           validateBody(newsletterSchema), subscribeNewsletter);
// Admin: list + manage
router.get('/newsletter',            authenticate, getNewsletterSubmissions);
router.patch('/newsletter/:id/unsubscribe', authenticate, unsubscribeNewsletter);

// ── Contact ───────────────────────────────────────────────
// Public: submit form
router.post('/contact',              validateBody(contactSchema), submitContact);
// Admin: list + manage
router.get('/contact',               authenticate, getContactSubmissions);
router.get('/contact/:id',           authenticate, getContactSubmission);
router.patch('/contact/:id/status',  authenticate, updateContactStatus);
router.delete('/contact/:id',        authenticate, deleteContact);

// ── Warranty ──────────────────────────────────────────────
// Public: submit claim
router.post('/warranty',             validateBody(warrantySchema), submitWarranty);
// Admin: list + manage
router.get('/warranty',              authenticate, getWarrantySubmissions);
router.get('/warranty/:id',          authenticate, getWarrantySubmission);
router.patch('/warranty/:id/status', authenticate, updateWarrantyStatus);
router.delete('/warranty/:id',       authenticate, deleteWarranty);

export default router;
