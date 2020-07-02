# otogi
![otogi](https://user-images.githubusercontent.com/39970521/83837458-723c1e00-a731-11ea-8e77-fa1c6511b40b.png)
## 概要
- オンラインでのTRPGを楽しむツールです。
- 徐々に機能追加していく、かも。
- GMの進行の容易さを最優先に考え、まずは最低限の確実に役立つ機能のみに絞って開発していきます。
## 機能
- realTimeDice: 1D100など、様々なダイス結果をリアルタイムで共有することができます。
- partyViewer: 事前に保存したキャラクターの情報を一括で閲覧することができます。
- characterMaker: クトゥルフ神話TRPG のルールに基づいたキャラクターの保存機能です。
## 開発コマンド
- `yarn start`でプレビュー起動。
- `yarn build`でビルドファイル作成。
- `firebase deploy`でビルドファイルをデプロイ。
## 技術
- TypeScript
- React (Hooks)
- Redux, React-Redux
- React Router
- Firebase
- Redux-Saga, redux-saga-firebase