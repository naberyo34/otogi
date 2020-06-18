import React from 'react';
import styled from 'styled-components';
import RealTimeDice from '../components/realTimeDice';
import PartyViewer from '../components/partyViewer';

const Wrapper = styled.section`
  display: flex;
  min-width: 960px;
`;

const SessionRoom: React.FC = () => {
  return (
    <Wrapper>
      <RealTimeDice />
      <PartyViewer />
    </Wrapper>
  );
};

export default SessionRoom;
