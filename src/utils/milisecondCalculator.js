module.exports = (time) => {
  if (!time || typeof time !== "string") {
    throw new Error("Invalid time input. Please provide a valid string.");
  }

  // Regular Expression để tìm số và đơn vị thời gian
  const regex = /(\d+)([a-zA-Z])/g;
  const matches = [...time.matchAll(regex)];

  // Định nghĩa giá trị milliseconds cho từng đơn vị thời gian
  const timeUnits = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000, // Giờ -> milliseconds
    m: 60 * 1000, // Phút -> milliseconds
    s: 1000, // Giây -> milliseconds
    ms: 1, // Milliseconds -> milliseconds
  };

  // Tính toán tổng thời gian
  let totalMilliseconds = 0;

  matches.forEach(([, value, unit]) => {
    if (timeUnits[unit]) {
      totalMilliseconds += parseInt(value, 10) * timeUnits[unit];
    } else {
      throw new Error(`Unsupported time unit: ${unit}`);
    }
  });

  return totalMilliseconds;
};
