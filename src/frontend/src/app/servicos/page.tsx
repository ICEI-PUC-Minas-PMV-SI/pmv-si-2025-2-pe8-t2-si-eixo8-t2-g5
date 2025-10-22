import styles from './page.module.scss';
import Button from '@mui/material/Button';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BrushIcon from '@mui/icons-material/Brush';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface Service {
  name: string;
  min_price: number;
  time: number;
}

interface Category {
  label: string;
  icon: 'ContentCutIcon' | 'BrushIcon' | 'MenuBookIcon';
  services: Service[];
}

export default function ServicesPage() {
  const categories: Category[] = [
    {
      label: "Cabelo",
      icon: "ContentCutIcon",
      services: [
        {
          name: "Corte de Cabelo",
          min_price: 150,
          time: 60,
        },
        {
          name: "Coloração",
          min_price: 200,
          time: 120,
        },
        {
          name: "Mechas",
          min_price: 180,
          time: 150,
        },
        {
          name: "Tratamentos Capilares",
          min_price: 120,
          time: 45,
        },
      ],
    },
    {
      label: "Mais Serviços",
      icon: "BrushIcon",
      services: [
        {
          name: "Maquiagem Social",
          min_price: 100,
          time: 50,
        },
        {
          name: "Maquiagem para Festas",
          min_price: 150,
          time: 75,
        },
        {
          name: "Maquiagem para Noivas",
          min_price: 200,
          time: 90,
        },
      ],
    },
    {
      label: "Mais Serviços",
      icon: "MenuBookIcon",
      services: [
        {
          name: "Manicure",
          min_price: 50,
          time: 45,
        },
        {
          name: "Pedicure",
          min_price: 60,
          time: 60,
        },
        {
          name: "Alongamento de Unhas",
          min_price: 80,
          time: 90,
        },
      ],
    },
  ];

  const loadIcon = (category: 'ContentCutIcon' | 'BrushIcon' | 'MenuBookIcon') => {
    switch (category) {
      case 'ContentCutIcon':
        return (<ContentCutIcon />);
      case 'BrushIcon':
        return (<BrushIcon />);
      case 'MenuBookIcon':
        return (<MenuBookIcon />);
    }
  }

  return (
    <main className={styles.servicos}>
      <h2>Nossos Serviços</h2>
      <h3>Descubra a variedade de tratamentos e serviços que oferecemos para realçar sua beleza e bem-estar.</h3>
      <div className={styles.category_list}>
        {categories.map((category, i) => (
          <div key={i} className={styles.category}>
            <h4>
              {loadIcon(category.icon)}
              {category.label}
            </h4>
            {category.services.map((service, j) => (
              <div key={j} className={styles.service}>
                <div className={styles.service_info}>
                  <h5>{service.name}</h5>
                  <p>
                    A partir de R${service.min_price} • {service.time} min
                  </p>
                </div>
                <Button variant="contained">
                  <CalendarMonthIcon />
                  Solicitar agendamento
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
