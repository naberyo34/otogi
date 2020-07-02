import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  setPartyCharacters,
  changePartyCharacter,
} from 'modules/partyViewer/actions';
import Character from 'interfaces/character';

interface Props {
  characters: Character[];
  partyCharacters: string[];
  selectedCharacter: string;
}

const PartySelect: React.FC<Props> = (props) => {
  const { characters, partyCharacters, selectedCharacter } = props;
  const dispatch = useDispatch();

  // パーティ追加対象のキャラクターを選択
  const handleChangePartyCharacter = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    dispatch(changePartyCharacter(value));
  };

  // 選択したキャラクターをパーティに追加
  const handleSetPartyCharacters = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const addedParty = [...partyCharacters, selectedCharacter];
    dispatch(setPartyCharacters(addedParty));
  };

  return (
    <form onSubmit={(e) => handleSetPartyCharacters(e)}>
      <p>
        パーティに追加
        (自分以外のキャラクターの情報が閲覧できます。自分だけが見えています):
      </p>
      <select onChange={(e) => handleChangePartyCharacter(e)}>
        <option value="">選択してください</option>
        {characters.map((character) => (
          <option
            key={`$partyCharacter-${character.name}`}
            value={character.name}
          >
            {character.name}
          </option>
        ))}
      </select>
      <button type="submit">追加</button>
    </form>
  );
};

export default PartySelect;
