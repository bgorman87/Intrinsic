import { useState } from 'react';

interface CollapsibleTextProps {
  text: string;
  maxLength: number;
}

const CollapsibleText = ({ text, maxLength }: CollapsibleTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  return (
    <div>
      <p>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
        <span
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </span>
      </p>
    </div>
  );
};

export default CollapsibleText;
