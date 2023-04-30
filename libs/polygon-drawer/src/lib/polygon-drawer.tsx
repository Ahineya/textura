import styles from './polygon-drawer.module.scss';

/* eslint-disable-next-line */
export interface PolygonDrawerProps {}

export function PolygonDrawer(props: PolygonDrawerProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to PolygonDrawer!</h1>
    </div>
  );
}

export default PolygonDrawer;
