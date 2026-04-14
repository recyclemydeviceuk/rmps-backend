import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { BrandsService } from '../services/brands.service';

export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await BrandsService.getAll(req.query);
  sendSuccess(res, brands, 'Brands retrieved');
});

export const getBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await BrandsService.getById(req.params.id);
  sendSuccess(res, brand, 'Brand retrieved');
});

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await BrandsService.create(req.body);
  sendCreated(res, brand, 'Brand created');
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await BrandsService.update(req.params.id, req.body);
  sendSuccess(res, brand, 'Brand updated');
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  await BrandsService.delete(req.params.id);
  sendNoContent(res);
});
