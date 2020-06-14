/**
 * 任意の文字数でランダム英数字の文字列を生成
 * @param length 文字数
 * @return ランダム英数字の文字列
 */

const generateRandomId = (length: number): string => {
  let i = 0;
  let randomId = '';
  const char = 'abcdefghijklmnopkrstuvwxyz0123456789';

  while (i < length) {
    randomId += char[Math.floor(Math.random() * char.length)];
    i += 1;
  }
  return randomId;
};

export default generateRandomId;
