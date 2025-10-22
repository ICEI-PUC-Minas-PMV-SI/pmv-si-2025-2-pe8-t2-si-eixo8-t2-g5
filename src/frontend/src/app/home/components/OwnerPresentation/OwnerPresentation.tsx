import Button from '@mui/material/Button';
import styles from './OwnerPresentation.module.scss';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function HomeOwnerPresentation() {
  return (
    <div className={styles.owner_presentation}>
      <h2>Bianca Souza Hair, Especialista em Noivas, Penteados, Cortes, Mechas e Tratamentos</h2>
      <div className={styles.content}>
        <div className={styles.side}>
          <h3>
            especialidades
            <ArrowForwardIcon />
          </h3>
          <h4>O brilho que você procura já habita em você — nós apenas o despertamos.</h4>
          <Button variant="text">Clique aqui para ver todos os serviços</Button>
          <h5>“Beleza é confiança. E confiança começa com um cabelo impecável.”<br />- Bianca</h5>
          <Button variant="text">
            Conheça o salão
            <ArrowForwardIcon />
          </Button>
        </div>
        <div className={styles.main}>
          <div className={styles.gallery_list}>
            <div className={styles.gallery_item}>
              <img src="images/gallery_1.png" alt="Gallery 1" />
              <p>Tratamentos</p>
            </div>
            <div className={styles.gallery_item}>
              <img src="images/gallery_2.png" alt="Gallery 2" />
              <p>Tratamentos</p>
            </div>
            <div className={styles.gallery_item}>
              <img src="images/gallery_3.png" alt="Gallery 3" />
              <p>Tratamentos</p>
            </div>
            <div className={styles.gallery_item}>
              <img src="images/gallery_4.png" alt="Gallery 4" />
              <p>Tratamentos</p>
            </div>
            <div className={styles.gallery_item}>
              <img src="images/gallery_5.png" alt="Gallery 5" />
              <p>Tratamentos</p>
            </div>
          </div>
          <div className={styles.owner_info}>
            <img src="images/owner.png" alt="Owner" />
            <div>
              <p>
                Bianca Souza
                <br /><br />
                Especialista renomada com mais de 15 anos de experiência internacional em técnicas avançadas de colorimetria, cortes autorais e penteados de alta complexidade. Formada pela prestigiada Academia Internacional de Beleza de Paris, traz ao Glamour Studio o que há de mais exclusivo em tratamentos capilares premium, utilizando apenas produtos das melhores marcas do mercado mundial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}