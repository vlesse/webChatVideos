import {
    EuiFlexGroup,
    EuiForm,
    EuiFormRow,
    EuiSpacer,
    EuiSwitch,
} from "@elastic/eui";
import { addDoc } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import CreateMeetingButtons from "../components/FormComponents/CreateMeetingButtons";
import MeetingDateField from "../components/FormComponents/MeetingDateField";
import MeetingMaximumUsersField from "../components/FormComponents/MeetingMaximumUsersField";
import MeetingNameField from "../components/FormComponents/MeetingNameFIeld";
import MeetingUserField from "../components/FormComponents/MeetingUserField";

import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import useFetchUsers from "../hooks/useFetchUsers";
import useToast from "../hooks/useToast";
import { meetingsRef } from "../utils/FirebaseConfig";
import { generateMeetingID } from "../utils/generateMeetingId";
import { FieldErrorType, UserType } from "../utils/Types";

export default function VideoConference() {
    useAuth();
    const [users] = useFetchUsers();
    const [createToast] = useToast();
    const uid = useAppSelector((zoomApp) => zoomApp.auth.userInfo?.uid);
    const navigate = useNavigate();

    const [meetingName, setMeetingName] = useState("");
    const [selectedUser, setSelectedUser] = useState<Array<UserType>>([]);
    const [startDate, setStartDate] = useState(moment());
    const [size, setSize] = useState(1);
    const [showErrors, setShowErrors] = useState<{
        meetingName: FieldErrorType;
        meetingUsers: FieldErrorType;
    }>({
        meetingName: {
            show: false,
            message: [],
        },
        meetingUsers: {
            show: false,
            message: [],
        },
    });
    const [anyoneCanJoin, setAnyoneCanJoin] = useState(false);

    const onUserChange = (selectedOptions: Array<UserType>) => {
        setSelectedUser(selectedOptions);
    };

    const validateForm = () => {
        const showErrorsClone = { ...showErrors };
        let errors = false;
        if (!meetingName.length) {
            showErrorsClone.meetingName.show = true;
            showErrorsClone.meetingName.message = ["请输入直播名称"];
            errors = true;
        } else {
            showErrorsClone.meetingName.show = false;
            showErrorsClone.meetingName.message = [];
        }
        if (!selectedUser.length && !anyoneCanJoin) {
            showErrorsClone.meetingUsers.show = true;
            showErrorsClone.meetingUsers.message = ["请选择邀请用户"];
            errors = true;
        } else {
            showErrorsClone.meetingUsers.show = false;
            showErrorsClone.meetingUsers.message = [];
        }
        setShowErrors(showErrorsClone);
        return errors;
    };

    const createMeeting = async () => {
        if (!validateForm()) {
            const meetingId = generateMeetingID();
            await addDoc(meetingsRef, {
                createdBy: uid,
                meetingId,
                meetingName,
                meetingType: anyoneCanJoin ? "anyone-can-join" : "video-conference",
                invitedUsers: anyoneCanJoin
                    ? []
                    : selectedUser.map((user: UserType) => user.uid),
                meetingDate: startDate.format("L"),
                maxUsers: anyoneCanJoin ? 100 : size,//设置最大一百人
                status: true,
            });
            createToast({
                title: anyoneCanJoin
                    ? "任何人都可以加入成功创建的直播频道"
                    : "直播频道创建成功.",
                type: "success",
            });
            navigate("/");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
            }}
        >
            <Header />
            <EuiFlexGroup justifyContent="center" alignItems="center">
                <EuiForm>
                    <EuiFormRow display="columnCompressedSwitch" label="是否任何人均可加入直播">
                        <EuiSwitch
                            showLabel={false}
                            label="是否任何人均可加入直播"
                            checked={anyoneCanJoin}
                            onChange={(e) => setAnyoneCanJoin(e.target.checked)}
                            compressed
                        />
                    </EuiFormRow>

                    <MeetingNameField
                        label="直播名称"
                        isInvalid={showErrors.meetingName.show}
                        error={showErrors.meetingName.message}
                        placeholder="直播名称"
                        value={meetingName}
                        setMeetingName={setMeetingName}
                    />

                    {anyoneCanJoin ? (
                        <MeetingMaximumUsersField value={size} setSize={setSize} />
                    ) : (
                        <MeetingUserField
                            label="邀请用户"
                            isInvalid={showErrors.meetingUsers.show}
                            error={showErrors.meetingUsers.message}
                            options={users}
                            onChange={onUserChange}
                            selectedOptions={selectedUser}
                            isClearable={false}
                            placeholder="选择邀请的用户"
                        />
                    )}
                    <MeetingDateField selected={startDate} setStartDate={setStartDate} />
                    <EuiSpacer />
                    <CreateMeetingButtons createMeeting={createMeeting} />
                </EuiForm>
            </EuiFlexGroup>
        </div>
    );
}