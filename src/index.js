import { createRoot } from "react-dom/client";
import "./styles.css";
import MainApp from "./MainApp";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<MainApp tab="home" />);
