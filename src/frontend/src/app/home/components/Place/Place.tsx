import Image from 'next/image';
import styles from './Place.module.scss';

export default function HomePlace() {
  return (
    <div className={styles.place}>
      <h2>O Salão</h2>
      <p>Ficamos em MG -Nova Lima</p>
      <div>
        <Image src="images/place_1.png" alt="Place 1" />
        <Image src="images/place_2.png" alt="Place 2" />
        <Image src="images/place_3.png" alt="Place 3" />
        <Image src="images/place_4.png" alt="Place 4" />
        <Image src="images/place_5.png" alt="Place 5" />
      </div>
    </div>
  )
}
