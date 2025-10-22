import styles from './Place.module.scss';

export default function HomePlace() {
  return (
    <div className={styles.place}>
      <h2>O Salão</h2>
      <p>Ficamos em MG -Nova Lima</p>
      <div>
        <img src="images/place_1.png" alt="Place 1" />
        <img src="images/place_2.png" alt="Place 2" />
        <img src="images/place_3.png" alt="Place 3" />
        <img src="images/place_4.png" alt="Place 4" />
        <img src="images/place_5.png" alt="Place 5" />
      </div>
    </div>
  )
}
