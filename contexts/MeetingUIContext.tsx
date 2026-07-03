"use client";

import { createContext, useContext, useState } from "react";

type MeetingUIValue = {
  sideVisible: boolean;
  toggleSide: () => void;
  inCallCount: number;
  invitedCount: number;
  admitParticipant: () => void;
};

const MeetingUIContext = createContext<MeetingUIValue>({
  sideVisible: true,
  toggleSide: () => {},
  inCallCount: 16,
  invitedCount: 2,
  admitParticipant: () => {},
});

export function MeetingUIProvider({ children }: { children: React.ReactNode }) {
  const [sideVisible, setSideVisible] = useState(true);
  const [inCallCount, setInCallCount] = useState(16);
  const [invitedCount, setInvitedCount] = useState(2);

  const admitParticipant = () => {
    setInCallCount((n) => n + 1);
    setInvitedCount((n) => Math.max(0, n - 1));
  };

  return (
    <MeetingUIContext.Provider
      value={{
        sideVisible,
        toggleSide: () => setSideVisible((v) => !v),
        inCallCount,
        invitedCount,
        admitParticipant,
      }}
    >
      {children}
    </MeetingUIContext.Provider>
  );
}

export function useMeetingUI() {
  return useContext(MeetingUIContext);
}
