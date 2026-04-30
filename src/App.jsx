import { useEffect } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader";
import { Navigate, Route, Routes } from "react-router-dom";

import AuthPage from "./pages/AuthPage.jsx";
import AppContainer from "./pages/AppContainer.jsx";
import NotFound from "./pages/NotFound.jsx";

import BooksPage from "./pages/BooksPage.jsx";
import ListsPage from "./pages/ListsPage.jsx";
import CollectionsPage from "./pages/CollectionsPage.jsx";
import BookPage from "./pages/BookPage.jsx";
import ListBooksPage from "./pages/ListBooksPage.jsx";
import EditListPage from "./pages/EditListPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import RestorePassword from "./pages/RestorePassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import CollectionListsPage from "./pages/CollectionListsPage.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import ListPage from "./pages/ListPage.jsx";
import EntryPage from "./pages/EntryPage.jsx";
import EntriesPage from "./pages/EntriesPage.jsx";

function App() {
  const { checkAuth , isCheckingAuth, authUser} = useAuthStore();

useEffect(() => {
  checkAuth()
}, []);

useEffect(() => {
  console.log("APP USER actualizado:", authUser);
}, [authUser]);
 if (isCheckingAuth) {
    console.log("Still checking auth, showing PageLoader");
    return (
      <div className="w-screen h-screen">
        <PageLoader />
      </div>
    );
  }
  return (
    <div className="w-screen h-screen">
      <Toaster />

    <Routes>
  {/* PROTECTED AREA */}
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <AppContainer />
      </ProtectedRoute>
    }
  >
    <Route index element={<HomePage />} />
    <Route path="books" element={<BooksPage />} />
    <Route path="lists" element={<ListsPage />} />
    <Route path="collections" element={<CollectionsPage />} />
        <Route path="collections/:id" element={<CollectionPage />} />

        <Route path="collections/:id/lists" element={<CollectionListsPage />} />

    <Route path="entries" element={<EntriesPage />} />
    <Route path="books/:id" element={<BookPage />} />

    <Route path="lists/:id" element={<ListBooksPage />} />
    <Route path="lists/:id/edit" element={<EditListPage />} />
<Route path="entries/:id" element={<EntryPage />} />
  </Route>

  {/* PUBLIC AREA */}
  <Route
    path="/login"
    element={
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    }
  />

  <Route
    path="/restore-password"
    element={
      <PublicRoute>
        <RestorePassword />
      </PublicRoute>
    }
  />

  <Route
    path="/reset-password"
    element={
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    }
  />

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
    </div>
  );
}

export default App;
