import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface CardType {
  id: string;
  content: string;
}

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded shadow cursor-pointer hover:shadow-md"
    >
      {card.content}
    </div>
  );
}
