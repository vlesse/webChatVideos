import { EuiButton, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import React from "react";
import { useNavigate } from "react-router-dom";

function CreateMeetingButtons({
    createMeeting,
    isEdit = false,
    closeFlyout,
}: {
    createMeeting: () => {};
    isEdit?: boolean;
    closeFlyout?: () => {};
}) {
    const navigate = useNavigate();
    return (
        <EuiFlexGroup>
            <EuiFlexItem grow={false}>
                <EuiButton
                    color="danger"
                    onClick={() => (isEdit ? closeFlyout!() : navigate("/"))}
                    fill
                >
                    取消
                </EuiButton>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
                <EuiButton type="submit" onClick={createMeeting} fill>
                    {isEdit ? "编辑直播" : "创建直播"}
                </EuiButton>
            </EuiFlexItem>
        </EuiFlexGroup>
    );
}

export default CreateMeetingButtons;