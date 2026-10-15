import type { ContactDetails } from "@/lib/AI/schemas";

export const EMPTY_CONTACT_DETAILS: ContactDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
};


export interface DisplayContact {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function toDisplayContact(contact: ContactDetails): DisplayContact {
  return {
    name: `${contact.firstName} ${contact.lastName}`.trim(),
    email: contact.email.trim(),
    phone: contact.phone.trim(),
    address: contact.location.trim(),
  };
}