import React from 'react';
import styled from 'styled-components';
import RealTimeDice from 'components/realTimeDice';
import PartyViewer from 'components/partyViewer';

const Wrapper = styled.div`
  display: flex;
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
