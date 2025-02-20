module.exports = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().split("T")[0];
};
