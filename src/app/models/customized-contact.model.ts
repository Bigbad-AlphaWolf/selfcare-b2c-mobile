export interface CustomContact {
  name?: {
    familyName?: string;
    formatted?: string;
    givenName?: string;
  };
  numbers?: string[];
}
