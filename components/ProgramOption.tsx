import React from 'react';
import { ScheduleRecordObj } from '../helpers/airtable';
import { getFullLocalizedDate } from '../helpers/string';
import { getTimeRange, timeFromNowIfSoon } from '../helpers/time';

const cutoffValueForHighlightingRelativeTime = 24;
const cutoffUnitForHighlightingRelativeTime = 'hour'; // https://day.js.org/docs/en/display/difference

function RelativeTime({ startDateTime }: { startDateTime: string }): JSX.Element {
  const relativeTime = timeFromNowIfSoon(startDateTime, cutoffValueForHighlightingRelativeTime, cutoffUnitForHighlightingRelativeTime);
  const result = relativeTime ? (
    <>
      {' '}
      <div className="startsSoon">Starts {relativeTime}</div>
    </>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
  return result;
}

export interface ProgramOptionProps {
  scheduleRecord: ScheduleRecordObj;
  checked?: boolean;
}

function SessionDetails({ scheduleRecord, checked }: ProgramOptionProps) {
  const startLocalDateTime = new Date(scheduleRecord.start);
  const fullLocalizedDate = getFullLocalizedDate(startLocalDateTime);
  const timeRange = getTimeRange(startLocalDateTime, scheduleRecord.duration);
  const isInteractive = checked !== undefined;
  return (
    <div className={`row sessionRow ${isInteractive ? '' : 'rounded-3 mb-2 p-2'}`}>
      <div className="col-md-6" style={{ borderLeftColor: `${scheduleRecord.colorCode}!important` }}>
        <div className={`sessionTitle ${checked ? 'fw-bold' : ''}`}>{scheduleRecord.programName}</div>

        <div className="text-muted">
          <small>{scheduleRecord.description}</small>
        </div>
      </div>
      <div className="col-md-6">
        <div
          data-utc={startLocalDateTime.toUTCString()}
          data-iso={startLocalDateTime.toISOString()}
          style={{ backgroundImage: 'url(/img/calendar-icon.svg)', backgroundRepeat: 'no-repeat', paddingLeft: '2rem' }}
        >
          <strong>{fullLocalizedDate}</strong>
          <RelativeTime startDateTime={scheduleRecord.start} />
        </div>
        <div className="mt-3" style={{ backgroundImage: 'url(/img/clock-icon.svg)', backgroundRepeat: 'no-repeat', paddingLeft: '2rem', fontWeight: 'bold!important' }}>
          {timeRange}
        </div>
      </div>
    </div>
  );
}

SessionDetails.defaultProps = {
  checked: undefined,
};

export default function ProgramOption({ scheduleRecord, checked }: ProgramOptionProps) {
  const isInteractive = checked !== undefined; // Only if the `checked` prop exists and is not null will this component include the label and input element.
  const boldBorder = checked ? 'border-2' : '';
  if (isInteractive) {
    return (
      <label className={`${boldBorder} rounded-3 mb-2 d-flex align-items-center align-content-center`} role={checked ? '' : 'button'}>
        <input
          type="checkbox"
          name="scheduleId"
          value={scheduleRecord.id}
          className="ms-2 me-2"
          data-json={JSON.stringify(scheduleRecord)}
          defaultChecked={checked}
          disabled={checked}
        />
        <SessionDetails scheduleRecord={scheduleRecord} checked={checked} />
      </label>
    );
  }
  return <SessionDetails scheduleRecord={scheduleRecord} checked={checked} />;
}

ProgramOption.defaultProps = {
  checked: undefined,
};
