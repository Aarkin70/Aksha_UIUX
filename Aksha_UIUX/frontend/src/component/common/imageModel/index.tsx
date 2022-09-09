import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  closeIcon: {
    border: "2px solid black",
    borderRadius: "12px",
    position: "absolute",
    right: "2rem",
    top: "2rem",
    cursor: "pointer",
  },
});

type imageModelProps = {
  open: boolean;
  setOpen: (e: boolean) => void;
  imgUrl: string;
};

export default function ImageModel(props: imageModelProps) {
  const classes = useStyles();
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          {props.imgUrl !== "" && (
            <img src={props.imgUrl} alt="camera image" className="w-100" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
