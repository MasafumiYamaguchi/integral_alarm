import React from "react";
// すべてのimportを先に記述
import * as ReactKatex from "react-katex";
import "katex/dist/katex.min.css";

// その後で定数宣言
const BlockMath = ReactKatex.BlockMath;

interface ProblemProps {
  id: number;
  problem?: string;
  answer?: string;
  onClose: () => void;
}

const Problem = ({ id, problem, answer, onClose }: ProblemProps) => {
  const [userAnswer, setUserAnswer] = React.useState("");

  return (
    <div className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black opacity-90 text-white">
      <div className="content">
        <h1 className="flex items-start text-3xl mb-4">
          <span className="mr-2 text">問題番号</span>
          <span>{String(id)}</span>
        </h1>
        <BlockMath math={problem ? `\\Huge ${problem}` : ""} />
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="border border-gray-300 p-2 rounded mt-4 mb-4 w-full text-white bg-black"
          placeholder="答えを入力"
        />
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 "
            onClick={() => {
              if (userAnswer === answer) {
                alert("正解です！");
                onClose();
              } else {
                alert("不正解です。");
              }
            }}
          >
            回答
          </button>
        </div>
      </div>
    </div>
  );
};

export default Problem;
