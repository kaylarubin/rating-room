import { User } from "../TypeDefinitions";
import "../styles/UserRow.css";
import { RatingsBar } from "./RatingsBar";
import { FastAverageColor } from "fast-average-color";
import { useEffect, useState } from "react";
import testIcon from "../assets/jpg/18-waze.jpg";

interface Props {
  user: User;
}

export const UserRow: React.FC<Props> = (props) => {
  const [barColor, setBarColor] = useState<string>();
  useEffect(() => {
    async function getRatingBarColor() {
      const res = await new FastAverageColor().getColorAsync(testIcon);
      setBarColor(res.hex);
    }
    if (!barColor) getRatingBarColor();
  }, []);

  return (
    <div key={props.user.id} className="UserRow__row-container">
      <img className="UserRow__icon" src={testIcon} />
      <RatingsBar
        label={props.user.name}
        score={props.user.vote}
        barColor={barColor}
      />
    </div>
  );
};
