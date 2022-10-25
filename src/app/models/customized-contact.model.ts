export interface CustomContact {
  name?: {
    familyName?: string;
    formatted?: string;
    givenName?: string;
    firstName?: string;
    lastName?: string;
  };
  displayName?: string;
  numbers?: string[];
}
