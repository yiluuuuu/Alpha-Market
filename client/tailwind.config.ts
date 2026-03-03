import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#4F46E5", // Indigo
                secondary: "#10B981", // Emerald
                accent: "#F59E0B", // Amber
                background: "#F9FAFB", // Light gray
            },
            borderRadius: {
                "xl": "1rem",
                "2xl": "1.5rem",
            },
            boxShadow: {
                "soft": "0 4px 20px rgba(0, 0, 0, 0.05)",
                "premium": "0 10px 30px rgba(79, 70, 229, 0.1)",
            },
        },
    },
    plugins: [],
};
export default config;
