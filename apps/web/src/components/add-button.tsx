import { useState } from "react";
import { addService, useAddHistory } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

export const AddButton = () => {
  const queryClient = useQueryClient();
  const { history } = useAddHistory();
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    const addResult = await addService
      .post("add", {
        json: {
          a: number1,
          b: number2,
        },
        throwHttpErrors: false,
      })
      .json<
        | { result: number }
        | {
            error: string;
          }
      >();

    if ("error" in addResult) {
      setError(addResult.error);
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["add-history"],
    });

    setError("");
    setResult(addResult.result);
  };

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-2 items-center text-lg">
        <input
          value={number1}
          onChange={(e) => setNumber1(Number(e.target.value))}
          className="flex-1 border-2 rounded-lg p-1"
          type="number"
        />
        <span>+</span>
        <input
          value={number2}
          onChange={(e) => setNumber2(Number(e.target.value))}
          className="flex-1 border-2 rounded-lg p-1"
          type="number"
        />
        <span>=</span>
        <span>{result ?? "?"}</span>
      </div>

      <hr />

      <button
        className="px-2 py-1 rounded-md bg-blue-500 text-white"
        onClick={handleAdd}
      >
        Add
      </button>

      {history && history.length > 0 && (
        <>
          <hr />

          <ul>
            {history?.map((historyItem) => (
              <li key={historyItem.id}>
                {historyItem.a} + {historyItem.b} = {historyItem.result}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
