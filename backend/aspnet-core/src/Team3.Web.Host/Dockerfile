FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src
COPY ["src/Team3.Web.Host/Team3.Web.Host.csproj", "src/Team3.Web.Host/"]
COPY ["src/Team3.Web.Core/Team3.Web.Core.csproj", "src/Team3.Web.Core/"]
COPY ["src/Team3.Application/Team3.Application.csproj", "src/Team3.Application/"]
COPY ["src/Team3.Core/Team3.Core.csproj", "src/Team3.Core/"]
COPY ["src/Team3.EntityFrameworkCore/Team3.EntityFrameworkCore.csproj", "src/Team3.EntityFrameworkCore/"]
WORKDIR "/src/src/Team3.Web.Host"
RUN dotnet restore

WORKDIR /src
COPY ["src/Team3.Web.Host", "src/Team3.Web.Host"]
COPY ["src/Team3.Web.Core", "src/Team3.Web.Core"]
COPY ["src/Team3.Application", "src/Team3.Application"]
COPY ["src/Team3.Core", "src/Team3.Core"]
COPY ["src/Team3.EntityFrameworkCore", "src/Team3.EntityFrameworkCore"]
WORKDIR "/src/src/Team3.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "Team3.Web.Host.dll"]
