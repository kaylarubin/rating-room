import "../styles/UserRow.css";
import "../styles/RatingsBar.css";
import { ScoreOptions } from "../Constants";
import { useEffect, useState } from "react";

const MAX_SCORE = ScoreOptions.length - 1;
const UNDEFINED_WIDTH = "0%";
const RATING_BAR_BORDER = "1px #646161 solid";

const calculatePercentFromScore = (vote: number) => {
  return `${(vote / MAX_SCORE) * 100}%`;
};

interface Props {
  label: string;
  score: number;
  barColor?: string;
}

export const RatingsBar: React.FC<Props> = (props) => {
  const [ratingBarWidth, setRatingBarWidth] = useState<string>(UNDEFINED_WIDTH);
  useEffect(() => {
    setRatingBarWidth(calculatePercentFromScore(props.score));
  }, [props.score]);

  return (
    <div className="RatingBar__container">
      <div className="RatingBar__username">{props.label}</div>
      <div className="RatingBar__outer-bar RatingBar__base-bar">
        <div
          className="RatingBar__inner-bar RatingBar__base-bar"
          style={{
            width: ratingBarWidth,
            backgroundColor: props.barColor,
            border:
              ratingBarWidth === UNDEFINED_WIDTH ? "none" : RATING_BAR_BORDER,
          }}
        ></div>
      </div>
      <div className="RatingBar__score">{props.score}</div>
    </div>
  );
};
