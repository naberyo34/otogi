import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { firestore } from '../../services/firebase';
import Sound from './Sound';
import diceRoll, {
  DiceResult,
  HiddenDiceResult,
} from '../../services/diceRoll';
import formatDate from '../../services/formatDate';
import generateRandomId from '../../services/generateRandomId';
import { State } from '../../modules/index';
import toggleLog from '../../modules/realTimeDice/actions';

interface Result {
  id?: string;
  playerName: string;
  dice: DiceResult | HiddenDiceResult;
  success?: string;
  timestamp: string;
}

// TODO: 直せ
interface StyledProps {
  isShow: boolean;
  emphasis?: boolean;
}

const Wrapper = styled.section`
  display: flex;
`;

const StatusWrapper = styled.section`
  width: calc(100vw - 320px);
  padding: 16px;
`;

const StatusCard = styled.div`
  margin-top: 16px;
  background: aliceblue;

  p {
    font-size: 1.6rem;
  }
`;

const DiceWrapper = styled.section`
  width: 320px;
  padding: 16px;
  border-right: 1px solid black;
`;

const DiceSetting = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const Select = styled.select`
  font-size: 2.4rem;
`;

const SelectLabel = styled.span`
  padding: 0 8px;
  font-size: 2.4rem;
`;

const InputArea = styled.div`
  margin-top: 16px;
  text-align: center;

  label {
    font-size: 1.6rem;
  }
`;

const DiceRoll = styled.div`
  margin-top: 16px;
  text-align: center;

  p {
    :nth-of-type(1) {
      margin-top: 32px;
    }
  }

  button {
    width: 100%;
    padding: 8px;
    color: white;
    cursor: pointer;
    background: black;
    border-radius: 8px;

    &:disabled {
      cursor: wait;
      opacity: 0.2;
    }

    &:first-child {
      background: red;
    }
  }
`;

const Info = styled.p`
  font-size: 1.6rem;
`;

const ResultDisplay = styled.div`
  padding: 8px;
  margin-top: 32px;
  text-align: center;
`;

const LocalResultDisplay = styled.div`
  padding: 8px;
  margin-top: 32px;
  color: white;
  text-align: center;
  background: black;
  border-radius: 8px;
`;

const SingleDisplay = styled.div<StyledProps>`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isShow ? '1' : '0')};
  transition: opacity 0.2s;

  span {
    font-size: 1.6rem;
    &:not(:first-child) {
      margin-left: 8px;
    }
  }
`;

const CurrentDisplay = styled.span<StyledProps>`
  display: inline-block;
  margin-top: 16px;
  font-size: 10rem;
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isShow ? '1' : '0')};
  transition: opacity 0.2s;
`;

const LogSwitch = styled.button<StyledProps>`
  position: fixed;
  bottom: ${(props) => (props.isShow ? '320px' : '0')};
  left: 0;
  padding: 8px;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  transition: bottom 0.2s;
`;

const LogWrapper = styled.div<StyledProps>`
  position: fixed;
  bottom: ${(props) => (props.isShow ? '0' : '-320px')};
  left: 0;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 320px;
  background: rgba(0, 0, 0, 0.6);
  transition: bottom 0.2s;
`;

const LogInner = styled.div`
  padding: 16px;
  overflow-y: scroll;
  font-size: 1.6rem;
  color: white;

  p {
    margin-top: 1em;
  }
`;

const PlayerName = styled.span`
  font-weight: bold;
  color: red;
`;

const Success = styled.p<StyledProps>`
  font-size: 3rem;
  color: ${(props) => (props.emphasis ? 'red' : 'black')};
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isShow ? '1' : '0')};
`;

const RealTimeDice: React.FC = () => {
  const dispatch = useDispatch();
  const showLog = useSelector((state: State) => state.realTimeDice.log.isShow);
  // TODO: 全部Reduxに載せ替えろ どうせやらなくちゃいけないんだ
  const [rollingGlobal, setRollingGlobal] = useState<boolean>(false);
  const [rollingLocal, setRollingLocal] = useState<boolean>(false);
  const [diceCount, setDiceCount] = useState({ value: '1' });
  const [diceSize, setDiceSize] = useState({ value: '100' });
  const [successNum, setSuccessNum] = useState<number>(0);
  // TODO: firebaseのDocumentData型とResult型を併用する方法が不明 気に入らない
  const [currentResult, setCurrentResult] = useState<
    firebase.firestore.DocumentData
  >({
    playerName: '',
    dice: {
      type: '',
      single: [],
      last: 0,
    },
    timestamp: '',
  });
  const [localResult, setLocalResult] = useState<Result | false>(false);
  const [resultLog, setResultLog] = useState<firebase.firestore.DocumentData>(
    []
  );
  // TODO: 以下はCharacterPreview関連のStateです 切り分けろ
  const [myCharacter, setMyCharacter] = useState<any>({});
  const [characters, setCharacters] = useState<firebase.firestore.DocumentData>(
    []
  );
  const [choosedViewCharacter, setChoosedViewCharacter] = useState<string>('');
  const [viewCharacters, setViewCharacters] = useState<any[]>([]);

  /**
   * ダイス結果を生成
   * (TODO: stateを呼び出すので関数の切り出しをしていない)
   * @return newResult Result型。ダイス結果
   */
  const makeResult = (): Result => {
    const dice = diceRoll(Number(diceCount.value), Number(diceSize.value));
    const currentDate = formatDate(new Date());

    // 成功判定値が0 (未定義) の場合、判定は入れずに結果を返す
    if (successNum === 0) {
      const newResult: Result = {
        playerName: myCharacter.name,
        dice,
        timestamp: currentDate,
      };

      return newResult;
    }

    // 成功判定値が設定されている場合、判定を入れて結果を返す
    let success = dice.last < successNum ? '成功' : '失敗';

    // もしクリティカルかファンブルが出ているなら、その結果を返す
    if (dice.type === '1D100' && dice.last <= 5) success = 'クリティカル';
    if (dice.type === '1D100' && dice.last >= 96) success = 'ファンブル';

    const newResult: Result = {
      playerName: myCharacter.name,
      dice,
      success,
      timestamp: currentDate,
    };

    return newResult;
  };

  /**
   * ダイス演出を行う
   * @param rollType ダイスロールのタイプ(グローバル、出目伏せ、ローカル)
   */
  const dicePerformance = (rollType: 'global' | 'hiding' | 'local') => {
    // rollTypeに応じて待ちを発生させる
    switch (rollType) {
      case 'global':
        setRollingGlobal(true);
        setTimeout(() => setRollingGlobal(false), 1000);
        break;
      case 'hiding':
        setRollingGlobal(true);
        setRollingLocal(true);
        setTimeout(() => setRollingGlobal(false), 1000);
        setTimeout(() => setRollingLocal(false), 1000);
        break;
      case 'local':
        setRollingLocal(true);
        setTimeout(() => setRollingLocal(false), 1000);
        break;
      default:
    }

    // サウンドを再生
    const sound: HTMLMediaElement | null = document.querySelector('#js-sound');
    if (sound) sound.play();
  };

  // ダイスの個数(回数)を設定
  const handleChooseDiceCount = (e: any) => {
    const count = e.target.value;
    setDiceCount({ value: count });
  };

  // ダイスの面数を設定
  const handleChooseDiceSize = (e: any) => {
    const size = e.target.value;
    setDiceSize({ value: size });
  };

  // 選択したキャラクターを使うよう設定
  const handleChoosedMyCharacter = (e: any) => {
    const choosedCharacterName = e.target.value;
    const choosedCharacter = characters.find(
      (character: any) => character.name === choosedCharacterName
    );

    // 検索に失敗した場合はStateを初期化して返す
    // (ex: セレクトボックスを'選択してください'に戻したときなど)
    if (!choosedCharacter) {
      setMyCharacter([]);
      return;
    }

    setMyCharacter(choosedCharacter);
  };

  // 成功判定値を設定
  const handleInputSucessNum = (e: any) => {
    const inputValue: string = e.target.value;
    // 空欄の場合は何もしないで終了する
    if (inputValue === '') return;

    const inputNum = parseInt(inputValue, 10);
    // バリデーション
    if (Number.isNaN(inputNum)) {
      const successNumDOM: HTMLInputElement | null = document.querySelector(
        '#js-successNum'
      );

      alert('入力値が不正です。数値のみが入力できます');
      setSuccessNum(0);
      if (successNumDOM) successNumDOM.value = '';

      return;
    }

    setSuccessNum(inputNum);
  };

  /**
   * ダイスロール処理
   * @param rollType ダイスロールのタイプ(グローバル、出目伏せ、ローカル)
   */
  const handleDiceRoll = (rollType: 'global' | 'hiding' | 'local') => {
    if (!myCharacter.name) {
      alert('先にキャラクターを選択してください');
      return;
    }

    const newResult = makeResult();
    const successNumDOM: HTMLInputElement | null = document.querySelector(
      '#js-successNum'
    );
    // MEMO: hidingのときしか使わないが, switch内で変数宣言すると怒られる
    const hiddenDiceResult: HiddenDiceResult = {
      type: '何か',
      single: '????',
      last: '????',
    };
    const hiddenResult: Result = {
      playerName: newResult.playerName,
      dice: hiddenDiceResult,
      success: '????',
      timestamp: newResult.timestamp,
    };

    switch (rollType) {
      // グローバルダイスロール(全体公開, 普通のロール)
      case 'global':
        firestore.collection('result').add(newResult);
        break;
      // 出目を伏せてダイスロール(振ったことは通知)
      case 'hiding':
        firestore.collection('result').add(hiddenResult);
        // localResultにのみ結果を表示
        // TODO: いくらなんでもこのsetTimeoutはお粗末すぎる
        setTimeout(() => setLocalResult(newResult), 500);
        break;
      // ローカルダイスロール(ブラウザ内で見れるのみ, Firestoreに送信しない)
      case 'local':
        dicePerformance('local');
        // localResultにのみ結果を表示
        setLocalResult(newResult);
        break;
      default:
        break;
    }
    // 成功判定値欄を0に戻す
    setSuccessNum(0);
    if (successNumDOM) successNumDOM.value = '';
  };

  // ログの開閉
  const handleToggleLog = () => {
    dispatch(toggleLog());
  };

  const handleChooseAddList = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const target = characters.find(
      (character: any) => value === character.name
    );
    setChoosedViewCharacter(target);
  };

  const handleAddList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentViewCharacters = viewCharacters;
    currentViewCharacters.push(choosedViewCharacter);
    setViewCharacters(currentViewCharacters);
  };

  useEffect(() => {
    // Firestoreの変更を検知し、DOMの状態を変更 (リアルタイムダイス)
    const resultQueryCollection = firestore
      .collection('result')
      .orderBy('timestamp', 'asc');

    resultQueryCollection.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        // Firestoreにデータが追加されたとき (※アプリ起動時にも発火する)
        if (change.type === 'added') {
          const rawData: firebase.firestore.DocumentData = change.doc.data();
          const currentLog = resultLog;

          // ダイス演出を行う
          if (rawData.dice.type === '何か') {
            dicePerformance('hiding');
          } else {
            dicePerformance('global');
          }

          // currentResultを最新の結果に更新
          setCurrentResult(rawData);
          // ログに最新の結果をunshiftしてstateを更新
          currentLog.unshift(rawData);
          setResultLog(currentLog);
        }
      });
    });

    // Firestoreの変更を検知し、DOMの状態を変更 (キャラクタープレビュー)
    // TODO: コンポーネント切り分けろ
    const characterQueryCollection = firestore
      .collection('character')
      .orderBy('name', 'asc');

    characterQueryCollection.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        // Firestoreにデータが追加されたとき (※アプリ起動時にも発火する)
        if (change.type === 'added') {
          const rawData: firebase.firestore.DocumentData = change.doc.data();
          const currentCharacters = characters;

          // currentCharactersに最新の結果をpushしてstateを更新
          currentCharacters.push(rawData);
          setCharacters(currentCharacters);
        }
      });
    });
    // TODO: useEffectは一回発火すれば十分なので今の所こう書いてる
    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper>
      <DiceWrapper>
        <DiceSetting>
          <Select onChange={handleChooseDiceCount}>
            {/* TODO: なんのためのJSだ 省略して書け */}
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </Select>
          <SelectLabel>D</SelectLabel>
          <Select onChange={handleChooseDiceSize}>
            <option value="100">100</option>
            <option value="20">20</option>
            <option value="10">10</option>
            <option value="9">9</option>
            <option value="8">8</option>
            <option value="7">7</option>
            <option value="6">6</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
          </Select>
        </DiceSetting>
        <InputArea>
          <label htmlFor="myName">
            あなたは:
            <select id="myName" onChange={(e) => handleChoosedMyCharacter(e)}>
              <option value="">選択してください</option>
              {characters.map((character: any) => (
                <option key={`myName-${character.name}`} value={character.name}>
                  {character.name}
                </option>
              ))}
            </select>
          </label>
        </InputArea>
        <InputArea>
          <label htmlFor="js-successNum">
            成功判定値(1 〜 99):
            <input
              id="js-successNum"
              type="tel"
              maxLength={2}
              onChange={(e) => handleInputSucessNum(e)}
            />
          </label>
        </InputArea>
        <p>
          未入力の場合は特に判定しません。1度ダイスを振ると未入力に戻ります。
        </p>
        <DiceRoll>
          <button
            type="button"
            onClick={() => handleDiceRoll('global')}
            disabled={rollingGlobal || rollingLocal}
          >
            ダイスロール!
          </button>
          <p>↓振ったことは伝えますが、出目は自分以外に見えません</p>
          <button
            type="button"
            onClick={() => handleDiceRoll('hiding')}
            disabled={rollingGlobal || rollingLocal}
          >
            出目を伏せてダイスロール!
          </button>
          <p>↓振ったことは自分にしかわかりません (ログも残りません)</p>
          <button
            type="button"
            onClick={() => handleDiceRoll('local')}
            disabled={rollingGlobal || rollingLocal}
          >
            こっそりダイスロール!
          </button>
        </DiceRoll>
        <ResultDisplay>
          <Info>
            {currentResult.playerName} さんが {currentResult.dice.type}{' '}
            を振りました:
          </Info>
          <SingleDisplay isShow={!rollingGlobal}>
            {Array.isArray(currentResult.dice.single) ? (
              currentResult.dice.single.map((single: number | string) => (
                <span key={generateRandomId(8)}>{single}</span>
              ))
            ) : (
              <span>{currentResult.dice.single}</span>
            )}
          </SingleDisplay>
          <CurrentDisplay isShow={!rollingGlobal}>
            {currentResult.dice.last}
          </CurrentDisplay>
          {currentResult.success && (
            <Success
              isShow={!rollingGlobal}
              emphasis={
                currentResult.success === 'クリティカル' ||
                currentResult.success === 'ファンブル'
              }
            >
              判定: {currentResult.success}
            </Success>
          )}
        </ResultDisplay>
        {localResult && (
          <LocalResultDisplay>
            <Info>
              {localResult.playerName} さんが 非公開で {localResult.dice.type}{' '}
              を振りました:
            </Info>
            <SingleDisplay isShow={!rollingLocal}>
              {Array.isArray(localResult.dice.single) ? (
                localResult.dice.single.map((single: number | string) => (
                  <span key={generateRandomId(8)}>{single}</span>
                ))
              ) : (
                <span>{localResult.dice.single}</span>
              )}
            </SingleDisplay>
            <CurrentDisplay isShow={!rollingLocal}>
              {localResult.dice.last}
            </CurrentDisplay>
            {localResult.success && (
              <Success isShow={!rollingLocal}>
                判定: {localResult.success}
              </Success>
            )}
          </LocalResultDisplay>
        )}
        <Sound />
        <LogSwitch isShow={showLog} type="button" onClick={handleToggleLog}>
          ログ
        </LogSwitch>
        <LogWrapper isShow={showLog}>
          <LogInner>
            {resultLog.map((log: Result) => (
              <p key={generateRandomId(8)}>
                [{log.timestamp}]<br />
                <PlayerName>{log.playerName}</PlayerName> さんが {log.dice.type}{' '}
                で {log.dice.last} を出しました。
                {log.success &&
                  log.success !== '????' &&
                  `${log.success}です。`}
              </p>
            ))}
          </LogInner>
        </LogWrapper>
      </DiceWrapper>
      <StatusWrapper>
        <p>ステータス一覧</p>
        {myCharacter && (
          <>
            <StatusCard>
              <p>自分のキャラクター</p>
              <p>{myCharacter.name}</p>
              <p>{myCharacter.status}</p>
            </StatusCard>
            {viewCharacters.map((viewCharacter) => (
              <StatusCard key={viewCharacter.name}>
                <p>{viewCharacter.name}</p>
                <p>{viewCharacter.status}</p>
              </StatusCard>
            ))}
            <form onSubmit={(e) => handleAddList(e)}>
              <select id="viewChara" onChange={(e) => handleChooseAddList(e)}>
                <option value="">選択してください</option>
                {characters.map((character: any) => (
                  <option
                    key={`viewChara-${character.name}`}
                    value={character.name}
                  >
                    {character.name}
                  </option>
                ))}
              </select>
              <input type="submit" value="リストに追加" />
            </form>
          </>
        )}
      </StatusWrapper>
    </Wrapper>
  );
};

export default RealTimeDice;
