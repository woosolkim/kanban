import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef, useEffect } from "react";
import type { Card as CardType } from "../App";

interface Props {
  card: CardType;
  listId: string;
  onUpdate: (listId: string, cardId: string, content: string) => void;
  onDelete: (listId: string, cardId: string) => void;
}

export function Card({ card, listId, onUpdate, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(card.content === "");
  const [content, setContent] = useState(card.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      adjustTextareaHeight(textareaRef.current);
    }
  }, [isEditing]);

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleContentClick = (e: React.MouseEvent) => {
    if (e.detail === 1) {
      const target = e.target as HTMLElement;
      if (!target.closest("button")) {
        setIsEditing(true);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (content.trim() !== card.content) {
      if (content.trim() === "") {
        onDelete(listId, card.id);
      } else {
        onUpdate(listId, card.id, content.trim());
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.altKey || e.shiftKey)) {
      e.preventDefault();
      textareaRef.current?.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setContent(card.content);
      textareaRef.current?.blur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? {} : { ...listeners, ...attributes })}
      className={`
        mt-[5px] mb-[5px] bg-white rounded-[2px] relative
        ${isDragging ? "opacity-0" : ""}
        ${
          isEditing
            ? "outline-[1px] outline-[#8eaedd] shadow-none"
            : "shadow-[0_1px_2px_#bbb,0_0_1px_#ddd]"
        }
        touch-none
      `}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full px-[10px] py-[5px] text-[11px] leading-[13.75px] resize-none border-none outline-none min-h-[calc(1.25*11px)]"
          style={{
            overflow: "hidden",
          }}
        />
      ) : (
        <>
          <div
            onClick={handleContentClick}
            className="px-[10px] py-[5px] pr-[15px] min-h-[calc(1.25*11px)] whitespace-pre-wrap break-words text-[11px] leading-[13.75px] cursor-text"
          >
            {card.content}
          </div>
          <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity duration-400 cursor-default">
            <span
              onClick={() => onDelete(listId, card.id)}
              className="px-[4px] h-[22px] flex items-center justify-center text-[8px]"
            >
              ❌
            </span>
          </div>
        </>
      )}
    </div>
  );
}
