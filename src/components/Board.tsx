import { useState } from "react";

interface List {
  id: string;
  title: string;
  cards: Card[];
}

interface Card {
  id: string;
  content: string;
}

export default function Board() {
  const [lists, setLists] = useState<List[]>([
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

  return (
    <div className="h-screen p-4">
      <div className="flex flex-col h-full">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Kanban Board</h1>
        </header>

        <main className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full">
            {lists.map((list) => (
              <div
                key={list.id}
                className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4"
              >
                <h2 className="font-bold mb-4">{list.title}</h2>
                <div className="flex flex-col gap-2">
                  {list.cards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white p-3 rounded shadow cursor-pointer hover:shadow-md"
                    >
                      {card.content}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button className="flex-shrink-0 w-72 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
              + Add another list
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
