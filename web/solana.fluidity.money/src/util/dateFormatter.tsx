import { padNumStart } from "./numberPadder";

/**
 * Returns formatted client time format "HH/MM/SS AM/PM, DD MonthName YYYY"
 * @param unixDate Arbitrary date string
 * @returns 
 */
const dateFormatter = (unixDate: string) => {
  // If blank input
  if (unixDate === "-" || !unixDate) {
    return "-"
  }

  const date = new Date(unixDate);
  
  // Get 12 Hour time format
  // If the time is a single digit, pad with a zero to make it multiple digits
  const hours12Format = padNumStart(date.getHours() % 12, 2, '0');
  const hours = hours12Format == "00" ? "12" : hours12Format;
  const minutes = padNumStart(date.getMinutes(), 2, '0')
  const seconds = padNumStart(date.getSeconds(), 2, '0');
  
  // Used to track the time period of AM or PM
  const timePeriod = date.getHours() < 12 ? 'AM' : 'PM'

  const date_ = date.getDate();

  const monthName = date.toLocaleString('default', {month: 'long'});

  const year = date.getFullYear();

  // formats unix time stamp into "HH/MM/SS AM/PM, DD MonthName YYYY"
  return `${hours}:${minutes}:${seconds} ${timePeriod}, ${date_} ${monthName} ${year}`;
}

export default dateFormatter;
