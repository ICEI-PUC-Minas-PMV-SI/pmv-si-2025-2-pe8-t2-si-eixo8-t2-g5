import styles from './Banner.module.scss';
import Button from '@mui/material/Button';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

export default function HomeBanner() {
  return (
    <div className={styles.banner}>
      <img src="images/banner_1.png" alt="Banner 1" />
      <img src="images/banner_2.png" alt="Banner 1" />
      <Button variant="contained">
        <CalendarTodayOutlinedIcon />
        Solicitar agendamento
      </Button>
    </div>
  )
}