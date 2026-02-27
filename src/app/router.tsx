// src/app/router.ts
import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import HomePage from "../pages/HomePage"
import NotFoundPage from "./NotFoundPage"
import NotesGuessPage from "../features/notes/pages/NotesGuessPage"
import NotesBuildPage from "../features/notes/NotesBuildPage"

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
                path: "notes/build",
                element: <NotesBuildPage />,
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