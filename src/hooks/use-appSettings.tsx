import { useLiveQuery } from "dexie-react-hooks";
import { createClient } from "@/utils/supabase/client";
import db, { AppSettings } from "@/utils/dexie";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useAppSettings() {
  const queryClient = useQueryClient();

  // Retrieve local settings from Dexie
  const localSettingsArray = useLiveQuery(() => db.appSettings.toArray(), []);
  const localSettings = localSettingsArray?.[0];
  if (localSettings) {
    // console.log("📦 Using Dexie data:", localSettings);
  }

  // Check if Dexie is still loading
  const isDexieLoading = localSettingsArray === undefined;
  // Initialize Supabase
  const supabase = createClient();

  // Fetch settings from Supabase and cache it
  const { data: supabaseSettings, isLoading: isSupabaseLoading } =
    useQuery<AppSettings | null>({
      queryKey: ["app-settings"],
      queryFn: async () => {
        // console.log("🔄 Fetching from Supabase...");

        const { data, error } = await supabase
          .from("App Settings")
          .select("*")
          .single();

        if (error) {
          console.error("Error fetching settings from Supabase:", error);
          return null;
        }

        // Cache fetched settings in Dexie
        if (data) {
          await db.appSettings.clear(); // Clear old settings
          await db.appSettings.add(data as AppSettings);
        }

        return data as AppSettings;
      },
      enabled: !isDexieLoading && !localSettings, // Only fetch from Supabase if Dexie has no data
      refetchOnWindowFocus: false, // Prevent automatic refetching on window focus
    });

  // Ensure React Query knows about the latest data
  if (localSettings) {
    queryClient.setQueryData(["app-settings"], localSettings);
  }

  // Determine final loading state
  const isLoading = isSupabaseLoading || isDexieLoading;

  return {
    data: localSettings || supabaseSettings,
    isLoading,
  };
}
