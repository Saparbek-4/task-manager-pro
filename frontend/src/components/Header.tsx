// Responsive Header Component
import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationBell } from "./NotificationBell";
import axiosInstance from "../api/axiosInstance.ts";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

// Breakpoints for responsive design
const breakpoints = {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px'
};

// Media query helper
const media = {
    xs: `@media (max-width: ${breakpoints.xs})`,
    sm: `@media (max-width: ${breakpoints.sm})`,
    md: `@media (max-width: ${breakpoints.md})`,
    lg: `@media (max-width: ${breakpoints.lg})`,
};

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

  ${media.md} {
    padding: 0.875rem 1.5rem;
  }

  ${media.sm} {
    padding: 0.75rem 1rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.span`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.primary};

  ${media.sm} {
    font-size: 1.5rem;
  }

  ${media.xs} {
    font-size: 1.25rem;
  }
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

  ${media.sm} {
    font-size: 1.25rem;
  }

  ${media.xs} {
    font-size: 1rem;
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
  padding: 0.25rem;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${media.xs} {
    font-size: 1.25rem;
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
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 99;

  ${media.sm} {
    top: 3.5rem;
  }

  ${media.xs} {
    top: 3rem;
  }

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

  ${media.xs} {
    padding: 0.75rem;
    font-size: 0.9rem;
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

  ${media.md} {
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  ${media.md} {
    gap: 0.75rem;
  }

  ${media.xs} {
    gap: 0.5rem;
  }
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

  ${media.md} {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.9rem;
  }

  ${media.xs} {
    width: 2rem;
    height: 2rem;
    font-size: 0.85rem;
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
  
  ${media.xs} {
    font-size: 1.1rem;
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

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #ef4444;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
  
  ${media.sm} {
    padding: 0.4rem 0.75rem;
  }
  
  ${media.xs} {
    padding: 0.3rem;
    /* Hide text, show only icon on very small screens */
    span {
      display: none;
    }
  }
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
            </NavLinks>

            <UserSection>
                <NotificationBell notifications={notifications} />
                <Link to="/profile">
                    {avatarUrl ? (
                        <img
                            src={`${import.meta.env.VITE_WS_URL}${avatarUrl}`}
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
                <LogoutButton onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </LogoutButton>

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