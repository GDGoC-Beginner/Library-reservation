export const formatTimeRange = (startISO, endISO) => {
  if (!startISO || !endISO) return "-";

  const toHHMM = (iso) => {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  return `${toHHMM(startISO)} ~ ${toHHMM(endISO)}`;
};
