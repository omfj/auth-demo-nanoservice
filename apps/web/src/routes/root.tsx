import { useAuthServiceInfo, useAddServiceInfo } from "../lib/api";
import { AddButton } from "../components/add-button";

export const Root = () => {
  const { info: authInfo } = useAuthServiceInfo();
  const { info: addInfo } = useAddServiceInfo();

  return (
    <>
      <h1 className="font-medium text-xl">Welcome to Nanoservice Auth Demo!</h1>

      <hr />

      <div>
        <p>Auth Info: {authInfo}</p>
        <p>Add Info: {addInfo}</p>
      </div>

      <hr />

      <AddButton />
    </>
  );
};
