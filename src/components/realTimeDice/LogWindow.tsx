import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from 'modules/index';
import { toggleDiceLog } from 'modules/realTimeDice/actions';
import { Result } from 'interfaces/dice';

interface StyledProps {
  isOpen: boolean;
}

const Wrapper = styled.section<StyledProps>`
  position: fixed;
  bottom: ${(props) => (props.isOpen ? '0' : '-312px')};
  left: 0;
  width: 100vw;
  font-size: 1.6rem;
  color: #fff;
  transition: bottom 0.24s;

  button {
    width: 128px;
    height: 32px;
    margin-left: 8px;
    background: rgba(0, 0, 0, 0.64);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`;

const TimeLine = styled.div`
  display: flex;
  align-items: center;
  height: 320px;
  background: rgba(0, 0, 0, 0.64);
`;

const TimeLineInner = styled.div`
  width: 100%;
  height: 288px;
  padding: 0 16px;
  overflow-y: scroll;

  p:not(:first-child) {
    margin-top: 1em;
  }
`;

const TimeStamp = styled.span`
  font-size: 1.2rem;
`;

const Em = styled.span`
  font-weight: bold;
  color: #f093fb;
`;

interface Props {
  diceLogs: Result[];
}

const LogWindow: React.FC<Props> = (props) => {
  const { diceLogs } = props;
  const dispatch = useDispatch();
  const handleToggleLog = () => {
    dispatch(toggleDiceLog());
  };
  const isOpen = useSelector((state: State) => state.realTimeDice.diceLog);

  return (
    <Wrapper isOpen={isOpen}>
      <button type="button" onClick={handleToggleLog}>
        ログ
      </button>
      <TimeLine>
        <TimeLineInner>
          {diceLogs.map((result: Result) => (
            <p key={`log-${result.timestamp}`}>
              <TimeStamp>[ {result.timestamp} ]</TimeStamp>
              <br />
              <Em>{result.playerName} </Em>さんが
              <Em> {result.dice.type} </Em>で<Em> {result.dice.last} </Em>
              を出しました。
              {result.judgement && result.judgement !== '????' && (
                <>
                  <Em> {result.judgement} </Em>です。
                </>
              )}
            </p>
          ))}
        </TimeLineInner>
      </TimeLine>
    </Wrapper>
  );
};

export default LogWindow;
