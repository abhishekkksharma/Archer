import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function HeatMap() {
    const values = [
        { date: "2025-10-03", count: 2 },
        { date: "2025-10-08", count: 5 },
        { date: "2025-10-15", count: 10 },
        { date: "2025-11-02", count: 3 },
        { date: "2025-11-10", count: 8 },
        { date: "2025-11-21", count: 15 },
        { date: "2025-12-05", count: 4 },
        { date: "2025-12-12", count: 12 },
        { date: "2025-12-25", count: 20 },
        { date: "2026-01-04", count: 2 },
        { date: "2026-01-15", count: 7 },
        { date: "2026-01-22", count: 14 },
        { date: "2026-02-03", count: 5 },
        { date: "2026-02-14", count: 11 },
        { date: "2026-02-27", count: 18 },
        { date: "2026-03-05", count: 3 },
        { date: "2026-03-18", count: 9 },
        { date: "2026-03-25", count: 16 },
        { date: "2026-04-07", count: 4 },
        { date: "2026-04-19", count: 12 },
        { date: "2026-05-02", count: 6 },
        { date: "2026-05-16", count: 17 },
        { date: "2026-06-04", count: 3 },
        { date: "2026-06-18", count: 10 },
        { date: "2026-07-01", count: 20 },
        { date: "2026-07-14", count: 7 },
        { date: "2026-08-05", count: 13 },
        { date: "2026-08-21", count: 5 },
        { date: "2026-09-03", count: 16 },
        { date: "2026-09-17", count: 8 },
        { date: "2026-09-28", count: 20 },
    ];

    return (
        <div
            className="
                lg:px-[10%]
                py-18
                max-w-full
                bg-transparent

                [&_.color-empty]:!fill-zinc-100
                dark:[&_.color-empty]:!fill-zinc-900

                [&_.color-scale-1]:!fill-[#E3F2FD]
                [&_.color-scale-2]:!fill-[#90CAF9]
                [&_.color-scale-3]:!fill-[#2196F3]
                [&_.color-scale-4]:!fill-[#0D47A1]

                [&_text]:!fill-zinc-500
                dark:[&_text]:!fill-zinc-400

                [&_text]:text-[10px]

                [&_rect]:[rx:2]
                [&_rect]:[ry:2]
            "
        >
        <p className="font-semibold text-sm text-zinc-700 dark:text-zinc-200 py-4 p-2">Commit Stats -<span className="text-xs"> dummy data</span> </p>
            <CalendarHeatmap
                startDate="2025-10-01"
                endDate="2026-10-01"
                values={values}
                classForValue={(value) => {
                    if (!value || value.count === 0) {
                        return "color-empty";
                    }

                    if (value.count <= 3) {
                        return "color-scale-1";
                    }

                    if (value.count <= 7) {
                        return "color-scale-2";
                    }

                    if (value.count <= 12) {
                        return "color-scale-3";
                    }

                    return "color-scale-4";
                }}
                titleForValue={(value) =>
                    value
                        ? `${value.count} commits on ${value.date}`
                        : "0 commits"
                }
                showWeekdayLabels
                gutterSize={2}
            />
        </div>
    );
}

export default HeatMap;