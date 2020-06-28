import React from 'react';
import styled from 'styled-components';
import generateRandomId from 'services/generateRandomId';
import { Result, RollingType } from 'interfaces/dice';

interface StyledProps {
  rollingType?: RollingType;
  isLocal: boolean;
}

interface Props {
  result: Result;
  rollingType: RollingType;
  isLocal?: boolean;
}

const Wrapper = styled.div<StyledProps>`
  padding: 32px;
  margin-top: 16px;
  color: ${(props) => (props.isLocal ? '#fff' : 'inherit')};
  background: ${(props) => (props.isLocal ? '#333' : 'inherit')};
`;

const Inner = styled.div<StyledProps>`
  opacity: ${(props) => {
    const global = ['global', 'hiding'];
    const local = ['local', 'hiding'];
    if (!props.isLocal && global.includes(props.rollingType as string))
      return '0';
    if (props.isLocal && local.includes(props.rollingType as string))
      return '0';
    return '1';
  }};
  transition: opacity 0.1s;
`;

const Message = styled.p`
  font-size: 1.6rem;
`;

const Single = styled.div`
  margin-top: 8px;
  font-size: 1.6rem;

  span:not(:first-child) {
    margin-left: 1em;
  }
`;

const Last = styled.div`
  margin-top: 8px;
  font-size: 8rem;
`;

const Judge = styled.span`
  display: inline-block;
  margin-top: 8px;
  font-size: 1.6rem;
`;

const ResultWindow: React.FC<Props> = (props) => {
  const { result, rollingType, isLocal } = props;

  return (
    <Wrapper isLocal={Boolean(isLocal)}>
      <Inner rollingType={rollingType} isLocal={Boolean(isLocal)}>
        <Message>
          {result.playerName} さんが {isLocal && ' 非公開で'}
          <br />
          {result.dice.type} を振りました:
        </Message>
        <Single>
          {Array.isArray(result.dice.single) ? (
            result.dice.single.map((single: number | string) => (
              <span key={generateRandomId(8)}>{single}</span>
            ))
          ) : (
            <span>{result.dice.single}</span>
          )}
        </Single>
        <Last>
          <span>{result.dice.last}</span>
        </Last>
        {result.judgement && <Judge>判定: {result.judgement}</Judge>}
      </Inner>
    </Wrapper>
  );
};

export default ResultWindow;
