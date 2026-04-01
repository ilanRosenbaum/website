import React, { useEffect, useMemo, useState } from "react";
import { get, ref, set } from "firebase/database";
import { realtimeDb } from "../firebase";

type NewsletterTopic = "blog" | "research";

interface NewsletterPreferences {
  email: string;
  blog: boolean;
  research: boolean;
}

interface NewsletterSubscriptionProps {
  currentTopic: NewsletterTopic | null;
}

const BACK_BUTTON_PURPLE = "#603b61";
const COOKIE_NAME = "newsletter_preferences";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const cookieParts = document.cookie.split(";");
  for (const part of cookieParts) {
    const trimmedPart = part.trim();
    if (trimmedPart.startsWith(prefix)) {
      return trimmedPart.substring(prefix.length);
    }
  }
  return null;
};

const readPreferences = (): NewsletterPreferences | null => {
  const value = getCookieValue(COOKIE_NAME);
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (
      typeof parsed?.email === "string" &&
      typeof parsed?.blog === "boolean" &&
      typeof parsed?.research === "boolean"
    ) {
      return {
        email: parsed.email,
        blog: parsed.blog,
        research: parsed.research,
      };
    }
  } catch {
    return null;
  }

  return null;
};

const writePreferences = (preferences: NewsletterPreferences): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(preferences)
  )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

const clearPreferences = (): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
};

const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isSubscribedValue = (value: unknown): boolean => value === true;
const getEmailKey = (value: string): string => {
  const normalizedEmail = value.trim().toLowerCase();
  return Array.from(new TextEncoder().encode(normalizedEmail))
    .map((byteValue) => byteValue.toString(16).padStart(2, "0"))
    .join("");
};

const readRemotePreferences = async (value: string): Promise<{ blog: boolean; research: boolean }> => {
  const emailKey = getEmailKey(value);
  const [blogSnapshot, researchSnapshot] = await Promise.all([
    get(ref(realtimeDb, `/blog/${emailKey}`)),
    get(ref(realtimeDb, `/research/${emailKey}`)),
  ]);

  return {
    blog: isSubscribedValue(blogSnapshot.val()),
    research: isSubscribedValue(researchSnapshot.val()),
  };
};

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ currentTopic }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSettingsMode, setIsSettingsMode] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscribedEmail, setSubscribedEmail] = useState<string>("");
  const [blogChecked, setBlogChecked] = useState<boolean>(false);
  const [researchChecked, setResearchChecked] = useState<boolean>(false);
  const [isInitialSyncLoading, setIsInitialSyncLoading] = useState<boolean>(false);
  const [isLookupLoading, setIsLookupLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const hasSelectedTopics = blogChecked || researchChecked;
  const isAnyLoading = isInitialSyncLoading || isLookupLoading || isSubmitLoading;

  const submitLabel = useMemo(() => {
    if (!hasSelectedTopics) {
      return "Unsubscribe";
    }
    return isSettingsMode ? "Submit" : "Subscribe";
  }, [hasSelectedTopics, isSettingsMode]);
  const modalEmail = isSettingsMode ? subscribedEmail : "";

  useEffect(() => {
    const preferences = readPreferences();
    if (!preferences?.email) {
      return;
    }

    const syncFromRemote = async () => {
      setIsInitialSyncLoading(true);
      try {
        const remote = await readRemotePreferences(preferences.email);
        if (!remote.blog && !remote.research) {
          clearPreferences();
          setIsSubscribed(false);
          setSubscribedEmail("");
          setBlogChecked(false);
          setResearchChecked(false);
          return;
        }

        const syncedPreferences: NewsletterPreferences = {
          email: preferences.email,
          blog: remote.blog,
          research: remote.research,
        };

        writePreferences(syncedPreferences);
        setIsSubscribed(true);
        setSubscribedEmail(preferences.email);
        setBlogChecked(remote.blog);
        setResearchChecked(remote.research);
      } catch {
        setError("Could not verify subscription status right now.");
      } finally {
        setIsInitialSyncLoading(false);
      }
    };

    syncFromRemote();
  }, []);

  const openSubscribeModal = async (): Promise<void> => {
    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLookupLoading(true);
    try {
      const remote = await readRemotePreferences(trimmedEmail);
      if (remote.blog || remote.research) {
        const syncedPreferences: NewsletterPreferences = {
          email: trimmedEmail,
          blog: remote.blog,
          research: remote.research,
        };

        writePreferences(syncedPreferences);
        setIsSubscribed(true);
        setSubscribedEmail(trimmedEmail);
        setBlogChecked(remote.blog);
        setResearchChecked(remote.research);
        setEmail("");
        setError("");
        return;
      }
    } catch {
      setError("Could not check subscription status right now.");
      return;
    } finally {
      setIsLookupLoading(false);
    }

    setError("");
    setIsSettingsMode(false);
    setBlogChecked(currentTopic === "blog");
    setResearchChecked(currentTopic === "research");
    setIsModalOpen(true);
  };

  const openSettingsModal = (): void => {
    const preferences = readPreferences();
    if (!preferences) {
      return;
    }

    setBlogChecked(preferences.blog);
    setResearchChecked(preferences.research);
    setIsSettingsMode(true);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    if (isSubmitLoading) {
      return;
    }
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (): Promise<void> => {
    const resolvedEmail = isSettingsMode ? subscribedEmail : email.trim();
    if (!isValidEmail(resolvedEmail)) {
      setError("Please enter a valid email address.");
      setIsModalOpen(false);
      return;
    }

    const emailKey = getEmailKey(resolvedEmail);
    setIsSubmitLoading(true);

    if (!hasSelectedTopics) {
      try {
        await Promise.all([
          set(ref(realtimeDb, `/blog/${emailKey}`), false),
          set(ref(realtimeDb, `/research/${emailKey}`), false),
        ]);

        // TODO: Trigger unsubscribe action against backend/API.
        clearPreferences();
        setIsSubscribed(false);
        setSubscribedEmail("");
        setEmail("");
        setError("");
        setIsModalOpen(false);
      } catch {
        setError("Could not update subscription right now.");
      } finally {
        setIsSubmitLoading(false);
      }
      return;
    }

    const nextPreferences: NewsletterPreferences = {
      email: resolvedEmail,
      blog: blogChecked,
      research: researchChecked,
    };

    try {
      await Promise.all([
        set(ref(realtimeDb, `/blog/${emailKey}`), blogChecked),
        set(ref(realtimeDb, `/research/${emailKey}`), researchChecked),
      ]);

      writePreferences(nextPreferences);
      setSubscribedEmail(resolvedEmail);
      setIsSubscribed(true);
      setEmail("");
      setError("");
      setIsModalOpen(false);
    } catch {
      setError("Could not update subscription right now.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <>
      {!isSubscribed ? (
        <div className="w-full">
          <div className="flex w-full items-center rounded-md border-2 p-1" style={{ borderColor: BACK_BUTTON_PURPLE }}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-2/3 px-1.5 sm:px-3 py-2 font-mono text-[clamp(8px,2.2vw,14px)] bg-transparent text-[#ffebcd] rounded-md focus:outline-none"
              aria-label="Email address"
              disabled={isAnyLoading}
            />
            <button
              type="button"
              onClick={openSubscribeModal}
              className="ml-1 sm:ml-2 w-[calc(33.333%-0.25rem)] sm:w-[calc(33.333%-0.5rem)] px-1.5 sm:px-3 py-1.5 font-mono text-[clamp(8px,2.2vw,14px)] text-[#ffebcd] rounded-md"
              style={{ backgroundColor: BACK_BUTTON_PURPLE, border: "1px solid #4B5563" }}
              disabled={isAnyLoading}
            >
              {isLookupLoading ? "Loading..." : "Subscribe"}
            </button>
          </div>
          {isInitialSyncLoading && <div className="mt-2 text-xs font-mono text-gray-300">Loading subscription status...</div>}
          {error && <div className="mt-2 text-xs font-mono text-red-300">{error}</div>}
        </div>
      ) : (
        <div className="absolute mr-1 top-2 right-2 z-20 flex items-center">
          <button
            type="button"
            onClick={openSettingsModal}
            className="p-1"
            aria-label="Newsletter settings"
            title="Newsletter settings"
            disabled={isAnyLoading}
          >
            <span
              className="block w-10 h-10 m-5"
              style={{
                backgroundColor: BACK_BUTTON_PURPLE,
                WebkitMaskImage: "url('/settings.svg')",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                WebkitMaskSize: "contain",
                maskImage: "url('/settings.svg')",
                maskRepeat: "no-repeat",
                maskPosition: "center",
                maskSize: "contain",
              }}
            />
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={closeModal}
            aria-label="Close newsletter modal"
          />
          <div className="relative w-fit max-w-[90vw] rounded-md bg-[#1e1e1e] p-6">
            <h2 className="font-mono text-lg text-[#ffebcd] mb-4">Newsletter Preferences</h2>
            {modalEmail && <div className="mb-4 text-xs font-mono text-gray-300">{modalEmail}</div>}

            <div className="space-y-3 mb-6 font-mono text-sm text-[#ffebcd]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blogChecked}
                  onChange={(event) => setBlogChecked(event.target.checked)}
                  disabled={isSubmitLoading}
                />
                Blog
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={researchChecked}
                  onChange={(event) => setResearchChecked(event.target.checked)}
                  disabled={isSubmitLoading}
                />
                Research
              </label>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-2 font-mono text-xs sm:text-sm rounded-md border border-gray-500 text-[#ffebcd]"
                disabled={isSubmitLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                className="px-3 py-2 font-mono text-xs sm:text-sm rounded-md text-[#ffebcd]"
                style={{ backgroundColor: BACK_BUTTON_PURPLE }}
                disabled={isSubmitLoading}
              >
                {isSubmitLoading
                  ? hasSelectedTopics
                    ? isSettingsMode
                      ? "Saving..."
                      : "Subscribing..."
                    : "Unsubscribing..."
                  : submitLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsletterSubscription;