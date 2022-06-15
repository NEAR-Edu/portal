import React from 'react';
import { ScheduleRecordObj } from '../helpers/airtable';
import { getShortLocalizedDate } from '../helpers/string';
import { timeFromNowIfSoon } from '../helpers/time';

const cutoffValueForHighlightingRelativeTime = 24;
const cutoffUnitForHighlightingRelativeTime = 'hour'; // https://day.js.org/docs/en/display/difference

function RelativeTime({ startDateTime }: { startDateTime: string }): JSX.Element {
  const relativeTime = timeFromNowIfSoon(startDateTime, cutoffValueForHighlightingRelativeTime, cutoffUnitForHighlightingRelativeTime);
  const result = relativeTime ? (
    <>
      {' '}
      <span style={{ background: 'yellow' }}>({relativeTime})</span>
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
  const startLocal = getShortLocalizedDate(startLocalDateTime);
  const isInteractive = checked !== undefined;
  return (
    <div className={`d-inline-block ${isInteractive ? '' : 'd-block border border-secondary rounded-3 mb-2 p-2'}`}>
      <div className={checked ? 'fw-bold' : ''}>
        {scheduleRecord.programName}
        <span className="text-muted ms-2">({scheduleRecord.duration})</span>
      </div>
      <div className="text-muted" data-utc={startLocalDateTime.toUTCString()} data-iso={startLocalDateTime.toISOString()}>
        <small>
          {startLocal}
          <RelativeTime startDateTime={scheduleRecord.start} />
        </small>
      </div>
      <div className="text-muted">
        <small>{scheduleRecord.description}</small>
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
  return (
    <div>
      {isInteractive && (
        <label className={`border border-secondary ${boldBorder} rounded-3 mb-2 d-flex align-items-center align-content-center`} role={checked ? '' : 'button'}>
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
      )}
      {!isInteractive && <SessionDetails scheduleRecord={scheduleRecord} checked={checked} />}
    </div>
  );
}

ProgramOption.defaultProps = {
  checked: undefined,
};
