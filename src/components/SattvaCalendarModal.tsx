import React, { useState } from "react";
import { X, Calendar, Check, Download, ExternalLink, CalendarDays, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface CalendarHabit {
  id: string;
  title: string;
  description: string;
  defaultTime: string;
}

interface SattvaCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: CalendarHabit[];
  title?: string;
  subtitle?: string;
}

export default function SattvaCalendarModal({
  isOpen,
  onClose,
  habits,
  title = "Vedic Habit Calendar Sync",
  subtitle = "Schedule daily recurring reminders & guidelines directly on your Google or device calendar.",
}: SattvaCalendarModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => habits.map((h) => h.id));
  const [times, setTimes] = useState<{ [key: string]: string }>(() => {
    const initialTimes: { [key: string]: string } = {};
    habits.forEach((h) => {
      initialTimes[h.id] = h.defaultTime;
    });
    return initialTimes;
  });

  const handleToggleHabit = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTimeChange = (id: string, newTime: string) => {
    setTimes((prev) => ({ ...prev, [id]: newTime }));
  };

  const syncIndividualGoogleCalendar = (habit: CalendarHabit) => {
    const timeValue = times[habit.id] || habit.defaultTime;
    const [hours, minutes] = timeValue.split(":");
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    
    // Create local appointment block (standard for individual device timezone rendering)
    const hh = hours.padStart(2, "0");
    const mm = minutes.padStart(2, "0");
    
    // End time is 15 minutes later
    const endMinutes = Number(mm) + 15;
    const endHours = Number(hh) + (endMinutes >= 60 ? 1 : 0);
    const mmEnd = String(endMinutes % 60).padStart(2, "0");
    const hhEnd = String(endHours % 24).padStart(2, "0");
    
    const dateStr = `${year}${month}${day}T${hh}${mm}00/${year}${month}${day}T${hhEnd}${mmEnd}00`;
    
    const gTitle = encodeURIComponent(habit.title);
    const gDesc = encodeURIComponent(`${habit.description}\n\nSynced via VedaScan - Traditional Ayurvedic Health Guide.`);
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gTitle}&dates=${dateStr}&details=${gDesc}&recur=RRULE:FREQ=DAILY`;
    window.open(url, "_blank");
  };

  const exportAllToIcs = () => {
    const selectedHabits = habits.filter((h) => selectedIds.includes(h.id));
    if (selectedHabits.length === 0) return;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//VedaScan//AyurCalendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];

    selectedHabits.forEach((habit, index) => {
      const timeValue = times[habit.id] || habit.defaultTime;
      const [hours, minutes] = timeValue.split(":");
      
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      
      const hh = hours.padStart(2, "0");
      const mm = minutes.padStart(2, "0");
      
      const endMinutes = Number(mm) + 15;
      const endHours = Number(hh) + (endMinutes >= 60 ? 1 : 0);
      const mmEnd = String(endMinutes % 60).padStart(2, "0");
      const hhEnd = String(endHours % 24).padStart(2, "0");

      const dtstart = `${year}${month}${day}T${hh}${mm}00`;
      const dtend = `${year}${month}${day}T${hhEnd}${mmEnd}00`;
      const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const uid = `vedascan-habit-${index}-${Date.now()}@vedascan.app`;

      // Clean special characters for ICS compatibility
      const cleanDesc = habit.description.replace(/,/g, "\\,").replace(/;/g, "\\;");

      icsContent.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        "RRULE:FREQ=DAILY",
        `SUMMARY:${habit.title}`,
        `DESCRIPTION:${cleanDesc}`,
        "END:VEVENT"
      );
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "ayurveda_daily_habits.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="calendar-sync-overlay" 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full max-w-lg bg-[#0e1112] border border-[#C5A36B]/25 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
          >
            {/* Header decor */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/10 via-[#C5A36B] to-amber-500/10"></div>

            {/* Cancel trigger */}
            <button
              onClick={onClose}
              id="close-calendar-modal-btn"
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              <div className="space-y-2 text-center md:text-left pr-6">
                <div className="w-10 h-10 rounded-full bg-[#C5A36B]/15 border border-[#C5A36B]/35 flex items-center justify-center text-[#C5A36B] mb-2 mx-auto md:mx-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#F2EBE4]">
                  {title}
                </h3>
                <p className="text-xs text-white/55 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Habit checklist list */}
              <div className="space-y-3.5 pt-2">
                {habits.map((habit) => {
                  const isChecked = selectedIds.includes(habit.id);
                  const timeValue = times[habit.id] || habit.defaultTime;
                  
                  return (
                    <div
                      key={habit.id}
                      className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isChecked
                          ? "bg-[#C5A36B]/5 border-[#C5A36B]/20"
                          : "bg-black/25 border-white/5 opacity-55"
                      }`}
                    >
                      {/* Left contents */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleHabit(habit.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors mt-0.5 ${
                            isChecked
                              ? "bg-[#C5A36B] border-[#C5A36B] text-black"
                              : "border-white/20 hover:border-[#C5A36B]"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="space-y-1 text-left min-w-0">
                          <h4 className="text-[12px] font-semibold text-[#F2EBE4] leading-snug">
                            {habit.title}
                          </h4>
                          <p className="text-[10px] text-white/45 leading-relaxed">
                            {habit.description}
                          </p>
                        </div>
                      </div>

                      {/* Scheduling elements */}
                      <div className="flex items-center gap-2 flex-shrink-0 pl-8 md:pl-0">
                        {/* Time selector */}
                        <div className="flex items-center gap-1.5 bg-black/45 border border-white/5 px-2.5 py-1.5 rounded-xl text-left select-none">
                          <Clock className="w-3.5 h-3.5 text-[#C5A36B]" />
                          <input
                            type="time"
                            value={timeValue}
                            onChange={(e) => handleTimeChange(habit.id, e.target.value)}
                            className="bg-transparent border-none text-[11px] text-white focus:outline-none cursor-pointer w-14 p-0 [color-scheme:dark]"
                            disabled={!isChecked}
                          />
                        </div>

                        {/* Direct Google Calendar dispatch */}
                        <button
                          onClick={() => syncIndividualGoogleCalendar(habit)}
                          id={`google-sync-${habit.id}`}
                          className={`p-2.5 rounded-xl border transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                            isChecked
                              ? "bg-[#C5A36B]/10 hover:bg-[#C5A36B]/20 border-[#C5A36B]/30 text-[#C5A36B]"
                              : "bg-transparent border-white/5 text-white/20 cursor-not-allowed"
                          }`}
                          disabled={!isChecked}
                          title="Open Calendar Invite on Google Calendar"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Combined download controller */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <button
                  onClick={exportAllToIcs}
                  disabled={selectedIds.length === 0}
                  id="ics-export-all-btn"
                  className="w-full h-12 bg-[#C5A36B] hover:bg-[#B3925A] disabled:bg-white/5 disabled:text-[#F2EBE4]/20 disabled:border-transparent text-black font-semibold rounded-2xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#C5A36B]/15 cursor-pointer text-xs uppercase tracking-wider leading-none"
                >
                  <Download className="w-4 h-4" />
                  <span>Sync all to mobile device (.ics file)</span>
                </button>
                <p className="text-[9px] text-white/35 text-center px-4 leading-normal">
                  The ICS download instantly registers as dynamic recurring daily alarms across Google Calendar, Android, Samsung, and Apple calendars without sign-in requirements.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
