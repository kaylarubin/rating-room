import "../styles/SimplePrompt.css";

interface props {
  prompt?: string;
  placeholder?: string;
  buttonText?: string;
  onButtonClick: () => void;
}

export const SimplePrompt: React.FC<props> = (props) => {
  return (
    <div className="SimplePrompt__container">
      <div className="SimplePrompt__prompt">{props.prompt}</div>
      <input
        className="SimplePrompt__input"
        placeholder={props.placeholder}
        type="text"
        onChange={(event) => {}}
      />
      <button className="SimplePrompt__button">
        {props.buttonText || "Done"}
      </button>
    </div>
  );
};
