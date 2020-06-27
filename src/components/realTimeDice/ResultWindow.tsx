import React from 'react';
import styled from 'styled-components';
import generateRandomId from 'services/generateRandomId';
import { Result } from 'interfaces/dice';

interface StyledProps {
  isLocal?: boolean;
}

interface Props {
  isLocal?: boolean;
  result: Result;
}

const Wrapper = styled.div<StyledProps>`
  padding: 32px;
  margin-top: 16px;
  color: ${(props) => (props.isLocal ? '#fff' : 'inherit')};
  background: ${(props) => (props.isLocal ? '#333' : 'inherit')};
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

const ResultWindow: React.FC<Props> = (props) => {
  const { isLocal, result } = props;

  return (
    <Wrapper isLocal={isLocal}>
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
      {result.judgement && <span>判定: {result.judgement}</span>}
    </Wrapper>
  );
};

export default ResultWindow;
