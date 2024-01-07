# --- Build Stage for Client App ---
FROM node:16 as build-client
WORKDIR /app/ClientApp
COPY Travelist/ClientApp/package.json Travelist/ClientApp/package-lock.json ./
RUN npm ci
COPY Travelist/ClientApp ./
RUN npm run build

# --- Build Stage for Server App ---
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-server
WORKDIR /src
COPY ["Travelist/Travelist.csproj", "Travelist/"]
RUN dotnet restore "Travelist/Travelist.csproj"
COPY . .
WORKDIR "/src/Travelist"
RUN dotnet build "Travelist.csproj" -c Release -o /app/build

# --- Publish Stage ---
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS publish
WORKDIR /src
COPY --from=build-server /src/Travelist /src/Travelist
COPY --from=build-client /app/ClientApp/build /src/Travelist/ClientApp/build
WORKDIR "/src/Travelist"
# Install Node.js 16.x
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs
RUN dotnet publish "Travelist.csproj" -c Release -o /app/publish

# --- Runtime Stage ---
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Travelist.dll"]