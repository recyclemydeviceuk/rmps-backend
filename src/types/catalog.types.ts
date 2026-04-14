// ── Device Type ──────────────────────────────────────────────
export interface IDeviceType {
  _id:        string;
  name:       string;
  slug:       string;
  imageUrl?:  string;
  brandCount: number;
  isActive:   boolean;
  createdAt:  Date;
  updatedAt:  Date;
}

// ── Brand ────────────────────────────────────────────────────
export interface IBrand {
  _id:                string;
  deviceTypeId:       string;
  deviceTypeName:     string;
  name:               string;
  slug:               string;
  logoUrl?:           string;
  showcaseImageUrl?:  string;
  modelCount:         number;
  isActive:           boolean;
  createdAt:          Date;
  updatedAt:          Date;
}

// ── Series ───────────────────────────────────────────────────
export interface ISeries {
  _id:        string;
  brandId:    string;
  brandName:  string;
  name:       string;
  slug:       string;
  modelCount: number;
  isActive:   boolean;
  createdAt:  Date;
  updatedAt:  Date;
}

// ── Device Model ─────────────────────────────────────────────
export interface IDeviceModel {
  _id:            string;
  deviceTypeId:   string;
  deviceTypeName: string;
  brandId:        string;
  brandName:      string;
  seriesId?:      string;
  seriesName?:    string;
  name:           string;
  slug:           string;
  imageUrl?:      string;
  repairCount:    number;
  releaseYear?:   number;
  isActive:       boolean;
  createdAt:      Date;
  updatedAt:      Date;
}
