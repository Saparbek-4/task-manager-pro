import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/login/RegisterPage";
import ProjectsPage from "./pages/projects/ProjectsPage"
import PrivateRoute from "./router/PrivateRoute";
import ProjectDetailsPage from "./pages/projects/ProjectDetailsPage.tsx";
import BoardPage from "./pages/Board/BoardPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
function App() {
    return (
            <BrowserRouter>
                <Routes>
                    {/* Публичные маршруты */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Защищённый маршрут */}
                    <Route path="/profile"
                           element={
                                <PrivateRoute>
                                    <ProfilePage />
                                </PrivateRoute>
                            }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <PrivateRoute>
                                <ProjectsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/projects/:projectId/*"
                        element={
                        <PrivateRoute>
                            <ProjectDetailsPage/>
                        </PrivateRoute>
                    }>
                        {/* Вложенный маршрут для доски */}

                    </Route>
                    <Route
                        path="/projects/:projectId/boards/:boardId"
                        element={
                        <PrivateRoute>
                            <BoardPage />
                        </PrivateRoute>}
                    />

                </Routes>
            </BrowserRouter>
    );
}

export default App;
