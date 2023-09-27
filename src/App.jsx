import { useEffect, useState } from "react";

import logo from "./assets/logoDark.svg";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import { Card, Typography } from "@material-tailwind/react";
import { mergeApplicationsByTenantAndEmail } from "./utilities/filteredArray";
import { getTimeDifference } from "./utilities/getTimeDifference";
import { toast } from "react-toastify";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Checkbox,
  Input,
} from "@material-tailwind/react";
import Loader from "./components/Loader";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function App() {
  const [dataG, setDataG] = useState([]);

  const [open, setOpen] = useState(null);

  const [poEmail, setPoEmail] = useState(false);
  const [poEmailData, setPoEmailData] = useState([]);

  const [nonePpoEmail, setnonePoEmail] = useState(false);
  const [nonePOData, setNonePOData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [emailKeyword, setEmailKeyword] = useState("");

  const [appIDKeyword, setAppIDKeyWord] = useState("");
  const [appID, setAppID] = useState([]);
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);

  let final_array = [];

  const TABLE_HEAD = ["Tenant Id", "Email", ""];

  const INNER_TABLE_HEAD = [
    "App name",
    "App id",
    "Last Heartbeat",
    "Workload id",
  ];

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const getDataLogs = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/getworkloaddata`
      );

      for (let index = 0; index < data.length; index++) {
        //console.log("Data::",data[index]);

        const res = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/fetchTenantIdEmail`,
          {
            application_id: data[index].application_id,
          }
        );
        //console.log("Res data:",res.data);

        if (
          res.data.email === "poe2etest@gmail.com" ||
          res.data.tenant_id === "4de99337-9068-4956-acce-6459f9553d63"
        ) {
          continue;
        }

        final_array.push({
          ...res.data,
          applications: data[index],
        });
      }

      let result = mergeApplicationsByTenantAndEmail(final_array);

      setDataG(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const filterDataByEmail = () => {
    if (dataG.length > 0) {
      setPoEmail(!poEmail);
      const newArr = dataG.filter((item) =>
        item.email.includes("@protectonce.com")
      );
      console.log("newArr: ", newArr);
      setPoEmailData(newArr);
    }
  };

  const filterDataByNonePOEmail = () => {
    if (dataG.length > 0) {
      setnonePoEmail(!nonePpoEmail);

      const newArr = dataG.filter(
        (item) => !item.email.includes("@protectonce.com")
      );
      console.log("None po: ", newArr);
      setNonePOData(newArr);
    }
  };

  const filterDataAppId = () => {
    if (dataG.length > 0) {
      setAppID([]);
      //setIsSearchButtonClicked(!isSearchButtonClicked)
      const filteredAppId = dataG.filter((item) =>
        item.applications.some((app) =>
          app.application_id.S.toString().includes(appIDKeyword)
        )
      );
      //console.log("Filtered",filteredAppId);
      setAppID(filteredAppId);
    }
  };

  console.log("dataG", dataG);
  console.log("poEmailData", poEmailData);
  console.log("None PO Email", nonePOData);
  console.log("Appid", appID);

  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <img src={logo} />
      </div>

      <div className="overflow-x-scroll overflow-y-scroll md:overflow-auto rounded-lg border border-gray-200 shadow m-5">
        <div className="bg-white flex items-center font-medium px-6 py-4 justify-between">
          <h2 className="  text-gray-900 font-bold text-xl">
            <div className="flex items-start justify-end">
              <div className="w-72 mx-8 my-4">
                <Input
                  variant="outlined"
                  color="blue"
                  label="Search by Email"
                  value={emailKeyword}
                  onChange={(e) => setEmailKeyword(e.target.value)}
                  size="lg"
                  disabled={dataG.length > 0 ? false : true}
                />
              </div>
              <div className="w-[30rem] mx-8 my-4 relative">
                <Input
                  variant="outlined"
                  color="blue"
                  label="Search by Application ID"
                  value={appIDKeyword}
                  onChange={(e) => setAppIDKeyWord(e.target.value)}
                  size="lg"
                  disabled={dataG.length > 0 ? false : true}
                />
                <Button
                  size="sm"
                  color={appIDKeyword ? "blue" : "gray"}
                  disabled={!appIDKeyword}
                  className="!absolute right-1 top-[0.35rem] rounded"
                  onClick={filterDataAppId}
                >
                  Search
                </Button>
                <Typography
                  variant="small"
                  color="gray"
                  className="mt-2 flex items-center gap-1 font-normal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="-mt-px h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Click on Search Button to get trigger
                </Typography>
              </div>
            </div>
          </h2>
          <span className="flex items-start my-4 gap-2">
            <Button onClick={getDataLogs} color="blue">
              Fetech Data
            </Button>
            <Checkbox
              id="ripple-on"
              label="PO email"
              ripple={true}
              onClick={filterDataByEmail}
              disabled={dataG.length > 0 ? false : true}
            />
            <Checkbox
              id="ripple-on"
              label="None PO email"
              ripple={true}
              onClick={filterDataByNonePOEmail}
              disabled={dataG.length > 0 ? false : true}
            />
          </span>
        </div>

        {/*Main Table */}
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 "
                  >
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="bold leading-none opacity-70 text-black"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && <Loader />}

              {poEmail &&
                poEmailData
                  .filter((log) =>
                    log.email
                      .toString()
                      .toLowerCase()
                      .includes(emailKeyword.toString().toLowerCase())
                  )
                  .map(({ tenant_id, email, applications }, index) => {
                    const isLast = index === dataG.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={`${tenant_id}-${index}`}>
                        <td className={`${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {tenant_id}
                          </Typography>
                        </td>
                        <td className={`${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {email}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Accordion
                            open={open === tenant_id}
                            icon={<Icon id={tenant_id} open={open} />}
                          >
                            <AccordionHeader
                              onClick={() => handleOpen(tenant_id)}
                              style={{
                                border: "0px",
                              }}
                            >
                              Application detail
                            </AccordionHeader>
                            <AccordionBody>
                              <Card className="h-full w-full overflow-scroll">
                                <table className="w-full min-w-max table-auto text-left">
                                  <thead>
                                    <tr>
                                      {INNER_TABLE_HEAD.map((head) => (
                                        <th
                                          key={head}
                                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                          >
                                            {head}
                                          </Typography>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {applications.map((single_app, index) => (
                                      <tr
                                        key={`${single_app.application_name.S}-${index}`}
                                      >
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.application_name.S}
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.application_id.S}
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {
                                              single_app
                                                .recentHeartbeatTimestamp.S
                                            }
                                            &nbsp;
                                            {getTimeDifference(
                                              single_app
                                                .recentHeartbeatTimestamp.S
                                            ) ===
                                            "0 days, 0 hours, and 0 minutes ago"
                                              ? "Just Now"
                                              : getTimeDifference(
                                                  single_app
                                                    .recentHeartbeatTimestamp.S
                                                )}
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.workload_id.S}
                                          </Typography>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </Card>
                            </AccordionBody>
                          </Accordion>
                        </td>
                      </tr>
                    );
                  })}

              {nonePpoEmail &&
                nonePOData
                  .filter((log) =>
                    log.email
                      .toString()
                      .toLowerCase()
                      .includes(emailKeyword.toString().toLowerCase())
                  )
                  .map(({ tenant_id, email, applications }, index) => {
                    const isLast = index === dataG.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={`${tenant_id}-${index}`}>
                        <td className={`${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {tenant_id}
                          </Typography>
                        </td>
                        <td className={`${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {email}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Accordion
                            open={open === tenant_id}
                            icon={<Icon id={tenant_id} open={open} />}
                          >
                            <AccordionHeader
                              onClick={() => handleOpen(tenant_id)}
                              style={{
                                border: "0px",
                              }}
                            >
                              Application detail
                            </AccordionHeader>
                            <AccordionBody>
                              <Card className="h-full w-full overflow-scroll">
                                <table className="w-full min-w-max table-auto text-left">
                                  <thead>
                                    <tr>
                                      {INNER_TABLE_HEAD.map((head) => (
                                        <th
                                          key={head}
                                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                          >
                                            {head}
                                          </Typography>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {applications.map((single_app, index) => (
                                      <tr
                                        key={`${single_app.application_name.S}-${index}`}
                                      >
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.application_name.S}
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.application_id.S}
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {
                                              single_app
                                                .recentHeartbeatTimestamp.S
                                            }
                                            &nbsp;
                                            {getTimeDifference(
                                              single_app
                                                .recentHeartbeatTimestamp.S
                                            ) ===
                                            "0 days, 0 hours, and 0 minutes ago"
                                              ? "Just Now"
                                              : getTimeDifference(
                                                  single_app
                                                    .recentHeartbeatTimestamp.S
                                                )}
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.workload_id.S}
                                          </Typography>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </Card>
                            </AccordionBody>
                          </Accordion>
                        </td>
                      </tr>
                    );
                  })}

              {isLoading === false &&
                poEmail === false &&
                nonePpoEmail === false &&
                appIDKeyword === "" &&
                dataG?.length > 0 &&
                dataG
                  .filter((log) =>
                    log.email
                      .toString()
                      .toLowerCase()
                      .includes(emailKeyword.toString().toLowerCase())
                  )
                  .map(({ tenant_id, email, applications }, index) => {
                    const isLast = index === dataG.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={`${tenant_id}-${index}`}>
                        <td className={`${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {tenant_id}
                          </Typography>
                        </td>
                        <td className={`${classes}`}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {email}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Accordion
                            open={open === tenant_id}
                            icon={<Icon id={tenant_id} open={open} />}
                          >
                            <AccordionHeader
                              onClick={() => handleOpen(tenant_id)}
                              style={{
                                border: "0px",
                              }}
                            >
                              Application detail
                            </AccordionHeader>
                            <AccordionBody>
                              <Card className="h-full w-full overflow-scroll">
                                <table className="w-full min-w-max table-auto text-left">
                                  <thead>
                                    <tr>
                                      {INNER_TABLE_HEAD.map((head) => (
                                        <th
                                          key={head}
                                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                          >
                                            {head}
                                          </Typography>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {applications.map((single_app, index) => (
                                      <tr
                                        key={`${single_app.application_name.S}-${index}`}
                                      >
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.application_name.S}
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.application_id.S}
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {
                                              single_app
                                                .recentHeartbeatTimestamp.S
                                            }
                                            &nbsp;
                                            <span className="text-slate-400 italic underline">
                                              {getTimeDifference(
                                                single_app
                                                  .recentHeartbeatTimestamp.S
                                              ) ===
                                              "0 days, 0 hours, and 0 minutes ago"
                                                ? "Just Now"
                                                : getTimeDifference(
                                                    single_app
                                                      .recentHeartbeatTimestamp
                                                      .S
                                                  )}
                                            </span>
                                          </Typography>
                                        </td>
                                        <td className={classes}>
                                          <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                          >
                                            {single_app.workload_id.S}
                                          </Typography>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </Card>
                            </AccordionBody>
                          </Accordion>
                        </td>
                      </tr>
                    );
                  })}

              {appIDKeyword !== "" &&
                appID.map(({ tenant_id, email, applications }, index) => {
                  const isLast = index === dataG.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={`${tenant_id}-${index}`}>
                      <td className={`${classes}`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {tenant_id}
                        </Typography>
                      </td>
                      <td className={`${classes}`}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Accordion
                          open={open === tenant_id}
                          icon={<Icon id={tenant_id} open={open} />}
                        >
                          <AccordionHeader
                            onClick={() => handleOpen(tenant_id)}
                            style={{
                              border: "0px",
                            }}
                          >
                            Application detail
                          </AccordionHeader>
                          <AccordionBody>
                            <Card className="h-full w-full overflow-scroll">
                              <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                  <tr>
                                    {INNER_TABLE_HEAD.map((head) => (
                                      <th
                                        key={head}
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                      >
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-normal leading-none opacity-70"
                                        >
                                          {head}
                                        </Typography>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {applications.map((single_app, index) => (
                                    <tr
                                      key={`${single_app.application_name.S}-${index}`}
                                    >
                                      <td className={classes}>
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-normal"
                                        >
                                          {single_app.application_name.S}
                                        </Typography>
                                      </td>
                                      <td className={classes}>
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-normal"
                                        >
                                          {single_app.application_id.S}
                                        </Typography>
                                      </td>
                                      <td className={classes}>
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-normal"
                                        >
                                          {
                                            single_app.recentHeartbeatTimestamp
                                              .S
                                          }
                                          &nbsp;
                                          <span className="text-slate-400 italic underline">
                                            {getTimeDifference(
                                              single_app
                                                .recentHeartbeatTimestamp.S
                                            ) ===
                                            "0 days, 0 hours, and 0 minutes ago"
                                              ? "Just Now"
                                              : getTimeDifference(
                                                  single_app
                                                    .recentHeartbeatTimestamp.S
                                                )}
                                          </span>
                                        </Typography>
                                      </td>
                                      <td className={classes}>
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-normal"
                                        >
                                          {single_app.workload_id.S}
                                        </Typography>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </Card>
                          </AccordionBody>
                        </Accordion>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
