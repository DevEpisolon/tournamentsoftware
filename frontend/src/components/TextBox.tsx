import React, { useState, useRef } from 'react';

interface TextBoxProps {
  id: number;
  onResize: (id: number, size: { width: number; height: number }) => void;
  onMove: (id: number, position: { x: number; y: number }) => void;
  onDelete: (id: number) => void;
}

const TextBox: React.FC<TextBoxProps> = ({ id, onResize, onMove, onDelete }) => {
  const [content, setContent] = useState('');
  const textBoxRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (textBoxRef.current) {
      const { width, height } = textBoxRef.current.getBoundingClientRect();
      onResize(id, { width, height });
    }
  };

  const handleMove = () => {
    if (textBoxRef.current) {
      const { left, top } = textBoxRef.current.getBoundingClientRect();
      onMove(id, { x: left, y: top });
    }
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div
      ref={textBoxRef}
      className="text-box"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 200,
        height: 100,
      }}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onMouseUp={handleResize}
        onMouseMove={handleMove}
      />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TextBox;
