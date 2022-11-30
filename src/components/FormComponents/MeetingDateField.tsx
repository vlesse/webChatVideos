import { EuiDatePicker, EuiFormRow } from "@elastic/eui";
import moment from "moment";
import React from "react";

function MeetingDateField({
    selected,
    setStartDate,
}: {
    selected: moment.Moment;
    setStartDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
}) {
    return (
        <EuiFormRow label="设置直播日期">
            <EuiDatePicker
                selected={selected}
                onChange={(date) => setStartDate(date!)}
            />
        </EuiFormRow>
    );
}

export default MeetingDateField;