export type CustomerStatus = 'active' | 'inactive' | 'banned';

export interface ICustomerAddress {
  line1:    string;
  line2?:   string;
  city:     string;
  county?:  string;
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
