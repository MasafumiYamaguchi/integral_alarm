import React from "react";

import Alarm from "../sound/Alarm.mp3";
import Problem from "../components/problem";

function parseCSV(csv: string) {
  console.log("CSV data:", csv); // デバッグ用
  const lines = csv.split("\n");
  const problemLines = lines.slice(1).filter((line) => line.trim() !== "");

  console.log("Problem lines count:", problemLines.length); // デバッグ用

  if (problemLines.length > 0) {
    const randomLine =
      problemLines[Math.floor(Math.random() * problemLines.length)];
    console.log("Selected line:", randomLine); // デバッグ用

    // CSVの解析を改善（引用符内のカンマを考慮）
    const columns = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < randomLine.length; i++) {
      const char = randomLine[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        columns.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    columns.push(current.trim());

    let [id, problem, answer] = columns;

    // 引用符を除去
    problem = problem?.replace(/^"(.*)"$/, "$1") || "";
    answer = answer?.replace(/^"(.*)"$/, "$1") || "";

    // バックスラッシュの二重エスケープを修正
    problem = problem.replace(/\\\\/g, "\\");
    answer = answer.replace(/\\\\/g, "\\");

    const result = {
      id: Number(id) || 1,
      problem: problem || "\\int x \\, dx",
      answer: answer || "\\frac{x^2}{2} + C",
    };

    console.log("Parsed result:", result); // デバッグ用
    return result;
  }

  // フォールバック用のデフォルト問題
  return {
    id: 1,
    problem: "\\int x \\, dx",
    answer: "\\frac{x^2}{2} + C",
  };
}

export const Main = () => {
  const [timer, setTimer] = React.useState("00:00");
  const [isTimerSet, setIsTimerSet] = React.useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = React.useState(false);
  const [problemData, setProblemData] = React.useState<{
    id: number;
    problem: string;
    answer: string;
  }>({
    id: 1,
    problem: "\\int x dx",
    answer: "\\frac{x^2}{2} + C",
  });
  const [csvData, setCsvData] = React.useState<string>("");
  const [csvLoaded, setCsvLoaded] = React.useState(false);

  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    fetch("/problems/problems.csv")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        console.log("CSV loaded successfully"); // デバッグ用
        setCsvData(text);
        setCsvLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load CSV:", error);
        // CSVが読み込めない場合はデフォルト問題を使用
        setCsvLoaded(true);
      });
  }, []);

  function showSetTimer() {
    const modal = document.querySelector(".Modal");
    if (modal && isTimerSet === false) {
      if (!modal.classList.contains("hidden")) {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
        return;
      } else {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
        return;
      }
    }
  }

  function setAlarm() {
    if (!csvLoaded) {
      alert(
        "問題データがまだ読み込み中です。しばらく待ってから再試行してください。"
      );
      return;
    }

    setIsTimerSet(true);
    const setTime = timer;
    const now = new Date();
    const [hours, minutes] = setTime.split(":").map(Number);
    const alarmTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0,
      0
    );
    let diff = alarmTime.getTime() - now.getTime();
    // もし設定時間が過ぎていたら、翌日に設定
    if (diff < 0) {
      alarmTime.setDate(alarmTime.getDate() + 1);
      diff = alarmTime.getTime() - now.getTime();
    }
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.loop = true;
        audioRef.current.play();
      }
      const newProblem = parseCSV(csvData);
      console.log("Setting new problem:", newProblem); // デバッグ用
      setProblemData(newProblem);
      setIsAlarmPlaying(true);
      setIsTimerSet(false);
    }, diff);
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="text-2xl md:text-3xl font-bold justify-center flex items-center h-1/10 p-4 md:p-10">
        積分アラーム
      </div>
      <div className="flex-1 flex justify-center content px-4">
        <div className="box w-full max-w-[min(90vw,60rem)]">
          <div
            className="text-[clamp(3rem,20vw,15rem)] leading-none text-center select-none"
            onClick={() => showSetTimer()}
          >
            {timer}
          </div>
          <div className="buttons flex flex-col md:flex-row justify-center gap-3 md:gap-4 mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-3 md:py-2 rounded"
              onClick={() => {
                if (isTimerSet === true) {
                  alert("既にアラームがセットされています");
                  return;
                }
                setAlarm();
              }}
            >
              アラームセット
            </button>
          </div>
          <div className="text-base md:text-xl text-center">
            {isTimerSet ? "アラームセット済み" : "アラーム未設定"}
          </div>
        </div>
      </div>
      <div className="Modal h-full w-full fixed top-0 left-0 justify-center items-center hidden">
        <div className="background bg-black opacity-50 h-full w-full absolute"></div>
        <div className="content bg-black p-4 sm:p-5 rounded z-10 border border-white w-[calc(100%-2rem)] max-w-md mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">アラーム設定</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="time"
              className="border border-gray-300 p-2 rounded sm:mr-2 w-full sm:w-auto"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto"
              onClick={() => {
                showSetTimer();
              }}
            >
              設定
            </button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={Alarm} />
      {isAlarmPlaying && (
        <Problem
          id={problemData.id}
          onClose={() => {
            setIsAlarmPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
          }}
          problem={problemData.problem}
          answer={problemData.answer}
        />
      )}
      <div className="footer">
        <footer className="text-center p-4 text-gray-500 text-sm md:text-base">
          © 2025 ふみ
        </footer>
      </div>
    </div>
  );
};
