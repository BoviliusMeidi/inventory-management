// -----------------------------------------------------------------------------------------------------------------------------
// COMMON
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents the outcome of a form submission or server action.
 */
export type FormState = {
  /** Indicates whether the form submission was successful. */
  success: boolean;
  /** A feedback message to be displayed to the user. */
  message: string;
};

// -----------------------------------------------------------------------------------------------------------------------------
// USERS
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a registered user in the system.
 */
export interface User {
  /** The unique identifier for the user (UUID). */
  id: string;
  /** The user's email address. */
  email: string;
  /** The user's full display name. */
  name: string;
  /** The public URL of the user's profile picture. */
  profile_picture: string | null;
  /** Timestamp when the user was created (ISO string). */
  created_at?: string;
  /** Timestamp when the user was last updated (ISO string). */
  updated_at?: string;
}

// -----------------------------------------------------------------------------------------------------------------------------
// SUPPLIERS
// -----------------------------------------------------------------------------------------------------------------------------

/**
 * Represents a full supplier record in the system.
 */
export interface Supplier {
  /** The unique identifier for the supplier (UUID). */
  id: string;
  /** The business name of the supplier. */
  supplier_name: string;
  /** The physical address of the supplier. */
  address: string;
  /** The primary contact number for the supplier. */
  contact_number: number;
  /** A link used for making purchases (e.g., website URL). */
  purchase_link: string;
  /** The ID of the user who created/owns this supplier record. */
  user_id: string;
}
