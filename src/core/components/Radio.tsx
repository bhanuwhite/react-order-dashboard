import * as React from "react";
import { newIdGenerator } from "../utils/uniqueId";

// tslint:disable-next-line: variable-name
export function Radio<T extends string, U extends T>({
  className,
  name,
  current,
  value,
  required,
  disabled,
  onChange,
}: Props<T, U>) {
  const [id] = React.useState(newId);

  return (
    <span
      className={`relative inline-block h-6 w-6 align-bottom ${
        className ?? ""
      }`}
    >
      <input
        type="radio"
        value={value}
        id={id}
        className="absolute peer inset-0 opacity-0 w-full h-full cursor-pointer"
        checked={current === value}
        required={required}
        name={name}
        disabled={disabled}
        onChange={() => onChange(value)}
      />
      <div className={computeClassName(disabled)}>
        {value === current && (
          <div
            className={`rounded-full h-2.5 w-2.5 ${
              disabled ? "bg-gray-400" : "bg-primary"
            }`}
          />
        )}
        {value !== current && !disabled && (
          <div className="rounded-full h-2.5 w-2.5 group-hover:bg-gray-400/25" />
        )}
      </div>
    </span>
  );
}

interface Props<T extends string, U extends T> {
  /** Additional CSS classes */
  className?: string;
  /** Wheter this input is required (for forms) */
  required?: boolean;
  /** Whether this options is disabled or not */
  disabled?: boolean;
  /** Radio group this radio belongs to */
  name: string;
  /** Current value */
  current: T;
  /** Only value that this Radio holds */
  value: U;
  /** When the value change we'll set it to newValue */
  onChange: (newValue: U) => void;
}

function computeClassName(disabled: boolean | undefined): string {
  let className =
    "flex w-full absolute h-full items-center justify-center group cursor-pointer " +
    "peer-focus-visible:outline-black bg-white peer-checked:bg-primary-light/10 " +
    "rounded-full border border-solid";

  if (disabled) {
    className += " bg-gray-100/75 border-gray-200";
  } else {
    className +=
      " group-hover:bg-primary-light/10 hover:bg-primary-light/10 border-primary";
  }
  return className;
}

// Created separate function to avoid creating new closures
// on every render.
const newId = newIdGenerator("radio");
