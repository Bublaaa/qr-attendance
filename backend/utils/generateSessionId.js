export const generateSessionId = () => {
  const now = new Date();

  const todayStr = now.toISOString().split("T")[0];

  const sessionStart = new Date();
  sessionStart.setHours(6, 0, 0, 0);

  const sessionEnd = new Date();
  sessionEnd.setHours(16, 0, 0, 0);

  if (now >= sessionEnd) {
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    return `${tomorrow.toISOString().split("T")[0]}-session`;
  } else {
    return `${todayStr}-session`;
  }
};
