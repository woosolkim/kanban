import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "./Card";
import { useState, useRef, useEffect } from "react";
import type { List as ListType } from "../App";

interface Props {
  list: ListType;
  onUpdateTitle: (listId: string, newTitle: string) => void;
  onAddCard: (listId: string) => void;
  onUpdateCard: (listId: string, cardId: string, content: string) => void;
  onDeleteCard: (listId: string, cardId: string) => void;
}

export function List({
  list,
  onUpdateTitle,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}: Props) {
  const { setNodeRef } = useDroppable({
    id: list.id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (title.trim() !== list.title) {
      onUpdateTitle(list.id, title.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      if (e.key === "Escape") {
        setTitle(list.title);
      }
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="w-[220px] bg-gradient-to-b from-[#EAEDF0] from-30px to-[#DDE1E5] to-90px rounded-[2px]"
    >
      <div className="p-[5px] relative">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[20px] px-[5px] pb-[2px] text-[13.6px] leading-[1.47] font-medium bg-white outline-[1px] outline-[#8eaedd] rounded-none"
          />
        ) : (
          <div
            onClick={handleTitleClick}
            className="min-h-[20px] px-[5px] pb-[2px] text-[13.6px] leading-[1.47] font-medium whitespace-pre overflow-hidden cursor-text"
          >
            {list.title}
          </div>
        )}
        {!isEditing && (
          <div
            className="absolute top-0 right-0 h-[20px] py-[5px] px-[6px] pl-[30px] bg-gradient-to-r from-transparent from-0% to-[#EAEDF0] to-10px"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            {isMenuOpen ? (
              <div className="">
                <span
                  onClick={() => onAddCard(list.id)}
                  className="mr-2 cursor-pointer"
                >
                  +
                </span>
                <span>≡</span>
              </div>
            ) : (
              <span>≡</span>
            )}
          </div>
        )}
      </div>
      <div className="px-[5px]">
        <SortableContext
          items={list.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              listId={list.id}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
