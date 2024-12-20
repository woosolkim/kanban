import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardType } from "./Card";

export interface ListType {
  id: string;
  title: string;
  cards: CardType[];
}

interface ListProps {
  list: ListType;
}

export function List({ list }: ListProps) {
  const { setNodeRef } = useDroppable({
    id: list.id,
  });

  return (
    <div className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4">
      <h2 className="font-bold mb-4">{list.title}</h2>
      <div ref={setNodeRef} className="flex flex-col gap-2">
        <SortableContext
          items={list.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
