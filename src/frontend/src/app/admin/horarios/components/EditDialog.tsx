import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";

export interface SimpleDialogProps {
  open: boolean;
  startTime: Dayjs;
  endTime: Dayjs;
  onTimeChange: (startTime: Dayjs, endTime: Dayjs) => void;
  onClose: () => void;
}

export default function EditDialog(props: SimpleDialogProps) {
  const { open, startTime, endTime, onTimeChange, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Horário</DialogTitle>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Data inicial"
          value={startTime}
          onChange={(newValue) => newValue && onTimeChange(newValue, endTime)}
        />
        <TimePicker
          label="Data final"
          value={endTime}
          onChange={(newValue) => newValue && onTimeChange(startTime, newValue)}
        />
      </LocalizationProvider>
    </Dialog>
  );
}