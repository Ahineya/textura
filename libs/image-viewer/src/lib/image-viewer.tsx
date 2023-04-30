import styles from './image-viewer.module.scss';

/* eslint-disable-next-line */
export interface ImageViewerProps {}

export function ImageViewer(props: ImageViewerProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ImageViewer!</h1>
    </div>
  );
}

export default ImageViewer;
