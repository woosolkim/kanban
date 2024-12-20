import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { List, ListType } from "./List";
import { Card, CardType } from "./Card";

export default function Board() {
  const [lists, setLists] = useState<ListType[]>([
    {
      id: "1",
      title: "To Do",
      cards: [
        { id: "1", content: "Task 1" },
        { id: "2", content: "Task 2" },
      ],
    },
    {
      id: "2",
      title: "In Progress",
      cards: [{ id: "3", content: "Task 3" }],
    },
  ]);

  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeCard = lists
      .flatMap((list) => list.cards)
      .find((card) => card.id === active.id);

    setActiveCard(activeCard || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const activeListId = lists.find((list) =>
        list.cards.some((card) => card.id === active.id)
      )?.id;

      const overListId = lists.find((list) =>
        list.cards.some((card) => card.id === over.id)
      )?.id;

      if (activeListId && overListId) {
        setLists((lists) => {
          const newLists = [...lists];
          const activeList = newLists.find((list) => list.id === activeListId)!;
          const overList = newLists.find((list) => list.id === overListId)!;

          const activeCardIndex = activeList.cards.findIndex(
            (card) => card.id === active.id
          );
          const overCardIndex = overList.cards.findIndex(
            (card) => card.id === over.id
          );

          const activeCard = activeList.cards[activeCardIndex];

          // Remove from active list
          activeList.cards.splice(activeCardIndex, 1);

          // Add to over list
          overList.cards.splice(overCardIndex, 0, activeCard);

          return newLists;
        });
      }
    }

    setActiveCard(null);
  }

  return (
    <div className="h-screen p-4">
      <div className="flex flex-col h-full">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Kanban Board</h1>
        </header>

        <main className="flex-1 overflow-x-auto">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full">
              {lists.map((list) => (
                <List key={list.id} list={list} />
              ))}

              <button className="flex-shrink-0 w-72 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
                + Add another list
              </button>
            </div>

            <DragOverlay>
              {activeCard ? <Card card={activeCard} /> : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
}
