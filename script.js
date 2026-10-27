// HTMLから必要な要素を取得する
const scoreInput = document.getElementById("score");
const throwsInput = document.getElementById("throws");
const result = document.getElementById("result");
const calculateButton = document.getElementById("calculate");

// ダーツの的と得点を保存する。ここでは61個
const targets = [];

// シングル・ダブル・トリプル
for (let i = 1; i <= 20; i++) {
  targets.push({ name: "S" + i, score: i });
  targets.push({ name: "D" + i, score: i * 2 });
  targets.push({ name: "T" + i, score: i * 3 });
}

// ブル
targets.push({ name: "ブル", score: 50 });

/**
 * 
 * @param {*} score のこり点数
 * @param {*} maxThrows のこり投数
 * @returns  残り点数をちょうど0にできるルートを探す
 */
function findFinishes(score, maxThrows) {
  const routes = [];

  /**
   * 
   * @param {*} remaining 今ののこり点数
   * @param {*} path 投げた数
   * @returns ルートを調べる。外でこの関数は使わない
   */
  function search(remaining, path) {
    // 最後の1投でちょうど0点になる的を探す
    for (const target of targets) {
      if (target.score === remaining) {
        const newPath = path.slice();
        newPath.push(target);
        routes.push(newPath);
      }
    }

    // あと何回投げられるか
    if (path.length >= maxThrows - 1) {
      return;
    }

    // 次に投げる的を1つずつ調べる
    for (const target of targets) {
      const rest = remaining - target.score;

      // 残り点数がマイナスになる場合は飛ばす
      if (rest < 0) {
        continue;
      }

      // 的を追加して次の投げ方を調べる
      path.push(target);
      search(rest, path);

      // 調べ終わった的を取り除く、残しておくと次を調べるときにおかしくなる。
      path.pop();
    }
  }

  // 最初の点数から探索を開始する。再帰
  search(score, []);

  return routes;
}

// ルートを画面に表示する
/**
 * 
 * @param {*} title 
 * @param {*} route 
 * @param {*} remaining 
 */
function createCard(title, route, remaining) {
  const card = document.createElement("div");
  card.className = "route";

  const h = document.createElement("h3");
  h.textContent = title;

  const routeT = document.createElement("p");
  let names = "";

  // 的の名前を矢印でつなぐ
  for (const target of route) {
    if (names !== "") {
      names += " → ";
    }

    names += target.name;
  }

  routeT.textContent = names;

  // 残り点数を表示する
  const rest = document.createElement("p");
  rest.textContent = "残り " + remaining + "点";

  card.append(h, routeT, rest);
  result.appendChild(card);
}

// 計算ボタンを押したときの処理
/**
 * 
 * @returns 
 */
function calculate() {
  const score = Number(scoreInput.value);
  const throws = Number(throwsInput.value);

  // 前回の結果を消す
  result.innerHTML = "";

  // 入力された点数を確認する
  if (!Number.isInteger(score) || score < 1 || score > 180) {
    result.textContent = "1〜180の整数を入力してください。";
    return;
  }

  // 上がれるルートを探す
  const finishes = findFinishes(score, throws);

  // 上がれるルートがない場合
  if (finishes.length === 0) {
    result.textContent = "ルートが見つかりませんでした。";
    return;
  }

  // 候補の中からランダムに1つ選ぶ
  const randomIndex = Math.floor(Math.random() * finishes.length);
  const route = finishes[randomIndex];

  // 今回のルートを表示する
  createCard("今回のルート", route, 0);
}

// ボタンを押すと計算する
calculateButton.addEventListener("click", calculate);
