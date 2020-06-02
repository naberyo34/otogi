/**
 * Dateを受け取って表示用の文字列として返す
 * @param date Date
 * @returns 時刻を表す文字列
 */
const formatDate = (date: Date): string => {
  const dateStr = {
    year: date.getFullYear().toString().padStart(4, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    day: date.getDate().toString().padStart(2, '0'),
    hour: date.getHours().toString().padStart(2, '0'),
    minutes: date.getMinutes().toString().padStart(2, '0'),
    seconds: date.getSeconds().toString().padStart(2, '0'),
  };

  return `${dateStr.year}/${dateStr.month}/${dateStr.day} ${dateStr.hour}:${dateStr.minutes}:${dateStr.seconds}`;
};

export default formatDate;
