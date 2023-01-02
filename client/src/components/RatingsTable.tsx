import "../styles/RatingsTable.css";
import "../styles/UserRow.css";
import "../styles/RatingsBar.css";
import testIcon from "../assets/jpg/18-waze.jpg";
import { User } from "../TypeDefinitions";

const users: User[] = [
  { id: 0, name: "kimmy", room: "kay", vote: 0 },
  { id: 0, name: "kimbop", room: "kay", vote: 1 },
  { id: 0, name: "curry", room: "kay", vote: 5 },
  { id: 0, name: "lemon-cello", room: "kay", vote: 6 },
  { id: 0, name: "ChickenTendiesss", room: "kay", vote: 8 },
  { id: 0, name: "DopamineKilla", room: "kay", vote: 3 },
];

const MAX_VOTE = 10;

const calculatePercentFromVote = (vote: number) => {
  return `${(vote / MAX_VOTE) * 100}%`;
};

interface Props {}

export const RatingsTable: React.FC<Props> = (props) => {
  return (
    <div className="RatingsTable__container">
      {users.map((user) => {
        return (
          <div key={user.id} className="UserRow__row-container">
            <img className="UserRow__icon" src={testIcon} />
            <div className="RatingBar__container">
              <div className="RatingBar__username">{user.name}</div>
              <div className="RatingBar__outer-bar RatingBar__base-bar">
                <div
                  className="RatingBar__inner-bar RatingBar__base-bar"
                  style={{ width: calculatePercentFromVote(user.vote) }}
                ></div>
              </div>
              <div className="RatingBar__score">{user.vote}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
