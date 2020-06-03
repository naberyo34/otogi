import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 32px;
`;

const Sound: React.FC = () => (
  <Wrapper>
    <p>ダイスの音量チェックはここからどうぞ</p>
    <audio src="./diceroll.wav" controls id="js-sound">
      <track default kind="captions" label="ダイスロールの効果音" />
    </audio>
  </Wrapper>
);

export default Sound;
