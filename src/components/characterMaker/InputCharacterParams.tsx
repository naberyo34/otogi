import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from 'modules';
import { changeCharacterParams } from 'modules/characterMaker/actions';
import { ParamType } from 'interfaces/param';
import { paramsRange } from 'services/params';

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
    (state: State) => state.characterMaker.makingCharacter.foundationParams
  );

  /**
   * フォームの変更をStoreに反映する
   * @param e イベント
   * @param paramType パラメータの種類 (ex: 'str'など)
   */
  const handleChooseParams = (
    e: React.ChangeEvent<HTMLSelectElement>,
    paramType: ParamType
  ) => {
    const { value } = e.target;
    const valueInt = parseInt(value, 10);

    FoundationParams[paramType] = valueInt;
    dispatch(changeCharacterParams({ name: paramType, point: valueInt }));
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
        <option key={`${paramType}-${i}`} value={`${i}`}>
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

  const thArray: JSX.Element[] = [];
  const tdArray: JSX.Element[] = [];

  // 配列paramsRangeの情報を元に、JSXElementの配列を作成
  paramsRange.forEach((paramRange) => {
    const th = (
      <th key={`th-${paramRange.name}`}>{paramRange.name.toUpperCase()}</th>
    );
    const td = (
      <td key={`td-${paramRange.name}`}>
        {generateSelectBox(paramRange.name, paramRange.min, paramRange.max)}
      </td>
    );

    thArray.push(th);
    tdArray.push(td);
  });

  return (
    <Wrapper>
      <Title>能力値</Title>
      <Table>
        <thead>
          <tr>{thArray}</tr>
        </thead>
        <tbody>
          <tr>{tdArray}</tr>
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default InputCharacterParams;
