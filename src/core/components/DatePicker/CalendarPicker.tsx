import * as React from "react";
import { FC } from "react";
import moment from "moment";
import { chunk, range } from "../../utils/array-utils";

// tslint:disable-next-line: variable-name
export const CalendarPicker: FC<CalendarProps> = ({
  value,
  timeOnly,
  dateOnly,
  onChange,
}) => {
  const [m, setMonth] = React.useState(() => value.clone());

  const today = moment();
  const d1 = m.clone().subtract(1, "month").endOf("month").date();
  const d2 = m.clone().date(1).day();
  const d3 = m.clone().endOf("month").date();
  const days = ([] as number[]).concat(
    range(d1 - d2 + 1, d1 + 1),
    range(1, d3 + 1),
    range(1, 42 - d3 - d2 + 1)
  );

  function onSelectDate(day: number, w: number) {
    const prevMonth = w === 0 && day > 7;
    const nextMonth = w >= 4 && day <= 14;
    const newVal = m.clone();

    if (prevMonth) {
      newVal.subtract(1, "month");
    }
    if (nextMonth) {
      newVal.add(1, "month");
    }

    newVal.date(day);

    setMonth(newVal);
    onChange(newVal);
  }

  function onTimeChange(newVal: moment.Moment) {
    setMonth(newVal);
    onChange(newVal);
  }

  return (
    <>
      {!timeOnly && <MonthSelector setMonth={setMonth} m={m} />}
      {!timeOnly && (
        <div
          className={`py-2 px-3 dark:border-gray-700 border-gray-300 ${
            !dateOnly ? "border-b" : ""
          }`}
        >
          <div className="grid grid-cols-7 justify-items-center gap-1">
            <div className="contents text-xs text-gray-400">
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
            </div>
            {chunk(days, 7).map((week, w) => (
              <div key={w} className="contents">
                {week.map((day, i) => (
                  <Day
                    day={day}
                    key={`${w}${i}`}
                    m={m}
                    w={w}
                    today={today}
                    value={value}
                    onClick={() => onSelectDate(day, w)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {!dateOnly && <TimeSelector onChange={onTimeChange} m={m} />}
    </>
  );
};

interface CalendarProps {
  value: moment.Moment;
  dateOnly: boolean | undefined;
  timeOnly: boolean | undefined;
  onChange: (newValue: moment.Moment) => void;
}

// tslint:disable-next-line: variable-name
const Day: FC<DayProps> = ({ day, w, m, value, today, onClick }) => {
  const prevMonth = w === 0 && day > 7;
  const nextMonth = w >= 4 && day <= 14;
  const thisDay = prevMonth
    ? m.clone().subtract(1, "month").date(day)
    : nextMonth
    ? m.clone().add(1, "month").date(day)
    : m.clone().date(day);
  const isCurrentValue = value.isSame(thisDay, "day");
  const isToday = today.isSame(thisDay, "day");

  return (
    <button
      className={
        "text-center rounded-full focus-visible:outline-black hover:text-white hover:bg-primary w-6 h-6 " +
        (prevMonth || nextMonth
          ? "text-gray-100"
          : isCurrentValue
          ? "text-white bg-primary"
          : isToday
          ? "text-red-700"
          : "text-primary")
      }
      onClick={onClick}
    >
      {day}
    </button>
  );
};

interface DayProps {
  day: number;
  m: moment.Moment;
  today: moment.Moment;
  value: moment.Moment;
  w: number;
  onClick: () => void;
}

////////////////////////////////////////////////////////////////
//      Calendar Range

// tslint:disable-next-line: variable-name
export const CalendarRangePicker: FC<CalendarRangeProps> = ({
  startDate,
  endDate: value,
  dateOnly,
  onChange,
}) => {
  const [m, setMonth] = React.useState(() => value.clone());

  const d1 = m.clone().subtract(1, "month").endOf("month").date();
  const d2 = m.clone().date(1).day();
  const d3 = m.clone().endOf("month").date();
  const days = ([] as number[]).concat(
    range(d1 - d2 + 1, d1 + 1),
    range(1, d3 + 1),
    range(1, 42 - d3 - d2 + 1)
  );

  function onSelectDate(day: number, w: number) {
    const prevMonth = w === 0 && day > 7;
    const nextMonth = w >= 4 && day <= 14;
    const newVal = m.clone();

    if (prevMonth) {
      newVal.subtract(1, "month");
    }
    if (nextMonth) {
      newVal.add(1, "month");
    }

    newVal.date(day);

    setMonth(newVal);
    onChange(newVal);
  }

  function onTimeChange(newVal: moment.Moment) {
    setMonth(newVal);
    onChange(newVal);
  }

  return (
    <>
      <MonthSelector setMonth={setMonth} m={m} />
      <div
        className={`overflow-hidden py-2 px-3 dark:border-gray-700 border-gray-300 ${
          !dateOnly ? "border-b" : ""
        }`}
      >
        <div className="grid grid-cols-7 justify-items-center gap-1">
          <div className="contents text-xs text-gray-400">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>
          {chunk(days, 7).map((week, w) => (
            <div key={w} className="contents">
              {week.map((day, i) => (
                <DayWhenRange
                  isLast={i === 6}
                  isFirst={i === 0}
                  day={day}
                  key={`${w}${i}`}
                  m={m}
                  startDate={startDate}
                  endDate={value}
                  w={w}
                  onClick={() => onSelectDate(day, w)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {!dateOnly && <TimeSelector onChange={onTimeChange} m={m} />}
    </>
  );
};

interface CalendarRangeProps {
  endDate: moment.Moment;
  startDate: moment.Moment;
  dateOnly: boolean | undefined;
  onChange: (newValue: moment.Moment) => void;
}

// tslint:disable-next-line: variable-name
const DayWhenRange: FC<DayWhenRangeProps> = ({
  day,
  w,
  m,
  isLast,
  isFirst,
  endDate,
  startDate,
  onClick,
}) => {
  const prevMonth = w === 0 && day > 7;
  const nextMonth = w >= 4 && day <= 14;
  const thisDay = prevMonth
    ? m.clone().subtract(1, "month").date(day)
    : nextMonth
    ? m.clone().add(1, "month").date(day)
    : m.clone().date(day);
  const isStartDate = startDate.isSame(thisDay, "day");
  const isEndDate = endDate.isSame(thisDay, "day");
  const isBetween =
    thisDay.isAfter(startDate) &&
    thisDay.isBefore(endDate) &&
    !isStartDate &&
    !isEndDate;

  return (
    <button
      className="w-full h-full flex items-center justify-center relative rounded-full focus-visible:outline-black"
      onClick={onClick}
    >
      {isBetween && (
        <div
          className={`bg-primary/20 absolute z-0 h-6 ${
            isLast
              ? "-right-4 -left-0.5"
              : isFirst
              ? "-right-0.5 -left-4"
              : "-right-0.5 -left-0.5"
          }`}
        />
      )}
      {isStartDate && (
        <div className="bg-primary/20 absolute z-0 h-6 -right-0.5 left-1/2" />
      )}
      {isEndDate && (
        <div className="bg-primary/20 absolute z-0 h-6 right-1/2 -left-0.5" />
      )}
      <span
        className={
          "relative flex items-center justify-center z-10 hover:text-white hover:bg-primary w-6 h-6 rounded-full " +
          (isBetween
            ? "text-primary"
            : isStartDate || isEndDate
            ? "text-white bg-primary"
            : prevMonth || nextMonth
            ? "text-gray-100"
            : "text-gray-400")
        }
      >
        {day}
      </span>
    </button>
  );
};

interface DayWhenRangeProps {
  day: number;
  m: moment.Moment;
  startDate: moment.Moment;
  endDate: moment.Moment;
  w: number;
  isLast: boolean;
  isFirst: boolean;
  onClick: () => void;
}

////////////////////////////////////////////////////////////////
//      Utilities

// tslint:disable-next-line: variable-name
const MonthSelector: FC<{
  m: moment.Moment;
  setMonth: (a: moment.Moment) => void;
}> = ({ setMonth, m }) => {
  function showPrevMonth() {
    setMonth(m.clone().subtract(1, "month"));
  }

  function showNextMonth() {
    setMonth(m.clone().add(1, "month"));
  }

  return (
    <div className="flex justify-between py-2 border-b dark:border-gray-700 border-gray-300 text-gray-400">
      <button
        onClick={showPrevMonth}
        className="outline-none focus-visible:outline-black"
      >
        <i className="px-4 fas fa-caret-left text-primary" />
      </button>
      {m.format("MMMM YYYY")}
      <button
        onClick={showNextMonth}
        className="outline-none focus-visible:outline-black"
      >
        <i className="px-4 fas fa-caret-right text-primary" />
      </button>
    </div>
  );
};

// tslint:disable-next-line: variable-name
const TimeSelector: FC<{
  m: moment.Moment;
  onChange: (val: moment.Moment) => void;
}> = ({ m, onChange }) => {
  function setHours(hour: number) {
    const newVal = m.clone();
    newVal.hours(hour);
    onChange(newVal);
  }

  function setMinutes(minutes: number) {
    const newVal = m.clone();
    newVal.minutes(minutes);
    onChange(newVal);
  }

  return (
    <div className="py-2 flex justify-center items-center text-gray-400">
      <ValueSelector
        className="w-8 mr-3"
        onUp={() =>
          setHours(((m.hours() + 1) % 12) + (m.hours() >= 12 ? 12 : 0))
        }
        onDown={() =>
          setHours(((m.hours() + 11) % 12) + (m.hours() >= 12 ? 12 : 0))
        }
      >
        {m.format("h")}
      </ValueSelector>
      <div>:</div>
      <ValueSelector
        className="w-8 mx-3"
        onUp={() => setMinutes((m.minute() + 1) % 60)}
        onDown={() => setMinutes((m.minute() + 59) % 60)}
      >
        {m.format("mm")}
      </ValueSelector>
      <ValueSelector
        className="w-8 ml-8"
        onUp={() => setHours((m.hours() + 12) % 24)}
        onDown={() => setHours((m.hours() + 12) % 24)}
      >
        {m.format("A")}
      </ValueSelector>
    </div>
  );
};

// tslint:disable-next-line: variable-name
const ValueSelector: FC<ValueSelectorProps> = ({
  className,
  children,
  onUp,
  onDown,
}) => (
  <div className={`flex flex-col items-center ${className ?? ""}`}>
    <button onClick={onUp} className="outline-none focus-visible:outline-black">
      <i className="text-primary fas fa-caret-up" />
    </button>
    <div>{children}</div>
    <button
      onClick={onDown}
      className="outline-none focus-visible:outline-black"
    >
      <i className="text-primary fas fa-caret-down" />
    </button>
  </div>
);

interface ValueSelectorProps {
  className?: string;
  onUp: () => void;
  onDown: () => void;
}
