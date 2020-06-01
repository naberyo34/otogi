const diceRoll = (): number => {
  // 1以上100以下の乱数を生成する
  // Math.randomは0~1の小数を生成し、Math.floorは小数点以下を全て切り捨てる
  const result = 1 + Math.floor(Math.random() * 100);
  return result;
}

export default diceRoll;