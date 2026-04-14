export type AddonCategory = 'protection' | 'warranty' | 'delivery' | 'accessory';

export interface IAddon {
  _id:          string;
  name:         string;
  description:  string;
  category:     AddonCategory;
  price:        number;
  isActive:     boolean;
  isRequired:   boolean;
  imageUrl?:    string;
  sortOrder:    number;
  createdAt:    Date;
  updatedAt:    Date;
}
