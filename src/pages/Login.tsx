import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiImage, EuiPanel, EuiProvider, EuiSpacer, EuiText, EuiTextColor } from '@elastic/eui';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { query, where, getDocs, addDoc } from "firebase/firestore";
import React from 'react';
import animation from "../assets/animation.gif";
import logo from "../assets/logo.png";
import { firebaseAuth, userRef } from '../utils/FirebaseConfig';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../app/hooks';
import { setUser } from "../app/Slices/AuthSlice";

function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) navigate("/")
    })

    const login = async () => {
        const provider = new GoogleAuthProvider();
        const { user: { displayName, email, uid } } = await signInWithPopup(firebaseAuth, provider);
        if (email) {
            const firestoreQuery = query(userRef, where("uid", "==", uid));
            const fetchedUser = await getDocs(firestoreQuery);
            if (fetchedUser.docs.length === 0) {
                await addDoc(userRef, {
                    uid,
                    name: displayName,
                    email,
                });
            }
            dispatch(setUser({ uid, email: email!, name: displayName! }));
            navigate("/");
        }
    }

    return (
        <EuiProvider colorMode='dark'>
            <EuiFlexGroup
                justifyContent="center"
                alignItems="center"
                style={{
                    width: "100vw", height: "100vh"
                }}
            >
                <EuiFlexItem grow={false}>
                    <EuiPanel paddingSize='xl'>
                        <EuiFlexGroup justifyContent='center' alignItems="center">
                            <EuiFlexItem>
                                <EuiImage src={animation} alt="logo" />
                            </EuiFlexItem>
                            <EuiFlexItem>
                                <EuiImage src={logo} alt="logo" size="230px" />
                                <EuiSpacer size="xs" />
                                <EuiText textAlign='center' grow={false} >
                                    <h3>
                                        <EuiTextColor>人人影视</EuiTextColor>
                                        <EuiTextColor color="#0b5cff">会议直播聊天室</EuiTextColor>
                                    </h3>
                                </EuiText>
                                <EuiSpacer size="l" />
                                <EuiButton fill onClick={login}>
                                    使用谷歌账户登录
                                </EuiButton>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiProvider>
    );
}

export default Login;