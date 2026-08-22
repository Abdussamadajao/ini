import { makeStyles, useColors } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  format,
  getHours,
  getMinutes,
  getMonth,
  isSameDay,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useField } from "formik";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import BlurBackdrop, { BlurBackdropProps } from "../shared/blur-backdrop";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getCalendarCells(year: number, month: number) {
  const monthStart = startOfMonth(new Date(year, month));
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = addDays(gridStart, 41);
  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    currentMonth: getMonth(date) === month,
  }));
}

function formatDisplayDate(d: Date) {
  return format(d, "d MMM yyyy");
}

function formatTime(d: Date) {
  const h = getHours(d);
  const am = h < 12;
  const h12 = h % 12 || 12;
  return { hour: h12, minute: getMinutes(d), am };
}

type BaseDatePickerProps = {
  style?: StyleProp<ViewStyle>;
  label: string;
  leftIcon?: React.ReactNode;
  error?: string;
  calendarIconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
};

export type DatePickerProps = BaseDatePickerProps & {
  value?: Date;
  onChange: (date: Date) => void;
};

export type FormikDatePickerProps = BaseDatePickerProps & {
  name: string;
  validate?: (value: Date | undefined) => string | undefined;
  showFormikError?: boolean;
  required?: boolean;
};

type QuickMode = "today" | "yesterday";

const DatePickerUI: React.FC<DatePickerProps> = ({
  style,
  label,
  value,
  onChange,
  error,
  calendarIconColor,
  backgroundColor,
  borderColor,
}) => {
  const colors = useColors();
  const modalRef = useRef<BottomSheetModal>(null);
  const initial = value ? new Date(value) : new Date();
  const [pickerDate, setPickerDate] = useState(initial);
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [quickMode, setQuickMode] = useState<QuickMode>(() => {
    const d = value || new Date();
    const t = new Date();
    if (isSameDay(d, t)) return "today";
    const y = new Date(t);
    y.setDate(y.getDate() - 1);
    if (isSameDay(d, y)) return "yesterday";
    return "today";
  });
  const { hour, minute, am } = formatTime(pickerDate);
  const [hourStr, setHourStr] = useState(String(hour));
  const [minStr, setMinStr] = useState(String(minute).padStart(2, "0"));
  const [isAm, setIsAm] = useState(am);

  const openModal = useCallback(() => {
    const d = value ? new Date(value) : new Date();
    setPickerDate(d);
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
    const { hour, minute, am } = formatTime(d);
    setHourStr(String(hour));
    setMinStr(String(minute).padStart(2, "0"));
    setIsAm(am);
    if (value) {
      const t = new Date();
      const yesterday = addDays(t, -1);
      setQuickMode(
        isSameDay(d, t)
          ? "today"
          : isSameDay(d, yesterday)
            ? "yesterday"
            : "today",
      );
    }
    modalRef.current?.present();
  }, [value]);
  const closeModal = useCallback(() => modalRef.current?.dismiss(), []);

  const displayValue = value
    ? isSameDay(value, new Date())
      ? `Today, ${format(value, "MMM d")}`
      : formatDisplayDate(value)
    : "Select date...";

  const applyTime = useCallback(
    (h: number, m: number, am: boolean) => {
      const h24 = am ? h % 12 : (h % 12) + 12;
      setPickerDate(setMinutes(setHours(pickerDate, h24), m));
    },
    [pickerDate],
  );

  const handleDone = useCallback(() => {
    const h = parseInt(hourStr, 10) || 12;
    const m = Math.min(59, parseInt(minStr, 10) || 0);
    const h24 = isAm ? h % 12 : (h % 12) + 12;
    onChange(setMinutes(setHours(pickerDate, h24), m));
    closeModal();
  }, [pickerDate, hourStr, minStr, isAm, onChange, closeModal]);

  const setQuick = useCallback((mode: QuickMode) => {
    setQuickMode(mode);
    const d = new Date();
    if (mode === "today") {
      setPickerDate(d);
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
    } else {
      const yesterday = addDays(d, -1);
      setPickerDate(yesterday);
      setViewMonth(yesterday.getMonth());
      setViewYear(yesterday.getFullYear());
    }
  }, []);

  const viewDate = useMemo(
    () => new Date(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const prevMonth = useCallback(() => {
    const prev = subMonths(viewDate, 1);
    setViewMonth(prev.getMonth());
    setViewYear(prev.getFullYear());
  }, [viewDate]);

  const nextMonth = useCallback(() => {
    const next = addMonths(viewDate, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  }, [viewDate]);

  const onSelectDay = useCallback(
    (date: Date) => {
      const newDate = setMinutes(
        setHours(date, getHours(pickerDate)),
        getMinutes(pickerDate),
      );
      setPickerDate(newDate);
      const t = new Date();
      const yesterday = addDays(t, -1);
      setQuickMode(
        isSameDay(date, t)
          ? "today"
          : isSameDay(date, yesterday)
            ? "yesterday"
            : "today",
      );
    },
    [pickerDate],
  );

  const handleHourBlur = useCallback(() => {
    const h = parseInt(hourStr, 10);
    if (!Number.isNaN(h))
      applyTime(Math.min(12, Math.max(1, h)), parseInt(minStr, 10) || 0, isAm);
  }, [hourStr, minStr, isAm, applyTime]);

  const handleMinBlur = useCallback(() => {
    const m = parseInt(minStr, 10);
    if (!Number.isNaN(m))
      applyTime(
        parseInt(hourStr, 10) || 12,
        Math.min(59, Math.max(0, m)),
        isAm,
      );
  }, [hourStr, minStr, isAm, applyTime]);

  const snapPoints = useMemo(() => ["80%"], []);
  const renderBackdrop = useCallback(
    (props: BlurBackdropProps) => (
      <BlurBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const cells = useMemo(
    () => getCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const styles = useDatePickerStyles();

  return (
    <>
      <View style={style}>
        {label ? <Text style={styles.selectLabel}>{label}</Text> : null}
        <Pressable
          style={[
            styles.select,
            {
              backgroundColor: backgroundColor ?? colors.background.surface,
              borderColor: borderColor ?? colors.border.default,
            },
            error && styles.selectError,
          ]}
          onPress={openModal}
        >
          <Text
            style={[styles.value, !value && styles.valuePlaceholder]}
            numberOfLines={1}
          >
            {displayValue}
          </Text>
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={calendarIconColor ?? colors.text.secondary}
          />
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        stackBehavior="push"
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        backgroundStyle={styles.modalBackground}
        handleIndicatorStyle={styles.handleIndicator}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <Pressable onPress={handleDone}>
              <Text style={styles.doneButton}>Done</Text>
            </Pressable>
          </View>
          <View style={styles.quickRow}>
            {(["today", "yesterday"] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.quickBtn,
                  quickMode === mode && styles.quickBtnSelected,
                ]}
                onPress={() => setQuick(mode)}
              >
                <Text
                  style={[
                    styles.quickBtnText,
                    quickMode === mode && styles.quickBtnTextSelected,
                  ]}
                >
                  {mode === "today" ? "Today" : "Yesterday"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.chevron}>
              <MaterialIcons
                name="chevron-left"
                size={24}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {format(viewDate, "MMMM yyyy")}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.chevron}>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((w, i) => (
              <Text key={i} style={styles.weekday}>
                {w}
              </Text>
            ))}
          </View>

          <FlatList
            key="calendar-list-5"
            data={cells}
            numColumns={7}
            keyExtractor={(_, index) => `day-${index}`}
            renderItem={({ item }) => {
              const { date, currentMonth } = item;
              const selected = isSameDay(date, pickerDate);
              return (
                <TouchableOpacity
                  style={[
                    styles.dayCell,
                    !currentMonth && styles.dayCellOther,
                    selected && styles.dayCellSelected,
                  ]}
                  onPress={() => onSelectDay(date)}
                >
                  {selected ? (
                    <View style={styles.dayCellSelectedInner}>
                      <Text style={[styles.dayText, styles.dayTextSelected]}>
                        {date.getDate()}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.dayText,
                        !currentMonth && styles.dayTextOther,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
            scrollEnabled={false}
            nestedScrollEnabled={true}
            style={[
              styles.calendarGrid,
              { backgroundColor: colors.background.surface },
            ]}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Time</Text>
            <View style={styles.timeInputRow}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  style={styles.timeInput}
                  value={hourStr}
                  onChangeText={setHourStr}
                  onBlur={handleHourBlur}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="12"
                />
                <Text style={styles.timeColon}>:</Text>
                <TextInput
                  style={styles.timeInput}
                  value={minStr}
                  onChangeText={(t) =>
                    setMinStr(t.padStart(2, "0").slice(0, 2))
                  }
                  onBlur={handleMinBlur}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="00"
                />

                <View style={styles.ampmRow}>
                  <TouchableOpacity
                    style={[styles.ampmBtn, isAm && styles.ampmBtnSelected]}
                    onPress={() => {
                      setIsAm(true);
                      applyTime(
                        parseInt(hourStr, 10) || 12,
                        parseInt(minStr, 10) || 0,
                        true,
                      );
                    }}
                  >
                    <Text
                      style={[styles.ampmText, isAm && styles.ampmTextSelected]}
                    >
                      AM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.ampmBtn, !isAm && styles.ampmBtnSelected]}
                    onPress={() => {
                      setIsAm(false);
                      applyTime(
                        parseInt(hourStr, 10) || 12,
                        parseInt(minStr, 10) || 0,
                        false,
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.ampmText,
                        !isAm && styles.ampmTextSelected,
                      ]}
                    >
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

function toDate(v: unknown): Date | undefined {
  if (v instanceof Date) return v;
  if (typeof v === "string") return new Date(v);
  return undefined;
}

export const FormikDatePicker: React.FC<FormikDatePickerProps> = ({
  name,
  validate,
  showFormikError = true,
  required = false,
  error: errorOverride,
  ...rest
}) => {
  const [field, meta, helpers] = useField<Date | string | undefined>({
    name,
    validate: (val) => {
      const d = toDate(val);
      const empty = d == null || Number.isNaN(d.getTime());
      if (!required && empty) return undefined;
      if (required && empty) return "Required";
      return validate ? validate(d) : undefined;
    },
  });
  const value = toDate(field.value);
  const error =
    errorOverride ??
    (showFormikError && meta.touched
      ? (meta.error as string | undefined)
      : undefined);
  return (
    <DatePickerUI
      value={value}
      onChange={(date) => {
        helpers.setValue(date);
        helpers.setTouched(true);
      }}
      error={error}
      {...rest}
    />
  );
};

export { DatePickerUI as DatePicker };
export default DatePickerUI;

const useDatePickerStyles = makeStyles(
  ({ colors, radius, typography, textMetrics }) => ({
    selectLabel: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      letterSpacing: 0.5,
      marginBottom: 8,
      color: colors.text.primary,
    },
    select: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.background.surface,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: radius.sm,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 56,
    },
    selectError: { borderColor: colors.status.error.main },
    valuePlaceholder: { color: colors.text.secondary },
    errorText: {
      ...textMetrics("xs", "snug"),
      color: colors.status.error.main,
      marginTop: 4,
      fontFamily: typography.fontFamily.Manrope.Medium,
    },
    label: {
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
      marginBottom: 2,
    },
    value: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
    },
    modalBackground: {
      backgroundColor: colors.background.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    handleIndicator: {
      backgroundColor: colors.text.secondary,
      width: 40,
      height: 4,
      marginTop: 10,
    },
    modalContent: { paddingBottom: 34 },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
    },
    modalTitle: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    doneButton: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.primary.main,
    },
    quickRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingTop: 16,
      gap: 8,
    },
    quickBtn: {
      flex: 1,
      padding: 10,
      width: 200,
      borderRadius: radius.xl,
      backgroundColor: colors.border.default,
      alignItems: "center",
    },
    quickBtnSelected: { backgroundColor: colors.primary.main },
    quickBtnText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.secondary,
    },
    quickBtnTextSelected: { color: colors.primary.contrastText },
    monthRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      paddingTop: 20,
    },
    chevron: { padding: 8 },
    monthYear: {
      ...textMetrics("lg", "snug"),
      fontFamily: typography.fontFamily.Manrope.Bold,
      color: colors.text.primary,
    },
    weekdayRow: {
      flexDirection: "row",
      paddingHorizontal: 1,
      paddingTop: 16,
      justifyContent: "space-around",
    },
    weekday: {
      width: 36,
      textAlign: "center",
      ...textMetrics("xs", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.secondary,
    },
    calendarGrid: {},
    dayCell: {
      width: "14.28%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    dayCellOther: {},
    dayCellSelected: {},
    dayCellSelectedInner: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary.main,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    dayText: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.primary,
    },
    dayTextOther: { color: colors.text.secondary },
    dayTextSelected: { color: colors.primary.contrastText },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 24,
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
      gap: 12,
    },
    timeLabel: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Regular,
      color: colors.text.secondary,
    },
    timeInputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.border.default,
      borderRadius: radius.md,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    timeInput: {
      minWidth: 32,
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.primary,
      padding: 0,
    },
    timeColon: {
      ...textMetrics("md", "snug"),
      fontFamily: typography.fontFamily.Manrope.SemiBold,
      color: colors.text.secondary,
    },
    ampmRow: { flexDirection: "row", gap: 8 },
    ampmBtn: {
      paddingVertical: 5,
      paddingHorizontal: 8,
      borderRadius: radius.md,
      backgroundColor: colors.border.default,
    },
    ampmBtnSelected: { backgroundColor: colors.primary.main },
    ampmText: {
      ...textMetrics("sm", "snug"),
      fontFamily: typography.fontFamily.Manrope.Medium,
      color: colors.text.secondary,
    },
    ampmTextSelected: {
      color: colors.primary.contrastText,
      fontFamily: typography.fontFamily.Manrope.SemiBold,
    },
  }),
);
