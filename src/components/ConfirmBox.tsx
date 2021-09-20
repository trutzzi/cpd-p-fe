import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormattedMessage } from 'react-intl';
import { FC } from 'react';

type ConfirmBoxProps = {
  open: boolean,
  closeHandler: Function,
  action: Function,
  title: string,
  message: string
}

const ConfirmBox: FC<ConfirmBoxProps> = ({ open, closeHandler, title, message, action }) => {
  const deleteHandle = () => {
    closeHandler(false)
    action();
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => closeHandler(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => closeHandler(false)}>
            <FormattedMessage
              id="cancel"
              defaultMessage="Cancel"
              description="Cancel"
            />
          </Button>
          <Button onClick={deleteHandle} autoFocus>
            <FormattedMessage
              id="agree"
              defaultMessage="Agree"
              description="Agree"
            />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default ConfirmBox;