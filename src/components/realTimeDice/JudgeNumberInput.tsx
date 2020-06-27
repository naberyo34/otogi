import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setJudgementNumber } from 'modules/realTimeDice/actions';

const Wrapper = styled.div`
  margin-top: 8px;
  font-size: 1.2rem;
`;

const JudgeNumberInput: React.FC = () => {
  const dispatch = useDispatch();

  // 成功判定値を設定
  const handleInputSucessNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) return;

    const judgementNumberDOM: HTMLInputElement | null = document.querySelector(
      '#js-judgementNumber'
    );
    const valueInt = parseInt(value, 10);

    // 1未満、100以上の値は弾く
    if (valueInt < 1 || valueInt > 99) {
      if (judgementNumberDOM) judgementNumberDOM.value = '';
      dispatch(setJudgementNumber(0));
      alert('入力値が小さすぎるか大きすぎます。1 ~ 99 が入力できます');
      return;
    }

    dispatch(setJudgementNumber(valueInt));
  };

  return (
    <Wrapper>
      <span>成功判定値(1 〜 99): </span>
      <input
        id="js-judgementNumber"
        type="number"
        min={1}
        max={99}
        onChange={(e) => handleInputSucessNum(e)}
      />
    </Wrapper>
  );
};

export default JudgeNumberInput;
