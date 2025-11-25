import styles from './Contact.module.scss';

export default function HomeContact() {
  return (
    <div className={styles.contact}>
      <div className={styles.instagram}>
        <h2>Siga nosso instagram <a href='https://www.instagram.com/biancasouza_hair/' target='_black'>@biancasouza_hair</a></h2>
        <p>+ de 7k no instagram</p>
      </div>
      <div className={styles.whatsapp}>
        <div>
          <h3>Dúvidas? Converse conosco!</h3>
          <p>Fale conosco no WhatsApp - clique no icone abaixo</p>
          <a href="https://api.whatsapp.com/send?phone=5531993775019" target='_blank'>
            <img src="images/whatsapp.png" alt="Whatsapp" />
          </a>
        </div>
        <img src="images/contact.png" alt="Contact" />
      </div>
    </div>
  )
}
