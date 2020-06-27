import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setDiceCount, setDiceSize } from 'modules/realTimeDice/actions';

const Wrapper = styled.div`
  font-size: 2.4rem;

  span {
    padding: 0 8px;
  }
`;

const DiceSelect: React.FC = () => {
  const dispatch = useDispatch();

  const diceCounts = [1, 2, 3, 4, 5, 6];
  const diceSizes = [100, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2];

  // ダイスの個数(回数)を設定
  const handleChooseDiceCount = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (!value) return;
    const valueInt = parseInt(value, 10);

    dispatch(setDiceCount(valueInt));
  };

  // ダイスの面数を設定
  const handleChooseDiceSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (!value) return;

    const valueInt = parseInt(value, 10);
    dispatch(setDiceSize(valueInt));
  };

  return (
    <Wrapper>
      <select onChange={(e) => handleChooseDiceCount(e)}>
        {diceCounts.map((val) => (
          <option key={`diceCount-${val}`} value={val}>
            {val}
          </option>
        ))}
      </select>
      <span>D</span>
      <select onChange={(e) => handleChooseDiceSize(e)}>
        {diceSizes.map((val) => (
          <option key={`diceSize-${val}`} value={val}>
            {val}
          </option>
        ))}
      </select>
    </Wrapper>
  );
};

export default DiceSelect;
