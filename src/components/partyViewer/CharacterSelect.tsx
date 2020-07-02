import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setMyCharacter } from 'modules/partyViewer/actions';
import Character from 'interfaces/character';

interface Props {
  characters: Character[];
}

const CharacterSelect: React.FC<Props> = (props) => {
  const { characters } = props;
  const dispatch = useDispatch();

  // 選択したキャラクターをマイキャラクターとして設定
  const handleSetMyCharacter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    dispatch(setMyCharacter(value));
  };

  return (
    <select onChange={(e) => handleSetMyCharacter(e)}>
      <option value="">選択してください</option>
      {characters.map((character) => (
        <option key={`$myCharacter-${character.name}`} value={character.name}>
          {character.name}
        </option>
      ))}
    </select>
  );
};

export default CharacterSelect;
