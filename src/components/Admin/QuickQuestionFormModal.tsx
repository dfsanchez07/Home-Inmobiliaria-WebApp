import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface QuickQuestionFormModalProps {
  question: { id: string; text: string } | null;
  onClose: () => void;
  onSave: (question: { id: string; text: string }) => void;
}

export const QuickQuestionFormModal: React.FC<QuickQuestionFormModalProps> = ({ question, onClose, onSave }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (question) {
      setText(question.text);
    }
  }, [question]);

  const handleSave = () => {
    if (text.trim() && question) {
      onSave({ ...question, text });
    }
  };

  if (!question) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{question.text ? 'Editar' : 'Nueva'} Pregunta Rápida</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div>
          <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-2">
            Texto de la pregunta
          </label>
          <input
            id="questionText"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: ¿Qué casas hay en venta?"
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Save size={18} />
            <span>Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
