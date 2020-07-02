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
    <div>
      <p>あなたの名前は:</p>
      <CharacterSelect characters={characters} />
      <PartySelect
        characters={characters}
        partyCharacters={partyCharacters}
        selectedCharacter={selectedCharacter}
      />
      <SkillSelect selectedSkillView={selectedSkillView} />
      {myCharacterData && (
        <div>
          <p>{myCharacterData.name}</p>
          <ParamsTable character={myCharacterData} target={myCharacter} />
          <SkillsTable
            character={myCharacterData}
            selectedSkillView={selectedSkillView}
          />
        </div>
      )}
      {partyCharactersData.map((partyCharacterData) => (
        <div key={`${partyCharacterData.name}-status`}>
          <p>{partyCharacterData.name}</p>
          <ParamsTable character={partyCharacterData} />
          <SkillsTable
            character={partyCharacterData}
            selectedSkillView={selectedSkillView}
          />
        </div>
      ))}
    </div>
  );
};

export default PartyViewer;
