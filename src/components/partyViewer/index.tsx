import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from 'modules';
import Character from 'interfaces/character';
import CharacterSelect from 'components/partyViewer/CharacterSelect';
import PartySelect from 'components/partyViewer/PartySelect';
import SkillSelect from 'components/partyViewer/SkillSelect';
import ParamsTable from 'components/partyViewer/ParamsTable';
import SkillsTable from 'components/partyViewer/SkillsTable';

const Wrapper = styled.div`
  width: calc(100vw - 368px);
  height: calc(100vh - 32px);
  margin-left: 16px;
  overflow-y: scroll;
  font-size: 1.2rem;
`;

const MyStatus = styled.div`
  width: 100%;
  padding: 16px;
  overflow-x: scroll;
  background: #fff;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const PartyCharacterName = styled.p`
  padding-left: 8px;
  margin-top: 8px;
  border-left: 4px solid;
  border-image: linear-gradient(#f093fb, #f5576c);
  border-image-slice: 1;
`;

const PartyStatus = styled.div`
  width: 100%;
  padding: 16px;
  margin-top: 8px;
  overflow-x: scroll;
  background: #fff;
  border-radius: 8px;
`;

const PartyViewer: React.FC = () => {
  const characters = useSelector(
    (state: State) => state.firebaseReducer.characters
  );
  const {
    myCharacter,
    selectedCharacter,
    partyCharacters,
    selectedSkillView,
  } = useSelector((state: State) => state.partyViewer);

  /**
   * partyCharacters(String[])から実データ(Character[])を生成
   * @returns パーティメンバーの情報が格納された配列
   */
  const findPartyCharactersData = (): Character[] => {
    const targetArray: Character[] = [];

    partyCharacters.forEach((partyCharacter) => {
      const target = characters.find(
        (character) => character.name === partyCharacter
      );

      if (target) targetArray.push(target);
    });

    return targetArray;
  };

  // stateから検索したキャラクターの実データ これをレンダリングに使う
  const myCharacterData = characters.find(
    (character) => character.name === myCharacter
  );
  // 同上
  const partyCharactersData: Character[] = findPartyCharactersData();

  return (
    <Wrapper>
      <CharacterSelect characters={characters} />
      <SkillSelect selectedSkillView={selectedSkillView} />
      {myCharacterData && (
        <MyStatus>
          <ParamsTable character={myCharacterData} target={myCharacter} />
          <SkillsTable
            character={myCharacterData}
            selectedSkillView={selectedSkillView}
          />
        </MyStatus>
      )}
      <PartySelect
        characters={characters}
        partyCharacters={partyCharacters}
        selectedCharacter={selectedCharacter}
      />
      {partyCharactersData.map((partyCharacterData) => (
        <>
          <PartyCharacterName>{partyCharacterData.name}</PartyCharacterName>
          <PartyStatus key={`${partyCharacterData.name}-status`}>
            <ParamsTable character={partyCharacterData} />
            <SkillsTable
              character={partyCharacterData}
              selectedSkillView={selectedSkillView}
            />
          </PartyStatus>
        </>
      ))}
    </Wrapper>
  );
};

export default PartyViewer;
