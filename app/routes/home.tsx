import type { Route } from "./+types/home";
import { Main } from "../main/main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "積分アラーム" },
    { name: "description", content: "積分アラームです。" },
  ];
}

export default function Home() {
  return <Main />;
}
