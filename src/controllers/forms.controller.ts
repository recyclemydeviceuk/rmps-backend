import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { FormsService } from '../services/forms.service';

// ── Newsletter ────────────────────────────────────────────
export const getNewsletterSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const result = await FormsService.getNewsletterSubmissions(req.query);
  sendSuccess(res, result.data, 'Newsletter submissions retrieved', 200, result.meta);
});

export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const sub = await FormsService.subscribe(req.body);
  sendCreated(res, sub, 'Subscribed successfully');
});

export const unsubscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const sub = await FormsService.unsubscribe(req.params.id);
  sendSuccess(res, sub, 'Unsubscribed');
});

export const deleteNewsletter = asyncHandler(async (req: Request, res: Response) => {
  await FormsService.deleteNewsletter(req.params.id);
  sendNoContent(res);
});

// ── Contact ───────────────────────────────────────────────
export const getContactSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const result = await FormsService.getContactSubmissions(req.query);
  sendSuccess(res, result.data, 'Contact submissions retrieved', 200, result.meta);
});

export const getContactSubmission = asyncHandler(async (req: Request, res: Response) => {
  const sub = await FormsService.getContactById(req.params.id);
  sendSuccess(res, sub, 'Contact submission retrieved');
});

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const sub = await FormsService.submitContact(req.body);
  sendCreated(res, sub, 'Message sent successfully');
});

export const updateContactStatus = asyncHandler(async (req: Request, res: Response) => {
  const sub = await FormsService.updateContactStatus(req.params.id, req.body.status);
  sendSuccess(res, sub, 'Status updated');
});

export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  await FormsService.deleteContact(req.params.id);
  sendNoContent(res);
});

// ── Warranty ──────────────────────────────────────────────
export const getWarrantySubmissions = asyncHandler(async (req: Request, res: Response) => {
  const result = await FormsService.getWarrantySubmissions(req.query);
  sendSuccess(res, result.data, 'Warranty claims retrieved', 200, result.meta);
});

export const getWarrantySubmission = asyncHandler(async (req: Request, res: Response) => {
  const sub = await FormsService.getWarrantyById(req.params.id);
  sendSuccess(res, sub, 'Warranty claim retrieved');
});

export const submitWarranty = asyncHandler(async (req: Request, res: Response) => {
  const sub = await FormsService.submitWarranty(req.body);
  sendCreated(res, sub, 'Warranty claim submitted');
});

export const updateWarrantyStatus = asyncHandler(async (req: Request, res: Response) => {
  const sub = await FormsService.updateWarrantyStatus(req.params.id, req.body.status);
  sendSuccess(res, sub, 'Status updated');
});

export const deleteWarranty = asyncHandler(async (req: Request, res: Response) => {
  await FormsService.deleteWarranty(req.params.id);
  sendNoContent(res);
});
