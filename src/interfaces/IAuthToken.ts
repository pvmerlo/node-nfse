import { DateTime } from 'luxon';

export interface IAuthToken {
  lastRequest: DateTime;
  token: string;
}
