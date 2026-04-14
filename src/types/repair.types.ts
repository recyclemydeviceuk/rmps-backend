export type RepairCategory =
  | 'screen'
  | 'battery'
  | 'camera'
  | 'back_glass'
  | 'charging_port'
  | 'speaker'
  | 'other';

export interface IRepairType {
  _id:          string;
  name:         string;
  slug:         string;
  category:     RepairCategory;
  description?: string;
  imageUrl?:    string;
  isActive:     boolean;
  createdAt:    Date;
  updatedAt:    Date;
}
