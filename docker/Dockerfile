# Используем официальный базовый образ с JDK 17
FROM eclipse-temurin:17-jdk

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем jar-файл в контейнер
COPY target/task-manager-pro-*.jar app.jar

# Указываем порт
EXPOSE 8080

# Запускаем Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
