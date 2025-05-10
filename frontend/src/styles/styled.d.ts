// src/styles/styled.d.ts
import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            primary: string;
            primaryLight: string;
            primaryDark: string;
            secondary: string;
            secondaryLight: string;
            secondaryDark: string;
            text: string;
            textPrimary: string;
            textSecondary: string;
            textLight: string;
            textMuted: string;
            background: string;
            backgroundLight: string;
            backgroundDark: string;
            border: string;
            placeholder: string;
            success: string;
            error: string;
            warning: string;
            info: string;
            white: string;
            black: string;
            gray100: string;
            gray200: string;
            gray300: string;
            gray400: string;
            gray500: string;
            gray600: string;
            gray700: string;
            gray800: string;
            gray900: string;
        };
        typography: {
            fontFamily: string;
            fontSize: {
                xs: string;
                sm: string;
                base: string;
                lg: string;
                xl: string;
                "2xl": string;
                "3xl": string;
                "4xl": string;
            };
            fontWeight: {
                normal: number;
                medium: number;
                semibold: number;
                bold: number;
            };
            lineHeight: {
                none: number;
                tight: number;
                normal: number;
                relaxed: number;
            };
        };
        spacing: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
            8: string;
            10: string;
            12: string;
            16: string;
            20: string;
            24: string;
        };
        borderRadius: {
            none: string;
            sm: string;
            default: string;
            md: string;
            lg: string;
            xl: string;
            "2xl": string;
            full: string;
        };
        shadows: {
            sm: string;
            default: string;
            md: string;
            lg: string;
            xl: string;
            "2xl": string;
            inner: string;
            none: string;
        };
        transitions: {
            default: string;
            fast: string;
            slow: string;
        };
        zIndex: {
            0: number;
            10: number;
            20: number;
            30: number;
            40: number;
            50: number;
            auto: string;
        };
    }
}
