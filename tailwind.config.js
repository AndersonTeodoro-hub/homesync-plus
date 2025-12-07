extend: {
  keyframes: {
    syncListen: {
      "0%": { transform: "scale(1)", opacity: "1" },
      "50%": { transform: "scale(1.08)", opacity: "0.85" },
      "100%": { transform: "scale(1)", opacity: "1" },
    },
    syncTalk: {
      "0%": { transform: "scale(1)" },
      "50%": { transform: "scale(1.12)" },
      "100%": { transform: "scale(1)" },
    },
  },
  animation: {
    "sync-listen": "syncListen 2s ease-in-out infinite",
    "sync-talk": "syncTalk 0.35s ease-in-out infinite",
  },
}
