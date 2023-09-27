import moment from "moment";


const Row = ({ data }) => {
  function getTimeDifference(timestamp) {
    // Parse the given timestamp
    const parsedTimestamp = moment(timestamp);

    // Separate the date and time
    const datePart = parsedTimestamp.format("YYYY-MM-DD");
    const timePart = parsedTimestamp.format("HH:mm:ss");

    // Calculate the time difference from now
    const now = moment();
    const diff = now.diff(parsedTimestamp);

    // Calculate days, hours, and minutes
    const duration = moment.duration(diff);
    const daysAgo = duration.days();
    const hoursAgo = duration.hours();
    const minutesAgo = duration.minutes();

    // Format the result
    return `${daysAgo} days, ${hoursAgo} hours, and ${minutesAgo} minutes ago`;
  }

  return (
    <>
      <div className="hover:bg-gray-50 cursor-pointer">
        <div className="flex justify-evenly px-6 py-4 font-normal text-gray-900">
          <div className="text-lg">
            <div className="font-medium text-gray-700">{data?.tenant_id}</div>
          </div>

          <div className="">
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-sm font-semibold text-black">
              {data.email}
            </span>
          </div>

          <div className="px-5">
            {data.applications?.map((item) => {
              return (
                <>
                  <p
                    key={item?.application_name?.S}
                    className=" gap-1 rounded px-2 py-1 text-base font-semibold text-black"
                  >
                    <span>{item.application_name?.S} </span>
                  </p>
                </>
              );
            })}
          </div>

          <div className="px-5">
            {data.applications?.map((item) => {
              return (
                <p
                  key={item?.application_name?.S}
                  className="gap-1 rounded  py-1 text-base text-left font-semibold text-black"
                >
                  <span>
                    {item.workloadSet?.L[0]?.M.recentHeartbeatTimestamp?.S ===
                    undefined ? (
                      "---"
                    ) : (
                      <>
                        <span>
                          {moment(
                            item.workloadSet?.L[0]?.M.recentHeartbeatTimestamp
                              ?.S
                          ).format("YYYY-MM-DD")}
                        </span>{" "}
                        &nbsp;
                        <span className="text-gray-500">
                          {moment(
                            item.workloadSet?.L[0]?.M.recentHeartbeatTimestamp
                              ?.S
                          ).format("HH:mm:ss")}
                        </span>{" "}
                        &nbsp;
                        <span className="text-gray-500">
                          {getTimeDifference(
                            item.workloadSet?.L[0]?.M.recentHeartbeatTimestamp
                              ?.S
                          )}
                        </span>
                      </>
                    )}
                  </span>
                </p>
              );
            })}
          </div>
        </div>

        
      </div>
    </>
  );
};

export default Row;
