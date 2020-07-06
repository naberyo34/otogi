import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from 'modules';
import { changeCharacterParams } from 'modules/characterMaker/actions';
import { ParamType } from 'interfaces/param';
import { paramsRange } from 'services/params';

const InputCharacterParams: React.FC = () => {
  const dispatch = useDispatch();
  const foundationParams = useSelector(
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
        value={foundationParams[paramType]}
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
    <>
      <table>
        <thead>
          <tr>{thArray}</tr>
        </thead>
        <tbody>
          <tr>{tdArray}</tr>
        </tbody>
      </table>
    </>
  );
};

export default InputCharacterParams;
