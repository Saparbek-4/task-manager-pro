import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.ts";
import {
    Container,
    Card,
    CardHeader,
    Title,
    Subtitle,
    Form,
    FormGroup,
    Label,
    Input,
    ErrorMsg,
    FlexRow,
    CheckboxGroup,
    Checkbox,
    LinkText,
    Button,
    Spinner,
    Divider,
    DividerText,
    SocialButtonsContainer,
    SocialButton,
    ErrorAlert,
    FooterText
} from "./LoginStyles";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "Email обязателен";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Введите корректный email";
        }

        if (!password) {
            newErrors.password = "Пароль обязателен";
        } else if (password.length < 4) {
            newErrors.password = "Минимум 4 символа";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setLoginError("");

        try {
            const response = await axiosInstance.post("/auth/login", {
                email, // ✅ backend ждёт `username`
                password,
            });

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("userId", response.data.userId);


            setTimeout(() => {
                navigate("/projects");
            }, 50);
        } catch (error: any) {
            if (error.response?.status === 401) {
                setLoginError("Неверный email или пароль");
            } else {
                setLoginError(
                    error.response?.data?.message || error.message || "Произошла ошибка при входе"
                );
            }
            console.error("Ошибка логина:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Card>
                <CardHeader>
                    <Title>Task Manager PRO</Title>
                    <Subtitle>Войдите в свой аккаунт</Subtitle>
                </CardHeader>

                {loginError && <ErrorAlert>{loginError}</ErrorAlert>}

                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="вы@пример.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            $hasError={!!errors.email} // ✅ transient проп
                        />
                        {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            $hasError={!!errors.password}
                        />
                        {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}
                    </FormGroup>

                    <FlexRow>
                        <CheckboxGroup>
                            <Checkbox type="checkbox" id="remember-me" />
                            <Label htmlFor="remember-me">Запомнить меня</Label>
                        </CheckboxGroup>
                        <LinkText href="#">Забыли пароль?</LinkText>
                    </FlexRow>

                    <Button type="submit" $isLoading={isLoading} disabled={isLoading}>
                        {isLoading ? <><Spinner /> Вход...</> : "Войти"}
                    </Button>
                </Form>

                <Divider>
                    <DividerText>Или продолжить с</DividerText>
                </Divider>

                <SocialButtonsContainer>
                    <SocialButton href="#">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </SocialButton>
                    <SocialButton href="#">
                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.805 10.023h-9.38v3.955h5.503c-.236 1.299-.949 2.402-2.015 3.15v2.615h3.24c1.896-1.75 2.983-4.327 2.983-7.317 0-.528-.045-1.043-.13-1.547z" fill="#4285F4"/>
                            <path d="M12.426 22c2.7 0 4.964-.896 6.618-2.435l-3.24-2.615c-.897.602-2.043.957-3.378.957-2.596 0-4.8-1.75-5.592-4.104H3.492v2.58C5.137 19.842 8.534 22 12.426 22z" fill="#34A853"/>
                            <path d="M6.834 13.803a6.964 6.964 0 010-3.604V7.619H3.492a10.04 10.04 0 000 8.762l3.342-2.578z" fill="#FBBC05"/>
                            <path d="M12.426 5.23c1.47 0 2.787.508 3.827 1.504l2.873-2.872C16.938 2.366 14.673 1.5 12.426 1.5 8.534 1.5 5.137 3.658 3.492 6.88l3.342 2.58c.793-2.355 2.997-4.23 5.592-4.23z" fill="#EA4335"/>
                        </svg>
                    </SocialButton>
                </SocialButtonsContainer>

                <FooterText>
                    Нет аккаунта?{" "}
                    <LinkText as={Link} to={"/register"}>
                        Зарегистрироваться
                    </LinkText>
                </FooterText>
            </Card>
        </Container>
    );
};

export default LoginPage;
