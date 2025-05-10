import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { User, Camera, FileText, Lock, Check, AlertCircle } from "lucide-react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// Styled Components
const PageContainer = styled.div`
  max-width: 1024px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  padding: 1.5rem;
  color: white;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 1rem;
`;

const AvatarCircle = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid white;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; // 👈 вместо cover
  border-radius: 50%;
  background-color: white; // 👈 важно, чтобы был круглый фон
`;

const UserInfo = styled.div``;

const Username = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const Email = styled.p`
  color: rgba(219, 234, 254, 1);
  margin: 0.25rem 0 0 0;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.active ? "#2563eb" : "#4b5563"};
  border-bottom: ${props => props.active ? "2px solid #2563eb" : "none"};

  &:hover {
    background-color: ${props => props.active ? "transparent" : "#f9fafb"};
  }
`;

const TabIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const ContentArea = styled.div`
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: ${props => props.readOnly ? "#f3f4f6" : "white"};
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

const FileName = styled.span`
  margin-left: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const ButtonContainer = styled.div`
  margin-top: 1.5rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.disabled ? "#e5e7eb" : "#2563eb"};
  color: ${props => props.disabled ? "#9ca3af" : "white"};
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  
  &:hover {
    background-color: ${props => props.disabled ? "#e5e7eb" : "#1d4ed8"};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => props.disabled ? "none" : "0 0 0 3px rgba(37, 99, 235, 0.4)"};
  }
`;

const ButtonIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const Message = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: flex-start;
  background-color: ${props => props.error ? "#fef2f2" : "#f0fdf4"};
  border: 1px solid ${props => props.error ? "#fecaca" : "#bbf7d0"};
  color: ${props => props.error ? "#b91c1c" : "#15803d"};
`;

const MessageIcon = styled.span`
  margin-right: 0.5rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const AvatarPreview = styled.div`
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 1.5rem;
  }
`;

const AvatarPreviewCircle = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 10%;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AvatarUploadSection = styled.div`
  flex: 1;
`;
const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: 0.5rem;
  }
`;


const ProfilePage = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        avatarUrl: ""
    });
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get("/user/me");
                setUserData({
                    name: response.data.name,
                    email: response.data.email,
                    avatarUrl: response.data.avatarUrl || ""
                });
                setPreviewUrl(`http://localhost:8080${response.data.avatarUrl}`);
            } catch (err) {
                setError("Failed to load user data");
            }
        };

        fetchUserData();
    }, []);


    const handleProfileUpdate = async (e) => {
        if (e) e.preventDefault();
        setMessage("");
        setError("");

        // Validation
        if (newPassword && newPassword !== confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        try {
            await axiosInstance.put("/user/update", {
                oldPassword,
                newPassword,
            });
            setMessage("Profile successfully updated");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(selectedFile);
        }
    };

    const handleFileUpload = async () => {
        if (!file) return;
        setMessage("");
        setError("");
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axiosInstance.post("user/avatar", formData);
            setMessage("Avatar successfully updated");
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <PageContainer>
            <Card>
                {/* Header with avatar */}
                <Header>
                    <HeaderContent>
                        <BackButton onClick={() => navigate("/projects")}>
                            <ArrowLeft size={18} />
                            Back to Projects
                        </BackButton>
                        <AvatarContainer>
                            <AvatarCircle>
                                {previewUrl ? (
                                    <AvatarImage src={previewUrl} alt="Profile Preview" />
                                ) : (
                                    <User size={36} />
                                )}
                            </AvatarCircle>
                        </AvatarContainer>
                        <UserInfo>
                            <Username>{userData.name}</Username>
                            <Email>{userData.email}</Email>
                        </UserInfo>
                    </HeaderContent>
                </Header>

                {/* Tabs */}
                <TabContainer>
                    <Tab
                        active={activeTab === "profile"}
                        onClick={() => setActiveTab("profile")}
                    >
                        <TabIcon><User size={18} /></TabIcon>
                        Profile Information
                    </Tab>
                    <Tab
                        active={activeTab === "security"}
                        onClick={() => setActiveTab("security")}
                    >
                        <TabIcon><Lock size={18} /></TabIcon>
                        Security
                    </Tab>
                    <Tab
                        active={activeTab === "avatar"}
                        onClick={() => setActiveTab("avatar")}
                    >
                        <TabIcon><Camera size={18} /></TabIcon>
                        Avatar
                    </Tab>
                </TabContainer>

                <ContentArea>
                    {/* Notifications */}
                    {message && (
                        <Message>
                            <MessageIcon><Check size={20} /></MessageIcon>
                            <p>{message}</p>
                        </Message>
                    )}

                    {error && (
                        <Message error>
                            <MessageIcon><AlertCircle size={20} /></MessageIcon>
                            <p>{error}</p>
                        </Message>
                    )}

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div>
                            <SectionTitle>Profile Information</SectionTitle>
                            <TwoColumnGrid>
                                <FormGroup>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        type="text"
                                        value={userData.name}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={userData.email}
                                        readOnly
                                    />
                                </FormGroup>
                            </TwoColumnGrid>
                            <HelpText>
                                To change your username or email, please contact support.
                            </HelpText>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div>
                            <SectionTitle>Change Password</SectionTitle>
                            <FormGroup>
                                <FormLabel>Current Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Enter your current password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>New Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Confirm New Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </FormGroup>

                            <ButtonContainer>
                                <Button onClick={handleProfileUpdate}>
                                    <ButtonIcon><Lock size={18} /></ButtonIcon>
                                    Update Password
                                </Button>
                            </ButtonContainer>
                        </div>
                    )}

                    {/* Avatar Tab */}
                    {activeTab === "avatar" && (
                        <div>
                            <SectionTitle>Update Avatar</SectionTitle>

                            <AvatarSection>
                                <AvatarPreview>
                                    <AvatarPreviewCircle>
                                        {previewUrl ? (
                                            <AvatarImage src={previewUrl} alt="Avatar preview" />
                                        ) : (
                                            <User size={40} color="#9ca3af" />
                                        )}
                                    </AvatarPreviewCircle>
                                </AvatarPreview>

                                <AvatarUploadSection>
                                    <FormGroup>
                                        <FormLabel>Select Image</FormLabel>
                                        <div>
                                            <FileInputLabel>
                                                <FileText size={18} style={{ marginRight: '0.5rem' }} />
                                                <span>Choose File</span>
                                                <FileInput
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </FileInputLabel>
                                            <FileName>
                                                {file ? file.name : "No file chosen"}
                                            </FileName>
                                        </div>
                                        <HelpText>
                                            Recommended: Square image, at least 200x200 pixels
                                        </HelpText>
                                    </FormGroup>

                                    <ButtonContainer>
                                        <Button
                                            onClick={handleFileUpload}
                                            disabled={!file}
                                        >
                                            <ButtonIcon><Camera size={18} /></ButtonIcon>
                                            Upload Avatar
                                        </Button>
                                    </ButtonContainer>
                                </AvatarUploadSection>
                            </AvatarSection>
                        </div>
                    )}
                </ContentArea>
            </Card>
        </PageContainer>
    );
};

export default ProfilePage;