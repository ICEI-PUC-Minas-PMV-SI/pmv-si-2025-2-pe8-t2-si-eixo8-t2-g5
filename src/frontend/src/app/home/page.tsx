import styles from './page.module.scss';
import HomeBanner from './components/Banner/Banner';
import HomeOwnerPresentation from './components/OwnerPresentation/OwnerPresentation';
import HomePlace from './components/Place/Place';
import HomeContact from './components/Contact/Contact';

export default function HomePage() {
  return (
    <main className={styles.home}>
      <HomeBanner />
      <HomeOwnerPresentation />
      <HomePlace />
      <HomeContact />
    </main>
  )
}