import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
    colors: {
        // Primary colors
        primary: "#4f46e5",
        primaryLight: "#818cf8",
        primaryDark: "#4338ca",

        // Secondary colors
        secondary: "#6B7280", // Secondary color for less emphasis
        secondaryLight: "#F3F4F6", // Light secondary for backgrounds
        secondaryDark: "#d97706",

        // Text colors
        text: "#111827",
        textPrimary: "#1F2937",
        textSecondary: "#6B7280",
        textLight: "#6b7280",

        textMuted: "#9ca3af",

        // Background colors
        background: "#F9FAFB", // Page background
        backgroundLight: "#F5F7FA", // Secondary background
        backgroundDark: "#e5e7eb",

        // UI colors
        border: "#d1d5db",
        placeholder: "#9ca3af",

        // Feedback colors
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",

        // Neutral colors
        white: "#ffffff",
        black: "#000000",
        gray100: "#f3f4f6",
        gray200: "#e5e7eb",
        gray300: "#d1d5db",
        gray400: "#9ca3af",
        gray500: "#6b7280",
        gray600: "#4b5563",
        gray700: "#374151",
        gray800: "#1f2937",
        gray900: "#111827",
    },

    // Typography
    typography: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        fontSize: {
            xs: "0.75rem",
            sm: "0.875rem",
            base: "1rem",
            lg: "1.125rem",
            xl: "1.25rem",
            "2xl": "1.5rem",
            "3xl": "1.875rem",
            "4xl": "2.25rem",
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        lineHeight: {
            none: 1,
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
        },
    },

    // Spacing
    spacing: {
        0: "0",
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
    },

    // Borders
    borderRadius: {
        none: "0",
        sm: "0.125rem",
        default: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
    },

    // Shadows
    shadows: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        none: "none",
    },

    // Transitions
    transitions: {
        default: "all 0.2s ease-in-out",
        fast: "all 0.1s ease-in-out",
        slow: "all 0.3s ease-in-out",
    },

    // Z-index
    zIndex: {
        0: 0,
        10: 10,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
        auto: "auto",
    },
};