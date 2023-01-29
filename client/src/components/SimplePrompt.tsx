import { useState } from "react";
import "../styles/SimplePrompt.css";

interface props {
  prompt?: string;
  placeholder?: string;
  buttonText?: string;
  handleEntrySubmit: (input: string) => void;
}

export const SimplePrompt: React.FC<props> = (props) => {
  const [entry, setEntry] = useState<string>("");
  return (
    <div className="SimplePrompt__container">
      <div className="SimplePrompt__prompt">{props.prompt}</div>
      <input
        className="SimplePrompt__input"
        placeholder={props.placeholder}
        type="text"
        onChange={(event) => {
          setEntry(event.target.value);
        }}
      />
      <button
        className="SimplePrompt__button"
        onClick={() => {
          props.handleEntrySubmit(entry);
        }}
      >
        {props.buttonText || "Done"}
      </button>
    </div>
  );
};
