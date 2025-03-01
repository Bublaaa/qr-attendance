export const generateSessionId = () => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const sessionStart = new Date(`${today}T06:00:00.000Z`);
  const sessionEnd = new Date(`${today}T16:00:00.000Z`);

  if (now >= sessionEnd) {
    return `${tomorrowStr}-session`;
  } else {
    return `${today}-session`;
  }
};
