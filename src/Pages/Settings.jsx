import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {
  UpdatePassword,
  UpdateUserName,
  UpdateContactEmail,
} from "../components";

function ControlledTabsExample() {
  const [key, setKey] = useState("username");

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
      style={{
        background: "lightgrey",
        padding: "10px",
      }}
    >
      <Tab eventKey="username" title="Username" className="text">
        <UpdateUserName />
      </Tab>
      <Tab eventKey="password" title="Password" className="text">
        <UpdatePassword />
      </Tab>
      <Tab eventKey="contact_email" title="Contact email" className="text">
        <UpdateContactEmail />
      </Tab>
    </Tabs>
  );
}

export default ControlledTabsExample;
