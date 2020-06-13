export interface DiceResult {
  type: string;
  single: number[];
  last: number;
}

export interface HiddenDiceResult {
  type: '何か';
  single: '????';
  last: '????';
}

/**
 * 任意の面数、任意の個数でダイスロールを行う
 * @returns diceResult 結果の値
 * @params count ダイスを何個(何回)振るか ex: 1D100 なら 1
 * @params size ダイスの面数 ex: 1D100 なら 100
 */
const diceRoll = (count: number, size: number): DiceResult => {
  let roll = 0;
  const diceResult: DiceResult = {
    type: `${count}D${size}`,
    single: [],
    last: 0,
  };

  while (roll < count) {
    // 1以上size以下の乱数を生成
    const currentResult = 1 + Math.floor(Math.random() * size);

    // 今回出た目をsingle(単体の結果)にpushし、last(最終結果)に足す
    diceResult.single.push(currentResult);
    diceResult.last += currentResult;

    roll += 1;
  }

  return diceResult;
};

export default diceRoll;
