import React, { useState } from 'react';
import { toast } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/
import { ScheduleRecordObj } from '../helpers/airtable';
import { getFullLocalizedDate } from '../helpers/string';
import { getTimeRange, timeFromNowIfSoon } from '../helpers/time';

const cutoffValueForHighlightingRelativeTime = 24;
const cutoffUnitForHighlightingRelativeTime = 'hour'; // https://day.js.org/docs/en/display/difference
const statusSuccess = 200;
const toastAutoCloseMs = 10000; // https://fkhadra.github.io/react-toastify/autoClose/

function RelativeTime({ startDateTime }: { startDateTime: string }): JSX.Element {
  const relativeTime = timeFromNowIfSoon(startDateTime, cutoffValueForHighlightingRelativeTime, cutoffUnitForHighlightingRelativeTime);
  if (relativeTime) {
    return (
      <>
        {' '}
        <div className="startsSoon">Starts {relativeTime}</div>
      </>
    );
  } else {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
}

export interface ProgramOptionProps {
  scheduleRecord: ScheduleRecordObj;
  isAlreadyEnrolled?: boolean;
  csrfToken?: string;
}

// eslint-disable-next-line max-lines-per-function
export default function ProgramOption({ scheduleRecord, isAlreadyEnrolled, csrfToken }: ProgramOptionProps) {
  const [isAlreadyEnrolledState, setIsAlreadyEnrolledState] = useState<boolean>(Boolean(isAlreadyEnrolled));
  const isInteractive = isAlreadyEnrolled !== undefined; // Only if the `isAlreadyEnrolled` prop exists and is not null will this component include the button and hidden field.

  const startLocalDateTime = new Date(scheduleRecord.start);
  const fullLocalizedDate = getFullLocalizedDate(startLocalDateTime);
  const timeRange = getTimeRange(startLocalDateTime, scheduleRecord.duration);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries()); // https://stackoverflow.com/a/68423069/470749
    const payload = { csrfToken, ...formObject };
    console.log({ event, formData, payload });
    const result = await fetch('/api/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (result.status === statusSuccess) {
      console.log({ result });
      setIsAlreadyEnrolledState(true);
      toast('Enrolled successfully! You will receive a confirmation email.', { type: 'success', autoClose: toastAutoCloseMs }); // https://fkhadra.github.io/react-toastify/icons/#built-in-icons
    }
  }

  return (
    <div className={`row sessionRow ${isInteractive ? '' : 'rounded-3 mb-2 p-2'}`}>
      <div className="col-md-6" style={{ borderLeftColor: `${scheduleRecord.colorCode}!important` }}>
        <div className={`sessionTitle ${isAlreadyEnrolled ? 'fw-bold' : ''}`}>{scheduleRecord.programName}</div>

        <div className="text-muted">
          <small>{scheduleRecord.description}</small>
        </div>
      </div>
      <div className={isInteractive ? 'col-md-5' : 'col-md-6'}>
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
      {isInteractive && (
        <div className="col-md-1">
          <form className="rounded-3 mb-2 d-flex align-items-center align-content-center" role={isAlreadyEnrolled ? '' : 'button'} onSubmit={onSubmit}>
            <input type="hidden" name="scheduleId" value={scheduleRecord.id} className="ms-2 me-2" data-json={JSON.stringify(scheduleRecord)} disabled={isAlreadyEnrolledState} />
            {isAlreadyEnrolledState && (
              <button type="submit" className="btn enrollBtn disabledEnrollBtn" disabled>
                Enrolled
              </button>
            )}
            {!isAlreadyEnrolledState && (
              <button type="submit" className="btn enrollBtn">
                Enroll
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

ProgramOption.defaultProps = {
  isAlreadyEnrolled: undefined,
  csrfToken: '',
};
