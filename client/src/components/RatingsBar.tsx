import "../styles/UserRow.css";
import "../styles/RatingsBar.css";
import { ScoreOptions } from "../Constants";

const MAX_SCORE = ScoreOptions.length;

const calculatePercentFromScore = (vote: number) => {
  return `${(vote / MAX_SCORE) * 100}%`;
};

interface Props {
  label: string;
  score: number;
}

export const RatingsBar: React.FC<Props> = (props) => {
  return (
    <div className="RatingBar__container">
      <div className="RatingBar__username">{props.label}</div>
      <div className="RatingBar__outer-bar RatingBar__base-bar">
        <div
          className="RatingBar__inner-bar RatingBar__base-bar"
          style={{ width: calculatePercentFromScore(props.score) }}
        ></div>
      </div>
      <div className="RatingBar__score">{props.score}</div>
    </div>
  );
};
