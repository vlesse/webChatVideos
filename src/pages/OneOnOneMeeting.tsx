import { EuiFlexGroup, EuiForm, EuiSpacer } from '@elastic/eui';
import { addDoc } from "firebase/firestore";
import moment from "moment";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CreateMeetingButtons from '../components/FormComponents/CreateMeetingButtons';
import MeetingDateField from '../components/FormComponents/MeetingDateField';
import MeetingNameFIeld from '../components/FormComponents/MeetingNameFIeld';
import MeetingUserField from '../components/FormComponents/MeetingUserField';

import Header from '../components/Header';
import useAuth from "../hooks/useAuth";
import { meetingsRef } from "../utils/FirebaseConfig";
import useFetchUsers from "../hooks/useFetchUsers";
import { FieldErrorType, UserType } from "../utils/Types";
import { generateMeetingID } from '../utils/generateMeetingId';
import { useAppSelector } from '../app/hooks';
import useToast from '../hooks/useToast';

function OneOnOneMeeting() {
    useAuth();
    const [users] = useFetchUsers();
    const [createToast] = useToast();
    const uid = useAppSelector((zoomApp) => zoomApp.auth.userInfo?.uid);
    const navigate = useNavigate();

    const [meetingName, setMeetingName] = useState("");
    const [selectedUser, setSelectedUser] = useState<Array<UserType>>([]);
    const [startDate, setStartDate] = useState(moment());

    const [showErrors, setShowErrors] = useState<{
        meetingName: FieldErrorType;
        meetingUser: FieldErrorType;
    }>({
        meetingName: {
            show: false,
            message: [],
        },
        meetingUser: {
            show: false,
            message: [],
        },
    });

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
        if (!selectedUser.length) {
            showErrorsClone.meetingUser.show = true;
            showErrorsClone.meetingUser.message = ["请选择用户"];
            errors = true;
        } else {
            showErrorsClone.meetingUser.show = false;
            showErrorsClone.meetingUser.message = [];
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
                meetingType: "1-on-1",
                invitedUsers: [selectedUser[0].uid],
                meetingDate: startDate.format("L"),
                maxUsers: 1,
                status: true,
            });
            createToast({
                title: "一对一直播创建成功",
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
            <EuiFlexGroup justifyContent='center' alignItems='center'>
                <EuiForm>
                    <MeetingNameFIeld
                        label="直播名称"
                        isInvalid={showErrors.meetingName.show}
                        error={showErrors.meetingName.message}
                        placeholder="直播名称"
                        value={meetingName}
                        setMeetingName={setMeetingName}
                    />
                    <MeetingUserField
                        label="邀请用户"
                        isInvalid={showErrors.meetingUser.show}
                        error={showErrors.meetingUser.message}
                        options={users}
                        onChange={onUserChange}
                        selectedOptions={selectedUser}
                        singleSelection={{ asPlainText: true }}
                        isClearable={false}
                        placeholder="选择一个用户"
                    />
                    <MeetingDateField selected={startDate} setStartDate={setStartDate} />
                    <EuiSpacer />
                    <CreateMeetingButtons createMeeting={createMeeting} />
                </EuiForm>
            </EuiFlexGroup>
        </div>
    )
}

export default OneOnOneMeeting