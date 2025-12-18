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
