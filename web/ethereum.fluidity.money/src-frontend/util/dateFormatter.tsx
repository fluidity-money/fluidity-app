const dateFormatter = (unixDate: string) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const date = new Date(unixDate);
  // If blank input
  if (unixDate == "-" || !unixDate) {
    return "-"
  }
  // Seperate to manipulate for minute time
  let minutes: string = String(date.getMinutes());
  // Seperate to manipulate for 12-hour time
  let hours: number = date.getHours();
  // Used to track the time period of AM or PM
  let timePeriod = "AM";
  // If the time is a single digit, pad with a zero to make it multiple digits
  if (minutes.length == 1) {
    minutes = "0" + minutes;
  }
  // If over 12 hours has passed, enforce 12-hour-time
  if (hours > 12) {
    hours = hours - 12
    timePeriod = "PM";
  }

  const seconds = date.getSeconds();

  const date_ = date.getDate();

  const monthName = monthNames[date.getMonth()];

  const year = date.getFullYear();

  const hours_ = (hours < 10 ? "0" : "") + hours;

  const seconds_ = (seconds < 10 ? "0" : "") + seconds;

  // formates unix time stamp into "HH/MM/SS AM/PM, DD MonthName YYYY"
  return `${hours_}:${minutes}:${seconds_} ${timePeriod}, ${date_} ${monthName} ${year}`;
}

export default dateFormatter;
