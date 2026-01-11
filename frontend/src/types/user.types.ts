export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  companyId: string;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  admins: string[];           // array of UIDs
  customPhases: string[];     // additional phase names
  createdAt: Date;
}