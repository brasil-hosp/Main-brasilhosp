export type UserType = 'PF' | 'PJ' | 'ADMIN';

export interface Profile {
  id: string;
  full_name: string;
  user_type: UserType;
  document: string;
  email?: string;
  phone: string;
  is_verified: boolean;
  created_at: string;
  // PJ fields
  legal_nature?: string;
  municipal_inscription?: string;
  company_name?: string;
  fantasy_name?: string;
  ie?: string;
  financial_contact_name?: string;
  financial_contact_phone?: string;
  financial_contact_email?: string;
  // Document URLs
  cnpj_card_url?: string;
  qsa_url?: string;
  social_contract_url?: string;
  operating_permit_url?: string;
  sanitary_medication_url?: string;
  sanitary_cosmetics_url?: string;
  sanitary_health_url?: string;
  sanitary_sanitizing_url?: string;
  // PF fields
  rg_url?: string;
  address_proof_url?: string;
  // Address
  cep?: string;
  address?: string;
  address_number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  complement?: string;
}
