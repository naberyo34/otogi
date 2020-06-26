import React from 'react';
import styled from 'styled-components';
import generateRandomId from 'services/generateRandomId';
import { Result } from 'interfaces/dice';

interface Props {
  isLocal?: boolean;
  result: Result;
}

const ResultWindow: React.FC<Props> = (props) => {
  const { isLocal, result } = props;

  return (
    <div>
      <div>
        {result.playerName} さんが {result.dice.type} を振りました:
      </div>
      <div>
        {Array.isArray(result.dice.single) ? (
          result.dice.single.map((single: number | string) => (
            <span key={generateRandomId(8)}>{single}</span>
          ))
        ) : (
          <span>{result.dice.single}</span>
        )}
      </div>
      <div>{result.dice.last}</div>
      {result.judgement && <div>判定: {result.judgement}</div>}
    </div>
  );
};

export default ResultWindow;
