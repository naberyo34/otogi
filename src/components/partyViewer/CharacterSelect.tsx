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
  const handleSetMyCharacter = (e: any) => {
    const { value } = e.target;
    dispatch(setMyCharacter(value));
  };

  return (
    <>
      <p>自由入力はここから (一時的措置)</p>
      <input type="text" onChange={(e) => handleSetMyCharacter(e)} />
      <select onChange={(e) => handleSetMyCharacter(e)}>
        <option value="">DBから選ぶ場合はこちら</option>
        {characters.map((character) => (
          <option key={`$myCharacter-${character.name}`} value={character.name}>
            {character.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default CharacterSelect;
