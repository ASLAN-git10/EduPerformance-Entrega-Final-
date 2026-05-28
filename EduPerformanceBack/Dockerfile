# =========================================================================
# MULTI-STAGE DOCKERFILE PARA EDUPERFORMANCE BACKEND (SPRING BOOT + JAVA 21)
# =========================================================================

# --- ETAPA 1: CONSTRUCCIÓN (BUILD) ---
# Usamos una imagen de Maven optimizada con JDK 17 (Eclipse Temurin)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos solo el pom.xml para descargar y cachear las dependencias primero
# Esto acelera significativamente las compilaciones posteriores
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código fuente y compilamos la aplicación (saltándonos las pruebas unitarias)
COPY src ./src
RUN mvn clean package -DskipTests

# --- ETAPA 2: EJECUCIÓN (RUNTIME) ---
# Usamos una imagen de JRE ligera de Eclipse Temurin para el entorno de producción
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiamos el archivo JAR compilado desde la etapa anterior
COPY --from=build /app/target/EduPerformance-0.0.1-SNAPSHOT.jar app.jar

# Render inyecta la variable de entorno PORT dinámicamente.
# Exponemos el puerto estándar 8080 para documentación, pero Spring Boot
# escuchará en el puerto provisto por la variable PORT.
EXPOSE 8080

# Comando para ejecutar la aplicación habilitando optimizaciones de memoria de la JVM para contenedores
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]
