import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 32px;
`;

const Sound: React.FC = () => (
  <Wrapper>
    <p>ダイスの音量チェックはここからどうぞ</p>
    {/* eslint-disable-next-line */}
    <audio src="./diceroll.wav" controls id="js-sound" />
  </Wrapper>
);

export default Sound;