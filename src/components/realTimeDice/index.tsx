import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { diceLogsQuery } from 'services/firebase';
import diceRoll from 'services/diceRoll';
import formatDate from 'services/formatDate';
import { State } from 'modules/index';
import {
  setJudgementNumber,
  setRollingType,
  setGlobalResult,
  setLocalResult,
} from 'modules/realTimeDice/actions';
import { addDiceLog } from 'modules/firebase/actions';
import { Result, HiddenDice } from 'interfaces/dice';
import DiceSelect from 'components/realTimeDice/DiceSelect';
import JudgeNumberInput from 'components/realTimeDice/JudgeNumberInput';
import ResultWindow from 'components/realTimeDice/ResultWindow';
import Sound from 'components/realTimeDice/Sound';
import LogWindow from 'components/realTimeDice/LogWindow';

const Wrapper = styled.section`
  width: 320px;
  height: calc(100vh - 32px);
  padding: 32px;
  overflow-y: scroll;
  background: #fff;
  border-radius: 8px;
`;

const RealTimeDice: React.FC = () => {
  const dispatch = useDispatch();
  const myCharacter = useSelector(
    (state: State) => state.partyViewer.myCharacter
  );
  const {
    diceCount,
    diceSize,
    judgementNumber,
    rollingType,
    globalResult,
    localResult,
  } = useSelector((state: State) => state.realTimeDice);
  const diceLogs = useSelector(
    (state: State) => state.firebaseReducer.diceLogs
  );

  /**
   * ダイス結果を生成
   * @return newResult Result型。ダイス結果
   */
  const makeResult = (): Result => {
    const dice = diceRoll(diceCount, diceSize);
    const currentDate = formatDate(new Date());

    // 成功判定値が0 (未定義) の場合、判定は入れずに結果を返す
    if (judgementNumber === 0) {
      const newResult: Result = {
        playerName: myCharacter,
        dice,
        timestamp: currentDate,
      };

      return newResult;
    }

    // 成功判定値が設定されている場合、判定を入れて結果を返す
    let judgement = dice.last <= judgementNumber ? '成功' : '失敗';

    // もしクリティカルかファンブルが出ているなら、その結果を返す
    if (dice.type === '1D100' && dice.last <= 5) judgement = 'クリティカル';
    if (dice.type === '1D100' && dice.last >= 96) judgement = 'ファンブル';

    const newResult: Result = {
      playerName: myCharacter,
      dice,
      judgement,
      timestamp: currentDate,
    };

    return newResult;
  };

  /**
   * ダイス演出を行う
   * @param rollType ダイスロールのタイプ(グローバル、出目伏せ、ローカル)
   * @param currentResult 最新のダイス結果
   */
  const dicePerformance = (
    rollType: 'global' | 'hiding' | 'local',
    currentResult?: Result
  ) => {
    // rollTypeに応じて1秒間の待ち時間を発生させつつ、globalResultも更新する
    // TODO: globalResultの更新は正直ここでやりたくない……
    switch (rollType) {
      case 'global':
        dispatch(setRollingType('global'));
        if (currentResult) dispatch(setGlobalResult(currentResult));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      case 'hiding':
        dispatch(setRollingType('hiding'));
        if (currentResult) dispatch(setGlobalResult(currentResult));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      case 'local':
        dispatch(setRollingType('local'));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      default:
    }

    // サウンドを再生
    const sound: HTMLMediaElement | null = document.querySelector('#js-sound');
    if (sound) sound.play();
  };

  /**
   * ダイスロール処理
   * @param rollType ダイスロールのタイプ(グローバル、出目伏せ、ローカル)
   */
  const handleDiceRoll = (rollType: 'global' | 'hiding' | 'local') => {
    if (!myCharacter) {
      alert('先にキャラクターを選択してください');
      return;
    }

    const newResult = makeResult();
    const judgementNumberDOM: HTMLInputElement | null = document.querySelector(
      '#js-judgementNumber'
    );
    // MEMO: hidingのときしか使わないが, switch内で変数宣言すると怒られる
    const hiddenDice: HiddenDice = {
      type: '何か',
      single: '????',
      last: '????',
    };
    const hiddenResult: Result = {
      playerName: newResult.playerName,
      dice: hiddenDice,
      judgement: '????',
      timestamp: newResult.timestamp,
    };

    switch (rollType) {
      // グローバルダイスロール(全体公開, 普通のロール)
      case 'global':
        // Firestoreに結果を送信
        dispatch(addDiceLog.start(newResult));
        break;
      // 出目を伏せてダイスロール(振ったことは通知)
      case 'hiding':
        // Firestoreに 伏せデータ ???? を送信、0.1秒後にローカルでのみ結果表示
        // TODO: setTimeoutがダサい
        dispatch(addDiceLog.start(hiddenResult));
        setTimeout(() => dispatch(setLocalResult(newResult)), 100);
        break;
      // ローカルダイスロール(Firestoreに送信しない)
      case 'local':
        // 演出もlocalResultのセットもローカル内でのみ行う
        dicePerformance('local');
        dispatch(setLocalResult(newResult));
        break;
      default:
        break;
    }

    // 成功判定値欄を0に戻す
    if (judgementNumberDOM) judgementNumberDOM.value = '';
    dispatch(setJudgementNumber(0));
  };

  // TODO: せっかくSagaに移したからuseEffectを使いたくない……
  useEffect(() => {
    let initializeFlg = false;
    // Firestoreの更新をフックにダイス演出を発火させる
    // MEMO: Firestoreのデータ変更とStore操作はSaga経由で行う
    diceLogsQuery.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const currentResult = change.doc.data() as Result;
        // Firestoreにデータが追加されたとき (※アプリ起動時にも発火する)
        if (change.type === 'added') {
          // アプリ起動時は演出しない
          if (!initializeFlg) return;

          // ダイス演出を行う
          if (currentResult.dice.type === '何か') {
            dicePerformance('hiding', currentResult);
          } else {
            dicePerformance('global', currentResult);
          }
        }
      });

      initializeFlg = true;
    });
  }, []);

  return (
    <Wrapper>
      <DiceSelect />
      <JudgeNumberInput />
      <div>
        <button
          type="button"
          onClick={() => handleDiceRoll('global')}
          disabled={Boolean(rollingType)}
        >
          ダイスロール!
        </button>
        <button
          type="button"
          onClick={() => handleDiceRoll('hiding')}
          disabled={Boolean(rollingType)}
        >
          出目を伏せて
        </button>
        <button
          type="button"
          onClick={() => handleDiceRoll('local')}
          disabled={Boolean(rollingType)}
        >
          こっそり
        </button>
      </div>
      {globalResult && <ResultWindow result={globalResult} />}
      {localResult && <ResultWindow result={localResult} isLocal />}
      <Sound />
      <LogWindow diceLogs={diceLogs} />
    </Wrapper>
  );
};

export default RealTimeDice;
