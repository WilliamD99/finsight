import CryptoJS from "crypto-js";
import { createClient } from "../supabase/server";

export function decryptToken(token: string) {
  const decrytedToken = CryptoJS.AES.decrypt(
    token,
    process.env.ENCRYPTION_KEY!
  ).toString(CryptoJS.enc.Utf8);
  return decrytedToken;
}

// If user hasn't setup, they will be redirected to setup page
export const checkUserSetup = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasSetup = user?.user_metadata.hasSetup;
  return hasSetup;
};
