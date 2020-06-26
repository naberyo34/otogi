import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div``;

const Audio = styled.audio`
  width: 100%;
`;

const Sound: React.FC = () => (
  <Wrapper>
    {/* eslint-disable-next-line */}
    <Audio src="./diceroll.wav" controls id="js-sound" />
  </Wrapper>
);

export default Sound;
