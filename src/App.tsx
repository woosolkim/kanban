import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { List } from "./components/List";
import { nanoid } from "nanoid";

export interface Card {
  id: string;
  content: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export default function App() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 이상 움직여야 드래그 시작
      },
    })
  );

  const [lists, setLists] = useLocalStorage<List[]>("kanban-lists", [
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

  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const draggedCard = lists
      .flatMap((list) => list.cards)
      .find((card) => card.id === event.active.id);

    if (draggedCard) {
      setActiveCard(draggedCard);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    let sourceListId = "";
    let sourceCardIndex = -1;

    lists.forEach((list) => {
      const cardIndex = list.cards.findIndex((card) => card.id === activeId);
      if (cardIndex !== -1) {
        sourceListId = list.id;
        sourceCardIndex = cardIndex;
      }
    });

    const targetList = lists.find((list) => {
      return (
        list.id === overId || list.cards.some((card) => card.id === overId)
      );
    });

    if (!targetList) return;

    setLists((currentLists) => {
      const newLists = [...currentLists];
      const sourceList = newLists.find((list) => list.id === sourceListId)!;

      if (overId === targetList.id) {
        if (sourceListId === targetList.id) return currentLists;

        const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);
        targetList.cards.push(movedCard);
        return newLists;
      }

      const targetCardIndex = targetList.cards.findIndex(
        (card) => card.id === overId
      );
      if (targetCardIndex === -1) return currentLists;

      if (sourceListId === targetList.id) {
        targetList.cards = arrayMove(
          targetList.cards,
          sourceCardIndex,
          targetCardIndex
        );
      } else {
        const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);
        targetList.cards.splice(targetCardIndex, 0, movedCard);
      }

      return newLists;
    });

    setActiveCard(null);
  };

  const updateListTitle = (listId: string, newTitle: string) => {
    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
  };

  const addCard = (listId: string) => {
    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [...list.cards, { id: nanoid(), content: "" }],
            }
          : list
      )
    );
  };

  const updateCard = (listId: string, cardId: string, content: string) => {
    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, content } : card
              ),
            }
          : list
      )
    );
  };

  const deleteCard = (listId: string, cardId: string) => {
    setLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            }
          : list
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="min-w-fit w-max mx-auto p-5">
          <div className="flex gap-5">
            {lists.map((list) => (
              <List
                key={list.id}
                list={list}
                onUpdateTitle={updateListTitle}
                onAddCard={addCard}
                onUpdateCard={updateCard}
                onDeleteCard={deleteCard}
              />
            ))}
            <button className="h-[30px] px-5 bg-[#EAEDF0] rounded-[2px] text-[#000000A0] hover:text-black">
              + Add another list
            </button>
          </div>
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="w-[220px] bg-[#CED4DA] rounded-[2px] shadow-[0_1px_0_#0001_inset,0_-1px_0_#0001_inset,1px_0_0_#0001_inset,-1px_0_0_#0001_inset]">
              <div className="px-[10px] py-[5px] min-h-[calc(1.25*11px)] whitespace-pre-wrap break-words">
                {activeCard.content}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
