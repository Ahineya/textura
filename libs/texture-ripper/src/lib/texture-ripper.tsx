import styles from './texture-ripper.module.scss';

/* eslint-disable-next-line */
export interface TextureRipperProps {}

export function TextureRipper(props: TextureRipperProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TextureRipper!</h1>
    </div>
  );
}

export default TextureRipper;
