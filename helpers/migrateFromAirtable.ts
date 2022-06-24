/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { User } from '.prisma/client';
import { PrismaClient, Registration } from '@prisma/client';
import { FieldSet, Record } from 'airtable';
import { SortParameter } from 'airtable/lib/query_params';
import { getAllPages, getFirstElement, getFirstPage } from './airtable';

// https://airtable.com/appncY8IjPHkOVapz/tblFBQY4popYmxfkh?blocks=hide

type UserAndReg = { user: User; registration: Registration };

function getLeadSource(record: Record<FieldSet>): string {
  let result = record.get('leadgen') as string;
  const leadgenName = record.get('leadgen_name') as string;
  if (leadgenName) {
    result = `${result}: ${leadgenName}`;
  }
  return result;
}

function getDiscordAccount(record: Record<FieldSet>): string | null {
  let discordAccount: string | null = record.get('discord') as string;
  discordAccount = discordAccount.trim();
  if (discordAccount === 'Nil') {
    discordAccount = null;
  }
  return discordAccount;
}

function getAirtableRegistrationRecordAsUserAndRegistration(record: Record<FieldSet>): UserAndReg {
  // See mappings of important fields in schema at https://airtable.com/appncY8IjPHkOVapz/tblFBQY4popYmxfkh/viwgxFeJIGB50pkvj?blocks=bliXY0KOJ1NiLAKFw
  // console.log({ record });
  const user = {} as User;
  user.id = record.getId();
  user.name = record.get('name') as string;
  user.email = record.get('email') as string;
  user.country = record.get('country') as string;
  user.timeZone = record.get('timezone') as string;
  user.softwareDevelopmentExperience = record.get('experience') as string;
  user.whyJoin = JSON.stringify(record.get('interest')) as string;
  user.leadSource = getLeadSource(record);
  user.referrerMainnetAccount = record.get('referral_account') as string;
  user.testnetAccount = record.get('testnet') as string;
  user.mainnetAccount = record.get('mainnet') as string;
  user.discordAccount = getDiscordAccount(record);
  // TODO: Handle missing fields (frameworksAndPlatforms, frameworksAndPlatforms, OS, etc). See schema.prisma.

  const registration = {} as Registration;
  const schedule = getFirstElement(record, 'schedule');
  registration.scheduleId = schedule as string;
  return { user, registration };
}

async function getRegistrationsFromAllPages(): Promise<UserAndReg[]> {
  const table = 'nc-registrations';
  const sort: SortParameter<FieldSet>[] = [
    //  { field: 'start datetime', direction: 'asc' }
  ];
  return getAllPages<UserAndReg>(table, getAirtableRegistrationRecordAsUserAndRegistration, '', sort);
}

export async function migrate() {
  const prisma = new PrismaClient();
  const userRegCombos = await getFirstPage<UserAndReg>('nc-registrations', getAirtableRegistrationRecordAsUserAndRegistration); // TODO: Use instead: // const registrations = await getRegistrationsFromAllPages();
  // console.log({ registrations });

  // TODO: For each, create a User, then create a Registration (using that userId);
  userRegCombos.forEach(async (userRegCombo: UserAndReg) => {
    const data = userRegCombo.user;
    const userResult = await prisma.user.create({ data });
    const regData: Registration = userRegCombo.registration;
    regData.userId = userResult.id;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const registrationResult = await prisma.registration.create({ data: regData });
  });
  return JSON.parse(JSON.stringify(userRegCombos));
}
