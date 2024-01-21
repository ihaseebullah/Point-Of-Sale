import { useState } from "react";
import Box from "./Box";
import { Link } from "react-router-dom";

export default function Boxes() {
  const [inContact, setIncontact] = useState(false);
  const [inContact2, setIncontact2] = useState(false);
  const [inContact3, setIncontact3] = useState(false);
  const [inContact4, setIncontact4] = useState(false);
  return (
    <div className="row">
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact(true);
        }}
        onMouseLeave={() => {
          setIncontact(false);
        }}
      >
          <Box inContact={inContact} name="Inventory" anchor="inventory" icon={1} />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact2(true);
        }}
        onMouseLeave={() => {
          setIncontact2(false);
        }}
      >
        <Box inContact={inContact2} name="Sales" anchor="sales" icon={0} />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact3(true);
        }}
        onMouseLeave={() => {
          setIncontact3(false);
        }}
      >
        <Box inContact={inContact3} name="Invoices" anchor="invoices" icon={2} />
      </div>
      <div
        className={`col-md-3 col-sm-6 col-12`}
        onMouseEnter={() => {
          setIncontact4(true);
        }}
        onMouseLeave={() => {
          setIncontact4(false);
        }}
      >
        <Box inContact={inContact4} name="Messages" anchor="messages" icon={3} />
      </div>
    </div>
  );
}
