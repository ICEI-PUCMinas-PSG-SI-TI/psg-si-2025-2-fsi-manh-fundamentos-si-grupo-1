FROM oven/bun:alpine
WORKDIR /app

# Instalar dependências do backend.
COPY backend/package.json backend/bun.lock ./backend/
RUN bun install --cwd ./backend

# Copia as dependências do frontend.
COPY frontend/package.json frontend/bun.lock ./frontend/

# Copia o resto dos arquivos (Dockerfile cache).
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Instalar dependências do frontend.
# O frontend possui algumas dependências do backend.
RUN bun install --cwd ./frontend

# Build dos arquivos (html, js, css, static,...).
RUN bun run --cwd ./frontend build-only

# Mover arquivos da build pro backend.
RUN mkdir -p ./backend/
RUN mv ./frontend/dist/ ./backend/

# Definir configurações.
COPY backend/example.env ./backend/.env

# Configurar base de dados.
RUN bun run --cwd ./backend db:push

# Setup final
WORKDIR /app/backend
EXPOSE 8080

# Set the command to run the backend server
# Using ["bun", "run", "dev"] as you specified.
CMD ["bun", "src/server.ts"]
