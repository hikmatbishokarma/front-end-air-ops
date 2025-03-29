export interface IaircraftCategory {
  id: string;
  name: string;
}

export interface Iaircraft {
  id: string;
  name: string;
  code: string;
  category: IaircraftCategory;
}

export interface Iclient {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  isCompany: boolean;
  isPerson: boolean;
}

export interface Irepresentative {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Isepcification {
  title: string;
  value: string;
}
