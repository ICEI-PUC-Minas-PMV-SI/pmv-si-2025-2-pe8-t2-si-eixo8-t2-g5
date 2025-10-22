import AdminMenu from './components/Menu/Menu';
import styles from './layout.module.scss';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={styles.admin}>
      <div className={styles.block}>
        <AdminMenu />
        {children}
      </div>
    </main>
  );
}