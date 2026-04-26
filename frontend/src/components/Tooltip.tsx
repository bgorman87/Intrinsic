import { useState, useRef, useEffect } from 'react';
import '../styles/Tooltip.css';

interface Props {
  text: string;
}

const Tooltip = ({ text }: Props) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="tooltip-wrap" ref={ref}>
      <button
        className="tooltip-trigger"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(v => !v)}
        aria-label="More information"
      >
        ?
      </button>
      {visible && (
        <div className="tooltip-box">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;