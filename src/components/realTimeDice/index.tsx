import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
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

interface StyledProps {
  isLocal?: boolean;
}

const Wrapper = styled.section`
  width: 320px;
  height: calc(100vh - 32px);
  padding: 32px 0;
  overflow-y: scroll;
  text-align: center;
  background: #fff;
  border-radius: 8px;
`;

const SettingArea = styled.div`
  padding: 16px 32px;
  font-size: 1.6rem;
  background: #f6f6f6;
`;

const RollArea = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0 32px;
  margin-top: 16px;
  font-size: 1.6rem;
  color: #fff;
`;

const LocalRollArea = styled.div`
  display: flex;
  margin-top: 8px;
`;

const Button = styled.button<StyledProps>`
  width: 100%;
  padding: 1em;
  background: ${(props) =>
    props.isLocal ? '#444' : 'linear-gradient(90deg, #f093fb, #f5576c)'};
  transition: opacity 0.1s;

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }

  &:not(:first-child) {
    margin-left: 8px;
  }
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
   */
  const dicePerformance = (rollType: 'global' | 'hiding' | 'local') => {
    // サウンドを再生
    const sound: HTMLMediaElement | null = document.querySelector('#js-sound');
    if (sound) sound.play();

    // rollTypeに応じて1秒間の待ち時間を発生させる
    switch (rollType) {
      case 'global':
        dispatch(setRollingType('global'));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      case 'hiding':
        dispatch(setRollingType('hiding'));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      case 'local':
        dispatch(setRollingType('local'));
        setTimeout(() => dispatch(setRollingType(false)), 1000);
        break;
      default:
    }
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
        // Firestoreには 伏せデータ ???? を送信し、ローカル内でのみ結果表示
        dispatch(addDiceLog.start(hiddenResult));
        setTimeout(() => dispatch(setLocalResult(newResult)), 200);
        break;
      // ローカルダイスロール(Firestoreに送信しない)
      case 'local':
        // 演出もlocalResultのセットもローカル内でのみ行う
        dicePerformance('local');
        setTimeout(() => dispatch(setLocalResult(newResult)), 200);
        break;
      default:
        break;
    }

    // 成功判定値欄を0に戻す
    if (judgementNumberDOM) judgementNumberDOM.value = '';
    dispatch(setJudgementNumber(0));
  };

  // diceLogsの更新(Firestoreが書き換わったとき)をフックにダイスロール演出を行う
  useEffect(() => {
    // 最新のダイスが伏せダイスならhiding, そうでないならglobalの演出を実行
    if (diceLogs[0]) {
      const currentDiceType = diceLogs[0].dice.type;
      if (currentDiceType === '何か') {
        dicePerformance('hiding');
      } else {
        dicePerformance('global');
      }

      // globalResultを更新
      setTimeout(() => dispatch(setGlobalResult(diceLogs[0])), 200);
    }
    // eslint-disable-next-line
  }, [diceLogs]);

  return (
    <Wrapper>
      <SettingArea>
        <DiceSelect />
        <JudgeNumberInput />
      </SettingArea>
      <RollArea>
        <Button
          type="button"
          onClick={() => handleDiceRoll('global')}
          disabled={Boolean(rollingType)}
        >
          ダイスロール!
        </Button>
        <LocalRollArea>
          <Button
            isLocal
            type="button"
            onClick={() => handleDiceRoll('hiding')}
            disabled={Boolean(rollingType)}
          >
            出目を伏せて
          </Button>
          <Button
            isLocal
            type="button"
            onClick={() => handleDiceRoll('local')}
            disabled={Boolean(rollingType)}
          >
            こっそり
          </Button>
        </LocalRollArea>
      </RollArea>
      {globalResult && (
        <ResultWindow result={globalResult} rollingType={rollingType} />
      )}
      {localResult && (
        <ResultWindow result={localResult} rollingType={rollingType} isLocal />
      )}
      <Sound />
      <LogWindow diceLogs={diceLogs} />
    </Wrapper>
  );
};

export default RealTimeDice;
