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

const defaultProps = {
  checked: null,
};

type DefaultProps = Partial<typeof defaultProps>; // https://stackoverflow.com/a/63358555/470749

type ProgramOptionProps = {
  scheduleRecord: ScheduleRecordObj;
} & DefaultProps;

function MainPart({ scheduleRecord, checked }: ProgramOptionProps) {
  const startLocalDateTime = new Date(scheduleRecord.start);
  const startLocal = getShortLocalizedDate(startLocalDateTime);
  return (
    <div className="d-inline-block">
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

export default function ProgramOption({ scheduleRecord, checked = null }: ProgramOptionProps) {
  const isInteractive = checked !== null; // Only if the `checked` prop exists and is not null will this component include the label and input element.
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
          <MainPart scheduleRecord={scheduleRecord} checked={checked} />
        </label>
      )}
      {!isInteractive && <MainPart scheduleRecord={scheduleRecord} checked={checked} />}
    </div>
  );
}
