import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import abilities, { ParamType } from '../../services/abilities';
import { setCharacterParams } from '../../modules/characterMaker/actions';
import { State } from '../../modules';

const Wrapper = styled.section`
  margin-top: 32px;
`;

const Title = styled.h3`
  margin-top: 16px;
  font-size: 1.6rem;
`;

const Table = styled.table`
  margin-top: 8px;
  font-size: 1.2rem;
  border: 2px solid black;
  thead {
    color: white;
    background: black;
  }
  th {
    width: 60px;
    padding: 4px;
    border: 2px solid black;
  }
  td {
    padding: 4px;
    border: 2px solid black;
  }
  input {
    width: 60px;
  }
`;

const InputCharacterParams: React.FC = () => {
  const dispatch = useDispatch();
  const FoundationParams = useSelector(
    (state: State) => state.characterMaker.character.foundationParams
  );
  // 値を変更したときにStoreを更新する
  const handleChooseParams = (
    e: React.ChangeEvent<HTMLSelectElement>,
    paramType: ParamType
  ) => {
    const { value } = e.target;
    const valueInt = parseInt(value, 10);

    FoundationParams[paramType] = valueInt;

    dispatch(setCharacterParams(FoundationParams));
  };

  /**
   * 任意の最小、最大値のセレクトボックスを生成
   * @param paramType 何のアビリティに対応している数値なのか(ex: 'STR'などの文字列)
   * @param min 最小値 (ex: 3D6で決まるパラメータなら3)
   * @param max 最大値 (ex: 3D6で決まるパラメータなら18)
   * @return selectとoptionsのDOM要素
   */
  const generateSelectBox = (
    paramType: ParamType,
    min: number,
    max: number
  ) => {
    const options = [];
    let i = min;

    while (i <= max) {
      options.push(
        <option key={`${i}`} value={`${i}`}>
          {i}
        </option>
      );
      i += 1;
    }

    return (
      <select
        key={`select-${paramType}`}
        onChange={(e) => handleChooseParams(e, paramType)}
      >
        {options}
      </select>
    );
  };

  const tableHead: JSX.Element[] = [];
  const tableData: JSX.Element[] = [];

  // 配列abilitiesの情報を元に、JSXElementの配列を作成
  abilities.forEach((ability) => {
    const thElement = (
      <th key={`th-${ability.name}`}>{ability.name.toUpperCase()}</th>
    );
    const tdElement = (
      <td key={`td-${ability.name}`}>
        {generateSelectBox(ability.name, ability.min, ability.max)}
      </td>
    );

    tableHead.push(thElement);
    tableData.push(tdElement);
  });

  return (
    <Wrapper>
      <Title>能力値</Title>
      <Table>
        <thead>
          <tr>{tableHead}</tr>
        </thead>
        <tbody>
          <tr>{tableData}</tr>
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default InputCharacterParams;
