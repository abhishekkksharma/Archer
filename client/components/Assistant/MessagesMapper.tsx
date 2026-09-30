import React from "react";
import Message from "./Message";

interface MessageData {
  id: number;
  role: "system" | "user";
  message: string;
}

const messages: MessageData[] = [
  {
    id: 1,
    role: "user",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet aut velit beatae dolor architecto perspiciatis libero commodi ducimus!",
  },
  {
    id: 2,
    role: "system",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet aut velit beatae dolor architecto perspiciatis libero commodi ducimus! Iusto beatae illum provident voluptatem ex dolor laboriosam.",
  },
  {
    id: 3,
    role: "user",
    message:
      "Can you explain how this works in a little more detail?",
  },
  {
    id: 4,
    role: "system",
    message:
      "Sure. The messages are rendered dynamically from an array, which makes it easy to replace the static data with messages coming from your API or database later.",
  },
  {
    id: 5,
    role: "user",
    message:
      "Sure. The messages are rendered dynamically from an array, which makes it easy to replace the static data with messages coming from your API or database later.",
  },
  {
    id: 6,
    role: "system",
    message:
      "Sure. The messages are rendered dynamically from an array, which makes it easy to replace the static data with messages coming from your API or database later.",
  },
  {
    id: 7,
    role: "user",
    message:
      "Sure. The messages are rendered dynamically from an array, which makes it easy to replace the static data with messages coming from your API or database later.",
  },
  {
    id: 8,
    role: "system",
    message:
      "Sure. The messages are rendered dynamically from an array, which makes it easy to replace the static data with messages coming from your API or database later.",
  },
  {
    id: 9,
    role: "user",
    message:
      "Sure. The messages are rendered dynamically from an array, which makes it easy to replace the static data with messages coming from your API or database later.",
  },
];

function MessagesMapper() {
  return (
    <div
      className="
        flex
        w-full
        flex-col
        gap-4
        px-3
        py-4
        sm:px-5
      "
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          message={message.message}
        />
      ))}
    </div>
  );
}

export default MessagesMapper;