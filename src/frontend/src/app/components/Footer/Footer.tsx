import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <img src="images/logo_black.png" alt="Logo" />
        <ul>
          <li>Início</li>
          <li>Serviços</li>
          <li>Politica de Privacidade</li>
          <li>Contato</li>
        </ul>
      </div>
    </footer>
  )
}