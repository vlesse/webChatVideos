import React from "react";
import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiImage } from "@elastic/eui";
import { useNavigate } from "react-router-dom";
import dashboard1 from "../assets/dashboard1.png";
import dashboard2 from "../assets/dashboard2.png";
import dashboard3 from "../assets/dashboard3.png";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";

function Dashboard() {
  useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Header />
        <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          style={{ margin: "5vh 10vw" }}
        >
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={dashboard1} alt="icon" size="5rem" />}
              title={`创建直播`}
              description="创建一个新的直播并且邀请其他人进入."
              onClick={() => navigate("/create")}
              paddingSize="xl"
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={dashboard2} alt="icon" size="100%" />}
              title={`我的直播`}
              description="查看您创建的直播."
              onClick={() => navigate("/mymeetings")}
              paddingSize="xl"
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={dashboard3} alt="icon" size="5rem" />}
              title={`直播中`}
              description="查看您受邀参加的直播系统."
              onClick={() => navigate("/meetings")}
              paddingSize="xl"
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </>
  );
}

export default Dashboard;