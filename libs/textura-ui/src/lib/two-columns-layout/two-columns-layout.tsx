import React, {useCallback, useRef, useState} from 'react';
import './two-columns-layout.scss';
import {Panel} from "../panel/panel";

type IProps = {
  left: React.ReactNode;
  right: React.ReactNode;
}

export const TwoColumnsLayout: React.FC<IProps> = ({left, right}) => {
  const [isResizing, setIsResizing] = useState(false);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !leftColumnRef.current) return;

      if (e.clientX < 100) {
        return;
      }

      const windowWidth = window.innerWidth;

      if (windowWidth - e.clientX < 100) {
        return;
      }

      const newWidth = e.clientX - 3;

      leftColumnRef.current.style.minWidth = `${newWidth}px`;
      leftColumnRef.current.style.maxWidth = `${newWidth}px`;
      leftColumnRef.current.style.width = `${newWidth}px`;
    },
    [isResizing]
  );

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, onMouseMove, onMouseUp]);

  return (
    <Panel style={{position: 'relative'}}>
      <Panel style={{
        backgroundColor: 'var(--color-background-dark)',
      }} ref={leftColumnRef}>
        {left}
      </Panel>
      <div onMouseDown={onMouseDown} className={'two-columns-resizer'}/>
      <Panel style={{
        backgroundColor: 'var(--color-background-dark)',
      }}>
        {right}
      </Panel>
    </Panel>
  );
};
