import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateCharacter } from 'modules/firebase/actions';
import Character from 'interfaces/character';
import { AllParams } from 'interfaces/param';
import { allParamCategories } from 'services/params';

interface Props {
  character: Character;
  target?: string;
}

const ParamsTable: React.FC<Props> = (props) => {
  const { character, target } = props;
  const dispatch = useDispatch();

  const characterAllParams: AllParams = {
    hp: character.hp,
    maxhp: Math.round(
      (character.foundationParams.con + character.foundationParams.siz) / 2
    ),
    mp: character.mp,
    maxmp: character.foundationParams.pow,
    san: character.san,
    maxsan: character.foundationParams.pow * 5,
    madness: character.foundationParams.pow * 4,
    str: character.foundationParams.str,
    con: character.foundationParams.con,
    pow: character.foundationParams.pow,
    dex: character.foundationParams.dex,
    app: character.foundationParams.app,
    siz: character.foundationParams.siz,
    int: character.foundationParams.int,
    edu: character.foundationParams.edu,
    luck: character.foundationParams.pow * 5,
    idea: character.foundationParams.int * 5,
    know: character.foundationParams.edu * 5,
  };

  /**
   * 可変パラメータの値変更をFirestoreに反映する
   * @param e イベント
   * @param paramType 対象のパラメータ(ex: 'hp' とか)
   */
  const handleChangeCurrentParam = (
    e: React.ChangeEvent<HTMLInputElement>,
    paramType: 'hp' | 'mp' | 'san'
  ) => {
    const { value } = e.target;
    let valueInt = parseInt(value, 10);

    // valueIntがNaNのときは0として扱う
    if (!valueInt) valueInt = 0;
    // 0未満、100以上の値は弾く
    if (valueInt < 0 || valueInt > 99) {
      alert('入力値が小さすぎるか大きすぎます。0 ~ 99 が入力できます');
      return;
    }

    // マイキャラクターが見つからない(想定外)場合は致命的なエラーを返す
    if (!target) {
      alert('FATAL ERR: マイキャラクターが見つかりません');
      return;
    }

    // Saga経由でFirestoreを更新
    dispatch(
      updateCharacter.start({
        target,
        key: paramType,
        value: valueInt,
      })
    );
  };

  return (
    <table>
      <thead>
        <tr>
          {allParamCategories.map((paramCategory) => (
            <th key={`${character.name}-${paramCategory.type}`}>
              {paramCategory.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {allParamCategories.map((paramCategory) => {
            switch (paramCategory.type) {
              case 'hp':
              case 'mp':
              case 'san': {
                const paramType = paramCategory.type as 'hp' | 'mp' | 'san';
                const targetKey = {
                  current: paramCategory.type,
                  max: `max${paramCategory.type}`,
                };
                const current = characterAllParams[targetKey.current];
                const max = characterAllParams[targetKey.max];
                const isSan = paramType === 'san';

                return (
                  <td key={`${character.name}-${paramType}-point`}>
                    {target ? (
                      <input
                        type="number"
                        min={0}
                        max={isSan ? 99 : max}
                        value={current === 0 ? '' : current}
                        onChange={(e) => handleChangeCurrentParam(e, paramType)}
                      />
                    ) : (
                      <>{current}</>
                    )}{' '}
                    / {max}
                    {isSan && (
                      <>
                        <br />
                        不定: {characterAllParams.madness}
                      </>
                    )}
                  </td>
                );
              }
              default: {
                return (
                  <td key={`${character.name}-${paramCategory.type}-point`}>
                    {characterAllParams[paramCategory.type]}
                  </td>
                );
              }
            }
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default ParamsTable;
