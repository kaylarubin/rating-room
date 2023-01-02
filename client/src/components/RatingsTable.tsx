import "../styles/RatingsTable.css";
import { User } from "../TypeDefinitions";
import { UserRow } from "./UserRow";

interface Props {
  users: User[];
}

export const RatingsTable: React.FC<Props> = (props) => {
  return (
    <div className="RatingsTable__parent-container">
      <div className="RatingsTable__child-container">
        {props.users.map((user) => {
          return <UserRow user={user} />;
        })}
      </div>
    </div>
  );
};
