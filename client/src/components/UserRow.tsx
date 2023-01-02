import { User } from "../TypeDefinitions";
import testIcon from "../assets/jpg/18-waze.jpg";
import "../styles/UserRow.css";
import { RatingsBar } from "./RatingsBar";

interface Props {
  user: User;
}

export const UserRow: React.FC<Props> = (props) => {
  return (
    <div key={props.user.id} className="UserRow__row-container">
      <img className="UserRow__icon" src={testIcon} />
      <RatingsBar label={props.user.name} score={props.user.vote} />
    </div>
  );
};
