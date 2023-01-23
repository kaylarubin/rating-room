import testIcon from "../assets/jpg/18-waze.jpg";
import "../styles/TitleBar.css";

interface Props {
  room: string;
  name: string;
}

export const TitleBar: React.FC<Props> = (props) => {
  return (
    <div className="TitleBar__title-bar">
      <div className="TitleBar__title-section">
        <h1 className="TitleBar__vote-title-text">Vote</h1>
        <p className="TitleBar__room-title-text">{props.room}</p>
      </div>
      <div className="TitleBar__user-info">
        <p className="TitleBar__user-info-name">{props.name}</p>
        <img className="TitleBar__user-info-icon" src={testIcon} />
      </div>
    </div>
  );
};
