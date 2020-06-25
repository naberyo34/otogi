import { Dice } from 'interfaces/dice';

/**
 * 任意の面数、任意の個数でダイスロールを行う
 * @returns dice 結果の値
 * @params count ダイスを何個(何回)振るか ex: 1D100 なら 1
 * @params size ダイスの面数 ex: 1D100 なら 100
 */
const diceRoll = (count: number, size: number): Dice => {
  let roll = 0;
  const dice: Dice = {
    type: `${count}D${size}`,
    single: [],
    last: 0,
  };

  while (roll < count) {
    // 1以上size以下の乱数を生成
    const currentResult = 1 + Math.floor(Math.random() * size);

    // 今回出た目をsingle(単体の結果)にpushし、last(最終結果)に足す
    dice.single.push(currentResult);
    dice.last += currentResult;

    roll += 1;
  }

  return dice;
};

export default diceRoll;
