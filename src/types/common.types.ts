import { Types } from 'mongoose';

export type MongoId = Types.ObjectId | string;

export interface TimestampFields {
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  data:       T[];
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
}
