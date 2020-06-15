import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import abilities from '../../services/abilities';
import { editCharacterParams } from '../../modules/characterMaker/actions';

const Wrapper = styled.section`
  margin-top: 32px;
`;

const InputCharacterParams: React.FC = () => {
  const dispatch = useDispatch();
  // 値を変更したときにStoreを更新する
  const handleChooseParams = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetNum = e.target.value;
    // MEMO: anyつけないと下記の'計算されたプロパティ名'が使えなくなる
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Object_initializer
    const targetLabel: any = e.target.getAttribute('data-js-label');
    const changeParam = {
      [targetLabel]: parseInt(targetNum, 10),
    };

    dispatch(editCharacterParams(changeParam));
  };

  /**
   * 任意の最小、最大値のセレクトボックスを生成
   * @param label 何のアビリティに対応している数値なのか(ex: 'STR'などの文字列)
   * @param min 最小値 (ex: 3D6で決まるパラメータなら3)
   * @param max 最大値 (ex: 3D6で決まるパラメータなら18)
   * @return selectとoptionsのDOM要素
   */
  const generateSelectBox = (label: string, min: number, max: number) => {
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
        key={`select-${label}`}
        data-js-label={label}
        onChange={(e) => handleChooseParams(e)}
      >
        {options}
      </select>
    );
  };

  const tableHead: JSX.Element[] = [];
  const tableData: JSX.Element[] = [];

  // 配列abilitiesの情報を元に、JSXElementの配列を作成
  abilities.forEach((ability) => {
    const thElement = <th key={`th-${ability.name}`}>{ability.name}</th>;
    const tdElement = (
      <td key={`td-${ability.name}`}>
        {generateSelectBox(
          ability.name.toLowerCase(),
          ability.min,
          ability.max
        )}
      </td>
    );

    tableHead.push(thElement);
    tableData.push(tdElement);
  });

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th />
            {tableHead}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>能力値</th>
            {tableData}
          </tr>
        </tbody>
      </table>
    </Wrapper>
  );
};

export default InputCharacterParams;
