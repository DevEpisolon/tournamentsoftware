import React, { useEffect, useRef, useState } from 'react';
import { LuTrash, LuPlus } from 'react-icons/lu';

// Interface for text box data
interface TextBox {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
}

const TextBoxContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [activeBox, setActiveBox] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Add new text box
  const addTextBox = () => {
    const newBox: TextBox = {
      id: `box-${Date.now()}`,
      position: { x: 20, y: 20 },
      size: { width: 200, height: 100 },
      content: ''
    };
    setTextBoxes([...textBoxes, newBox]);
  };

  // Delete text box
  const deleteTextBox = (id: string) => {
    setTextBoxes(textBoxes.filter(box => box.id !== id));
    if (activeBox === id) {
      setActiveBox(null);
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if ((e.target as HTMLElement).classList.contains('text-box')) {
      setIsDragging(true);
      setActiveBox(id);
      const box = textBoxes.find(b => b.id === id);
      if (box) {
        setDragStart({
          x: e.clientX - box.position.x,
          y: e.clientY - box.position.y
        });
      }
    }
  };

  // Handle mouse down for resizing
  const handleResizeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setActiveBox(id);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !activeBox) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const activeBoxData = textBoxes.find(box => box.id === activeBox);
    if (!activeBoxData) return;

    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Constrain to container bounds
      const maxX = containerRect.width - activeBoxData.size.width;
      const maxY = containerRect.height - activeBoxData.size.height;

      setTextBoxes(boxes =>
        boxes.map(box =>
          box.id === activeBox
            ? {
              ...box,
              position: {
                x: Math.min(Math.max(0, newX), maxX),
                y: Math.min(Math.max(0, newY), maxY)
              }
            }
            : box
        )
      );
    }

    if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newWidth = Math.min(
        Math.max(100, activeBoxData.size.width + deltaX),
        containerRect.width - activeBoxData.position.x
      );
      const newHeight = Math.min(
        Math.max(50, activeBoxData.size.height + deltaY),
        containerRect.height - activeBoxData.position.y
      );

      setTextBoxes(boxes =>
        boxes.map(box =>
          box.id === activeBox
            ? {
              ...box,
              size: { width: newWidth, height: newHeight }
            }
            : box
        )
      );
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle content change
  const handleContentChange = (id: string, content: string) => {
    setTextBoxes(boxes =>
      boxes.map(box =>
        box.id === id
          ? { ...box, content }
          : box
      )
    );
  };

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, activeBox]);

  return (
    <div className="space-y-4">
      <button
        onClick={addTextBox}
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
      >
        <LuPlus size={20} />
        Add Text Box
      </button>

      <div
        ref={containerRef}
        className="relative w-full h-96 border-2 border-gray-300 rounded-lg"
      >
        {textBoxes.map((box) => (
          <div
            key={box.id}
            className="text-box absolute bg-white border border-gray-400 rounded cursor-move shadow-lg"
            style={{
              left: `${box.position.x}px`,
              top: `${box.position.y}px`,
              width: `${box.size.width}px`,
              height: `${box.size.height}px`,
              zIndex: activeBox === box.id ? 10 : 1
            }}
            onMouseDown={(e) => handleMouseDown(e, box.id)}
          >
            <textarea
              className="w-full h-full p-2 resize-none outline-none rounded"
              value={box.content}
              onChange={(e) => handleContentChange(box.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500 bg-white rounded-full shadow-sm transition-colors"
              onClick={() => deleteTextBox(box.id)}
            >
              <LuTrash size={16} />
            </button>
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-200 rounded-bl"
              onMouseDown={(e) => handleResizeMouseDown(e, box.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextBoxContainer;
