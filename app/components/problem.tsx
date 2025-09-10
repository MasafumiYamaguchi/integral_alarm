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
  return (
    <div className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black opacity-90 text-white">
      <div className="content">
        <h1 className="flex items-start text-3xl mb-4">
          <span className="mr-2 text">問題番号</span>
          <span>{String(id)}</span>
        </h1>
        <BlockMath math={problem || ""} />
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default Problem;
