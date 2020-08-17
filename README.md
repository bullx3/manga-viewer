# MangaViewer

chrome 拡張. サイトの画像を漫画ビュアー風に表示

## Descrition

chrome拡張機能でサイトの画像を漫画ビュアー風に表示する  
画像は左右二分割で表示可能（右 -> 左）  
左右キーでページ切り替え（二枚表示の場合は二枚分）

## Demo

## VS

## Requirement

## Usage

### インストール

    $npm install
    $npm run build

chromeの拡張機能の管理画面からデベロッパーモードを有効にして、"パッケージ化されていない拡張機能を読み込む"を押して"dist"フォルダを指定する。

### MangaViewerの使い方

以下の手順のいずれかでViewerを表示する

- 拡張機能のアクションボタンを押してポップアップを表示後、”ビュアー表示”ボタンをクリックする。または o キーを押す
- Viewer表示したい画面でショートカットを押す

MangaViewer起動のショートカット

    windows: Ctrl + Shift + O
    mac : Command + Shift + O

MangaViewer起動中のショートカット

    ← : 1ページ進む
    → : 1ページ戻る
    ↓ : 画像一枚進む
    ↑ : 画像一枚戻る
    m : Menuダイアログを表示
    n : 画面に表示する画像数を切り替える
    1 : 1 枚表示に切り替える
    2 : 2 枚（見開き）表示に切り替える

## Install

## Contribution

## Licence

MIT

## Author

[bullx3](https://github.com/bullx3)
