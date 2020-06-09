import diceRoll from './diceRoll';

// MEMO: 返ってくる型が正しいことはTSの機能で担保されているので、値が変な値でないことをテストすればいい……?
test('roll 1D100', () => {
  const result = diceRoll(1, 100);
  // ダイスタイプが'1D100'であることをテスト
  expect(result.type).toBe('1D100');
  // 振ったのが1個であることをテスト
  expect(result.single.length).toBe(1);
  // 結果が1以上100以下であることをテスト
  expect(result.last).toBeGreaterThan(1);
  expect(result.last).toBeLessThanOrEqual(100);
});

// MEMO: どの程度のテストケースを用意すればよいのかが謎
test('roll 3D6', () => {
  const result = diceRoll(3, 6);
  // ダイスタイプが'3D6'であることをテスト
  expect(result.type).toBe('3D6');
  // 振ったのが3個であることをテスト
  expect(result.single.length).toBe(3);
  // 結果が3以上18以下であることをテスト
  expect(result.last).toBeGreaterThan(3);
  expect(result.last).toBeLessThanOrEqual(18);
});
