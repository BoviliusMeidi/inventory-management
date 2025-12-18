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
