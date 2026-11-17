type DateFormat = "default" | "date" | "relative";

interface FormatDateOptions {
    format?: DateFormat;
}

export function formatDate(
    isoDate: string | Date,
    options: FormatDateOptions = {}
): string {
    const { format = "default" } = options;

    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    if (format === "relative") {
        const now = new Date();

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const target = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        const diffInDays = Math.round(
            (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays === 0) return "Today";
        if (diffInDays === -1) return "Yesterday";
        if (diffInDays === 1) return "Tomorrow";

        const formatter = new Intl.RelativeTimeFormat("en", {
            numeric: "always",
        });

        return formatter.format(diffInDays, "day");
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    if (format === "date") {
        return new Intl.DateTimeFormat("en-GB", dateOptions).format(date);
    }

    return new Intl.DateTimeFormat("en-GB", {
        ...dateOptions,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).format(date);
}
