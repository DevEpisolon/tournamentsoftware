import React, { useState } from 'react';
import TextBox from './TextBox';

interface TextBoxData {
  id: number;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const TournamentInfo: React.FC = () => {
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);

  const addTextBox = () => {
    const newTextBox: TextBoxData = {
      id: Date.now(),
      content: '',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
    };
    setTextBoxes([...textBoxes, newTextBox]);
  };

  const handleResize = (id: number, size: { width: number; height: number }) => {
    const updatedTextBoxes = textBoxes.map((textBox) => {
      if (textBox.id === id) {
        return { ...textBox, size };
      }
      return textBox;
    });
    setTextBoxes(updatedTextBoxes);
  };

  const handleMove = (id: number, position: { x: number; y: number }) => {
    const updatedTextBoxes = textBoxes.map((textBox) => {
      if (textBox.id === id) {
        return { ...textBox, position };
      }
      return textBox;
    });
    setTextBoxes(updatedTextBoxes);
  };

  const handleDelete = (id: number) => {
    const updatedTextBoxes = textBoxes.filter((textBox) => textBox.id !== id);
    setTextBoxes(updatedTextBoxes);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-white">Tournament Info</h2>
      <div className="blank-page">
        {textBoxes.map((textBox) => (
          <TextBox
            key={textBox.id}
            id={textBox.id}
            onResize={handleResize}
            onMove={handleMove}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <button onClick={addTextBox}>Add Text Box</button>
      <div className="border-4 border-white p-4 rounded-md shadow-md mb-8 bg-gray-200">
      </div>
    </div>
  );
};

export default TournamentInfo;
