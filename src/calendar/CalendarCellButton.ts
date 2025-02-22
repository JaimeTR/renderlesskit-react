/**
 * All credit goes to [React Spectrum](https://github.com/adobe/react-spectrum)
 * We improved the Calendar from Aria [useCalendarBase](https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/calendar/src/useCalendarBase.ts)
 * to work with Reakit System
 */
import * as React from "react";
import { callAllHandlers } from "@chakra-ui/utils";
import { useDateFormatter } from "@react-aria/i18n";
import { ensureFocus, useForkRef } from "reakit-utils";
import { createComponent, createHook } from "reakit-system";
import { ButtonHTMLProps, ButtonOptions, useButton } from "reakit";

import { isInvalidDateRange, isSameDay } from "../utils";
import { CALENDAR_CELL_BUTTON_KEYS } from "./__keys";
import { CalendarStateReturn } from "./CalendarState";
import { RangeCalendarStateReturn } from "./RangeCalendarState";

export const useCalendarCellButton = createHook<
  CalendarCellButtonOptions,
  CalendarCellButtonHTMLProps
>({
  name: "CalendarCellButton",
  compose: useButton,
  keys: CALENDAR_CELL_BUTTON_KEYS,

  useOptions(options, { disabled }) {
    const {
      isDisabled: isDisabledOption,
      date,
      month,
      minDate,
      maxDate,
    } = options;
    const isCurrentMonth = date.getMonth() === month;
    const isDisabled =
      isDisabledOption ||
      !isCurrentMonth ||
      isInvalidDateRange(date, minDate, maxDate);
    const truelyDisabled = disabled || isDisabled;

    return { disabled: truelyDisabled, ...options };
  },

  useProps(
    options,
    { onFocus: htmlOnFocus, onClick: htmlOnClick, ref: htmlRef, ...htmlProps },
  ) {
    const {
      date,
      disabled,
      dateValue,
      selectDate,
      anchorDate,
      focusedDate,
      isDisabled,
      setFocusedDate,
      isFocused: isFocusedOption,
    } = options;

    const ref = React.useRef<HTMLElement>(null);
    const isSelected = dateValue ? isSameDay(date, dateValue) : false;
    const isFocused =
      isFocusedOption && focusedDate && isSameDay(date, focusedDate);
    const isToday = isSameDay(date, new Date());

    // Focus the button in the DOM when the state updates.
    React.useEffect(() => {
      if (isFocused && ref.current) {
        ensureFocus(ref.current);
      }
    }, [date, focusedDate, isFocused, ref]);

    const onClick = React.useCallback(() => {
      if (disabled) return;

      selectDate(date);
      setFocusedDate(date);
    }, [date, disabled, selectDate, setFocusedDate]);

    const onFocus = React.useCallback(() => {
      if (disabled) return;

      setFocusedDate(date);
    }, [date, disabled, setFocusedDate]);

    const dateFormatter = useDateFormatter({
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // aria-label should be localize Day of week, Month, Day and Year without Time.
    function getAriaLabel() {
      let ariaLabel = dateFormatter.format(date);
      const isTodayLabel = isToday ? "Today, " : "";
      const isSelctedLabel = isSelected ? " selected" : "";
      ariaLabel = `${isTodayLabel}${ariaLabel}${isSelctedLabel}`;

      // When a cell is focused and this is a range calendar, add a prompt to help
      // screenreader users know that they are in a range selection mode.
      if (options.isRangeCalendar && isFocused && !isDisabled) {
        let rangeSelectionPrompt = "";

        // If selection has started add "click to finish selecting range"
        if (anchorDate) {
          rangeSelectionPrompt = "click to finish selecting range";
          // Otherwise, add "click to start selecting range" prompt
        } else {
          rangeSelectionPrompt = "click to start selecting range";
        }

        // Append to aria-label
        if (rangeSelectionPrompt) {
          ariaLabel = `${ariaLabel} (${rangeSelectionPrompt})`;
        }
      }

      return ariaLabel;
    }

    return {
      children: useDateFormatter({ day: "numeric" }).format(date),
      "aria-label": getAriaLabel(),
      tabIndex: !disabled ? (isSameDay(date, focusedDate) ? 0 : -1) : undefined,
      ref: useForkRef(ref, htmlRef),
      onClick: callAllHandlers(htmlOnClick, onClick),
      onFocus: callAllHandlers(htmlOnFocus, onFocus),
      ...htmlProps,
    };
  },
});

export const CalendarCellButton = createComponent({
  as: "span",
  memo: true,
  useHook: useCalendarCellButton,
});

export type CalendarCellButtonOptions = ButtonOptions &
  Partial<Pick<RangeCalendarStateReturn, "anchorDate">> &
  Pick<
    CalendarStateReturn,
    | "focusedDate"
    | "selectDate"
    | "setFocusedDate"
    | "isDisabled"
    | "month"
    | "minDate"
    | "maxDate"
    | "dateValue"
    | "isFocused"
    | "isRangeCalendar"
  > & {
    date: Date;
  };

export type CalendarCellButtonHTMLProps = ButtonHTMLProps;

export type CalendarCellButtonProps = CalendarCellButtonOptions &
  CalendarCellButtonHTMLProps;
