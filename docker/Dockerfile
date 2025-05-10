# Сборка приложения
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Запуск приложения
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/task-manager-pro-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]