import Airtable, { FieldSet, Record } from 'airtable';
import { SortParameter } from 'airtable/lib/query_params';
import 'dotenv/config';

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';

export const filterToFuture = 'IS_AFTER({start datetime}, TODAY())';
export const sortAscByDate: SortParameter<FieldSet>[] = [{ field: 'start datetime', direction: 'asc' }];

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export type ScheduleRecordObj = {
  id: string;
  event: string;
  start: string;
  duration: string;
  description: string;
  programId: string;
  programName: string;
  link: string;
  sessionUrl: string;
  slidoId: string;
};

function getFirstElement(record: Record<FieldSet>, key: string): string {
  const arr = record.get(key) as ReadonlyArray<string>;
  return arr[0];
}

function getScheduleRecordAsObj(record: Record<FieldSet>): ScheduleRecordObj {
  // See mappings of important fields in schema at https://airtable.com/appncY8IjPHkOVapz/tblFBQY4popYmxfkh/viwgxFeJIGB50pkvj?blocks=bliXY0KOJ1NiLAKFw
  // console.log({ record });
  const obj = {} as ScheduleRecordObj;
  obj.id = record.getId();
  obj.event = record.get('label') as string;
  // obj['start datetime'] = record.get('start datetime');
  // obj.start = record.get('start');
  obj.start = record.get('start datetime') as string;
  obj.duration = record.get('duration') as string;
  obj.description = getFirstElement(record, 'description (from program)');
  // obj.startLocalized = new Date(obj.start).toString();
  obj.programId = getFirstElement(record, 'program');
  obj.programName = getFirstElement(record, 'program name');
  obj.link = getFirstElement(record, 'link'); // landing page URL, stored in "landing" field of nc-programs table.
  obj.sessionUrl = (record.get('sessionUrl') as string) ?? null; // e.g. for Zoom
  obj.slidoId = (record.get('slidoId') as string) ?? null;
  return obj;
}

export async function getScheduleRecordsFromAllPages(filterByFormula = filterToFuture, sort = sortAscByDate): Promise<ScheduleRecordObj[]> {
  let pageNum = 1;
  let allRecords: Record<FieldSet>[] = [];
  return new Promise((resolve, reject) => {
    base('nc-schedule')
      .select({
        // https://airtable.com/appncY8IjPHkOVapz/tblAQvNRZbf8Nz4ot/viw4v5iOEpxNfsEhm?blocks=hide
        // maxRecords: 3,
        // view: "all"
        filterByFormula, // https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference#date_and_time_functions
        sort,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
          console.log({ pageNum });

          allRecords = [...allRecords, ...records];

          pageNum += 1;
          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            reject();
            return;
          }

          const result = allRecords.map((record) => {
            return getScheduleRecordAsObj(record);
          });

          resolve(result);
        },
      );
  });
}

export async function getFutureScheduleRecordsMappedById(): Promise<{ [id: string]: ScheduleRecordObj }> {
  const result: { [id: string]: ScheduleRecordObj } = {};
  const scheduleRecords = await getScheduleRecordsFromAllPages(filterToFuture, sortAscByDate);
  scheduleRecords.forEach((record) => {
    result[record.id] = record;
  });
  return result;
}
