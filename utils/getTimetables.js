const { Timetable } = require("../models");

module.exports = async () => {
  try {
    // Days of the week
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Initialize schedule object
    const schedule = {};

    // Fetch all schedules from the database
    const allTimetables = await Timetable.findAll();

    // Organize schedules by time slots
    for (const entry of allTimetables) {
      // If time slot does not exist, create it
      if (!schedule[entry.time]) {
        schedule[entry.time] = {};
      }

      // Fetch the subject for the timetable entry
      if (entry.subject !== "break") {
        const subject = await require("./getSubject")(entry.subject);
        entry.subject = subject.shortName;
      }

      // Assign the subject to the correct day and time slot
      schedule[entry.time][entry.day] = entry.subject;
    }

    // Sort the time slots in ascending order (AM to PM)
    const sortedSchedule = Object.keys(schedule)
      .sort((a, b) => {
        // Convert time to 24-hour format to compare
        const convertTime = (timeStr) => {
          const [hourMinute, period] = timeStr.split(" ");
          const [hours, minutes] = hourMinute.split(":");
          let hour = parseInt(hours);
          if (period === "PM" && hour !== 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;
          return hour * 60 + parseInt(minutes);
        };

        return convertTime(a) - convertTime(b);
      })
      .reduce((sortedObj, timeSlot) => {
        sortedObj[timeSlot] = schedule[timeSlot];
        return sortedObj;
      }, {});

    console.log(sortedSchedule);
    return { days, schedule: sortedSchedule };
  } catch (error) {
    console.error("ERROR TRYING TO GET TIMETABLES");
    console.error(error);
    return {};
  }
};
