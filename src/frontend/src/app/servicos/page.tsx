'use client';

import styles from './page.module.scss';
import Button from '@mui/material/Button';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import BrushIcon from '@mui/icons-material/Brush';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useState, useEffect, useCallback } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface Service {
  id: number;
  name: string;
  min_price: number;
  duration_minutes: number; 
}

interface Category {
  label: string;
  icon: 'ContentCutIcon' | 'BrushIcon' | 'MenuBookIcon';
  services: Service[];
}

const getCategoryIcon = (serviceName: string): 'ContentCutIcon' | 'BrushIcon' | 'MenuBookIcon' => {
  if (serviceName.toLowerCase().includes('corte') || serviceName.toLowerCase().includes('coloração') || serviceName.toLowerCase().includes('mechas')) return 'ContentCutIcon';
  if (serviceName.toLowerCase().includes('maquiagem')) return 'BrushIcon';
  if (serviceName.toLowerCase().includes('manicure') || serviceName.toLowerCase().includes('pedicure') || serviceName.toLowerCase().includes('unhas')) return 'MenuBookIcon';
  return 'ContentCutIcon';
};

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadIcon = (category: 'ContentCutIcon' | 'BrushIcon' | 'MenuBookIcon') => {
    switch (category) {
      case 'ContentCutIcon':
        return (<ContentCutIcon />);
      case 'BrushIcon':
        return (<BrushIcon />);
      case 'MenuBookIcon':
        return (<MenuBookIcon />);
      default:
        return null;
    }
  };

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/services'); 
      if (!response.ok) {
        throw new Error('Falha ao carregar serviços.');
      }
      
      const allServices: Service[] = await response.json();

      const groupedServices = allServices.reduce((acc, service) => {
        const icon = getCategoryIcon(service.name);
        const label = icon === 'ContentCutIcon' ? 'Cabelo' : 'Outros Serviços';

        let category = acc.find(c => c.label === label);
        if (!category) {
          category = { label, icon, services: [] };
          acc.push(category);
        }
        category.services.push(service);
        return acc;
      }, [] as Category[]);
      
      setCategories(groupedServices);

    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
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
                    A partir de R${service.min_price} • {service.duration_minutes} min
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
        {categories.length === 0 && !isLoading && (
            <p>Nenhum serviço disponível no momento.</p>
        )}
      </div>
    </main>
  );
}