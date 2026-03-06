// src/app/router.ts
import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import HomePage from "../pages/HomePage"
import NotFoundPage from "./NotFoundPage"
import NotesGuessPage from "../features/notes/NotesGuessPage"
import LengthsGuessPage from "../features/lengths/LengthsGuessPage"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "notes/guess",
                element: <NotesGuessPage />,
            },
            {
                path: "lengths/guess",
                element: <LengthsGuessPage />,
            },

            // nested 404 inside layout
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },

    // global 404 fallback
    {
        path: "*",
        element: <NotFoundPage />,
    },
])