import { useCallback, useState } from "react";
import { avatar } from "../helpers";
import { saveNewUser } from "../services/user.service";
import { CreateUserPayload } from "../types/user";

export function useSaveUser() {
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState(avatar());

  const saveUser = useCallback(
    async (data: CreateUserPayload): Promise<void> => {
      setIsLoading(true);

      try {
        await saveNewUser(data);
      } catch (err) {
        console.log("Error saving user:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    username,
    setUsername,
    profilePic,
    setProfilePic,
    saveUser,
    isLoading,
  };
}
