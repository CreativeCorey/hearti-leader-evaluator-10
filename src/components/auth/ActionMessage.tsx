
interface ActionMessageProps {
  message: {
    text: string;
    type: "success" | "error";
  } | null;
}

const ActionMessage = ({ message }: ActionMessageProps) => {
  if (!message) return null;

  return (
    <div className={`text-sm p-2 rounded ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
      {message.text}
    </div>
  );
};

export default ActionMessage;
