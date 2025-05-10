import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationBell } from "./NotificationBell";
import axiosInstance from "../api/axiosInstance.ts";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.span`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  background: white;
  flex-direction: column;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 99;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const NavLink = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;
`;

const NotificationIcon = styled.span`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };
    const userId = localStorage.getItem("userId")!;
    const notifications = useNotifications(userId);
    const [username, setUsername] = useState("");

    // Mock user data - in a real app, this would come from your auth state
    const [avatarUrl, setAvatarUrl] = useState("");

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        navigate("/");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get("/user/me");
                setAvatarUrl(res.data.avatarUrl);
                setUsername(res.data.username);
            } catch (err) {
                console.error("❌ Ошибка загрузки профиля:", err);
            }
        };

        fetchProfile();
    }, []);


    return (
        <HeaderWrapper>
            <LogoContainer>
                <LogoIcon>📊</LogoIcon>
                <Logo to="/dashboard">Task Manager PRO</Logo>
            </LogoContainer>

            <NavLinks>
                <NavLink to="/dashboard" active={isActive("/dashboard")}>
                    Dashboard
                </NavLink>
                <NavLink to="/projects" active={isActive("/projects")}>
                    Projects
                </NavLink>
                <NavLink to="/tasks" active={isActive("/tasks")}>
                    Tasks
                </NavLink>
            </NavLinks>

            <UserSection>
                <NotificationBell notifications={notifications} />
                <Link to="/profile">
                    {avatarUrl ? (
                        <img
                            src={`http://localhost:8080${avatarUrl}`}
                            alt="avatar"
                            style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "50%",
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <UserAvatar>
                            {(username && username.length > 0)
                                ? username.charAt(0).toUpperCase()
                                : "U"}
                        </UserAvatar>
                    )}
                </Link>
                <button
                    onClick={handleLogout}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        fontWeight: 500,
                        cursor: "pointer",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem"
                    }}
                >
                    <LogOut size={18} />
                    Logout
                </button>



                <MobileMenuButton onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? "✕" : "☰"}
                </MobileMenuButton>
            </UserSection>

            <MobileMenu isOpen={mobileMenuOpen}>
                <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                </MobileNavLink>
                <MobileNavLink to="/projects" onClick={() => setMobileMenuOpen(false)}>
                    Projects
                </MobileNavLink>
                <MobileNavLink to="/tasks" onClick={() => setMobileMenuOpen(false)}>
                    Tasks
                </MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                </MobileNavLink>
                <MobileNavLink as="button" onClick={handleLogout}>
                    <LogOut size={16} style={{ marginRight: "0.5rem" }} />
                    Logout
                </MobileNavLink>
            </MobileMenu>
        </HeaderWrapper>
    );
};

export default Header;