export type NewsletterSource = 'footer' | 'popup' | 'page';
export type NewsletterStatus = 'active' | 'unsubscribed';
export type ContactStatus    = 'new' | 'read' | 'replied';
export type WarrantyStatus   = 'pending' | 'approved' | 'rejected' | 'resolved';

export interface INewsletterSubmission {
  _id:           string;
  email:         string;
  source:        NewsletterSource;
  status:        NewsletterStatus;
  subscribedAt:  Date;
}

export interface IContactSubmission {
  _id:         string;
  name:        string;
  phone:       string;
  email:       string;
  message:     string;
  status:      ContactStatus;
  submittedAt: Date;
}

export interface IWarrantySubmission {
  _id:              string;
  name:             string;
  email:            string;
  deviceBrand:      string;
  deviceModel:      string;
  claimInfo:        string;
  orderReference?:  string;
  status:           WarrantyStatus;
  submittedAt:      Date;
}
