import React, { useCallback, useRef, useState } from 'react';
import './two-columns-layout.scss';

type IProps = {
  left: React.ReactNode;
  right: React.ReactNode;
}

const TwoColumnsLayout: React.FC<IProps> = ({ left, right }) => {
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

      leftColumnRef.current.style.minWidth = `${e.clientX}px`;
      leftColumnRef.current.style.maxWidth = `${e.clientX}px`;
      leftColumnRef.current.style.width = `${e.clientX}px`;
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
    <div className={'two-columns-layout'}>
      <div ref={leftColumnRef} className={'column'}>
        {left}
        <div onMouseDown={onMouseDown} className={'resizer'} />
      </div>
      <div className={'column'}>{right}</div>
    </div>
  );
};

export default TwoColumnsLayout;
