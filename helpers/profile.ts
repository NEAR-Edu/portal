/* eslint-disable import/prefer-default-export */

import { DefaultSession } from 'next-auth';
import { getLoggedInUser } from './user';

export async function isProfileComplete(session: DefaultSession): Promise<boolean> {
  const user = await getLoggedInUser(session);
  return Boolean(user.country) && Boolean(user.name) && Boolean(user.timeZone) && Boolean(user.softwareDevelopmentExperience) && Boolean(user.testnetAccount); // ONEDAY: Check all of the required fields.
}
