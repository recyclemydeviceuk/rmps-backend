export type CustomerStatus = 'active' | 'inactive' | 'banned';

export interface ICustomerAddress {
  street:   string;
  city:     string;
  postcode: string;
  country:  string;
}

export interface ICustomer {
  _id:             string;
  name:            string;
  email:           string;
  phone:           string;
  status:          CustomerStatus;
  address?:        ICustomerAddress;
  totalOrders:     number;
  totalSpent:      number;
  lastOrderDate?:  Date;
  createdAt:       Date;
  updatedAt:       Date;
}
