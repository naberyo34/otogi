import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setMyCharacter } from 'modules/partyViewer/actions';
import Character from 'interfaces/character';

const Wrapper = styled.div`
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

const InputArea = styled.div`
  margin-top: 16px;
`;

const Input = styled.input`
  display: block;
  width: 240px;
`;

const Select = styled.select`
  width: 240px;
  padding: 0.75em 1em;
  margin-top: 8px;
  color: #fff;
  background: #444;
`;

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
    <Wrapper>
      <Title>MY CHARACTER</Title>
      <InputArea>
        <Input
          type="text"
          onChange={(e) => handleSetMyCharacter(e)}
          placeholder="自由入力 (ダイスのみ利用する場合)"
        />
        <Select onChange={(e) => handleSetMyCharacter(e)}>
          <option value="">DBから選ぶ (ステータスも閲覧する)</option>
          {characters.map((character) => (
            <option
              key={`$myCharacter-${character.name}`}
              value={character.name}
            >
              {character.name}
            </option>
          ))}
        </Select>
      </InputArea>
    </Wrapper>
  );
};

export default CharacterSelect;
