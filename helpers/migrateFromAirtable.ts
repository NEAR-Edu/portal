/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { User } from '.prisma/client';
import { Registration } from '@prisma/client';
import { FieldSet, Record } from 'airtable';
import { SortParameter } from 'airtable/lib/query_params';
import { getAllPages, getFirstElement, getFirstPage } from './airtable';

// https://airtable.com/appncY8IjPHkOVapz/tblFBQY4popYmxfkh?blocks=hide

type UserAndReg = { user: User; registration: Registration };

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
  user.whyJoin = record.get('interest') as string;
  user.discordAccount = record.get('discord') as string;
  // TODO: Handle missing fields. See schema.prisma.

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
  const registrations = await getFirstPage<UserAndReg>('nc-registrations', getAirtableRegistrationRecordAsUserAndRegistration); // TODO: Use instead: // const registrations = await getRegistrationsFromAllPages();
  // console.log({ registrations });

  // TODO: For each, create a User, then create a Registration (using that userId);
  return JSON.parse(JSON.stringify(registrations));
}
