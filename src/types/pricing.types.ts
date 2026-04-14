export interface IPricingRule {
  _id:            string;
  modelId:        string;
  modelName:      string;
  brandName:      string;
  repairTypeId:   string;
  repairTypeName: string;
  category:       string;
  price:          number;
  originalPrice?: number;
  isActive:       boolean;
  createdAt:      Date;
  updatedAt:      Date;
}

export interface CreatePricingRuleDTO {
  modelId:        string;
  repairTypeId:   string;
  price:          number;
  originalPrice?: number;
  isActive?:      boolean;
}
