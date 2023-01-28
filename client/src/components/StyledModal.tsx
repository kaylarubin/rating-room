import { Modal } from "@mui/material";
import { ReactElement } from "react";
import "../styles/StyledModal.css";

interface props {
  children: ReactElement;
  open: boolean;
  onClose: () => void;
}

export const StyledModal: React.FC<props> = (props) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className="modal StyledModal__container">
        <div
          className="StyledModal__exit-button"
          onClick={() => {
            props.onClose();
          }}
        >
          X
        </div>
        {props.children}
      </div>
    </Modal>
  );
};
