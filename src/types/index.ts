export interface Fraction {
  name: string;
  gost: string;
  packaging: string;
  description: string;
}

export interface ApplicationArea {
  id: number;
  name: string;
  description: string;
  fractions: Fraction[];
}

export interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}
