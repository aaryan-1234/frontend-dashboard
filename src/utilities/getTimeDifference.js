import moment from "moment";

export function getTimeDifference(timestamp) {
    
    const parsedTimestamp = moment(timestamp);


    const datePart = parsedTimestamp.format("YYYY-MM-DD");
    const timePart = parsedTimestamp.format("HH:mm:ss");


    const now = moment();
    const diff = now.diff(parsedTimestamp);


    const duration = moment.duration(diff);
    const daysAgo = duration.days();
    const hoursAgo = duration.hours();
    const minutesAgo = duration.minutes();

    
    return `${daysAgo} days, ${hoursAgo} hours, and ${minutesAgo} minutes ago`;
  }



