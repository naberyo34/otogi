import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  setPartyCharacters,
  changePartyCharacter,
} from 'modules/partyViewer/actions';
import Character from 'interfaces/character';

const Form = styled.form`
  margin-top: 16px;

  &:hover {
    h2 {
      color: #ddd;
    }
  }
`;

const Title = styled.h2`
  font-family: 'Fredoka One', cursive;
  font-size: 6.4rem;
  color: #eee;
  transition: color 0.2s;
`;

const Select = styled.select`
  width: 240px;
  padding: 0.75em 1em;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 0.75em 1em;
  margin-left: 8px;
  color: #fff;
  background: #444;
`;

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
    <Form onSubmit={(e) => handleSetPartyCharacters(e)}>
      <Title>PARTY</Title>
      <Select onChange={(e) => handleChangePartyCharacter(e)}>
        <option value="">選択してください</option>
        {characters.map((character) => (
          <option
            key={`$partyCharacter-${character.name}`}
            value={character.name}
          >
            {character.name}
          </option>
        ))}
      </Select>
      <Button type="submit">追加</Button>
    </Form>
  );
};

export default PartySelect;
