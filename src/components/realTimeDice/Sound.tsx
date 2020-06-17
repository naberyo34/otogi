import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 32px;
`;

const Description = styled.p`
  text-align: center;
`;

const Audio = styled.audio`
  width: 100%;
`;

const Sound: React.FC = () => (
  <Wrapper>
    <Description>DICE SOUND</Description>
    {/* eslint-disable-next-line */}
    <Audio src="./diceroll.wav" controls id="js-sound" />
  </Wrapper>
);

export default Sound;
