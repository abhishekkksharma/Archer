import AwsIcon from "./AWS.svg";
import CloudflareIcon from "./Cloudflare.svg";
import DjangoIcon from "./Django.svg";
import DockerIcon from "./Docker.svg";
import ExpressIcon from "./Express.svg";
import FastApiIcon from "./FastAPI.svg";
import FirebaseIcon from "./Firebase.svg";
import GitHubActionsIcon from "./GitHub Actions.svg";
import GoIcon from "./Go.svg";
import MongoDbIcon from "./MongoDB.svg";
import MySqlIcon from "./MySQL.svg";
import NestJsIcon from "./Nest.js.svg";
import NextJsIcon from "./Next.js.svg";
import NodeJsIcon from "./Node.js.svg";
import PostgresSqlIcon from "./PostgresSQL.svg";
import ReactIcon from "./React.svg";
import RedisIcon from "./Redis.svg";
import ReduxIcon from "./Redux.svg";
import SqLiteIcon from "./SQLite.svg";
import SpringIcon from "./Spring.svg";
import SvelteIcon from "./Svelte.svg";
import TailwindCssIcon from "./Tailwind-CSS.svg";
import TypeScriptIcon from "./TypeScript.svg";
import VercelIcon from "./Vercel.svg";
import VueJsIcon from "./Vue.js.svg";
import RenderIcon from "./render.svg"

// Export individual icon imports
export {
  AwsIcon,
  CloudflareIcon,
  DjangoIcon,
  DockerIcon,
  ExpressIcon,
  FastApiIcon,
  FirebaseIcon,
  GitHubActionsIcon,
  GoIcon,
  MongoDbIcon,
  MySqlIcon,
  NestJsIcon,
  NextJsIcon,
  NodeJsIcon,
  PostgresSqlIcon,
  ReactIcon,
  RedisIcon,
  ReduxIcon,
  SqLiteIcon,
  SpringIcon,
  SvelteIcon,
  TailwindCssIcon,
  TypeScriptIcon,
  VercelIcon,
  VueJsIcon,
  RenderIcon
};

// Map tech names and aliases to their SVG icon assets
export const techIconMap: Record<string, any> = {
  // Frontend
  "Next.js": NextJsIcon,
  "NextJS": NextJsIcon,
  "Next": NextJsIcon,
  "React": ReactIcon,
  "React.js": ReactIcon,
  "ReactJS": ReactIcon,
  "Vue.js": VueJsIcon,
  "Vue": VueJsIcon,
  "VueJS": VueJsIcon,
  "Svelte": SvelteIcon,
  "SvelteKit": SvelteIcon,
  "Tailwind CSS": TailwindCssIcon,
  "TailwindCSS": TailwindCssIcon,
  "Tailwind": TailwindCssIcon,
  "TypeScript": TypeScriptIcon,
  "TS": TypeScriptIcon,
  "Redux": ReduxIcon,

  // Backend
  "Node.js": NodeJsIcon,
  "NodeJS": NodeJsIcon,
  "Node": NodeJsIcon,
  "Express.js": ExpressIcon,
  "Express": ExpressIcon,
  "ExpressJS": ExpressIcon,
  "Python FastAPI": FastApiIcon,
  "FastAPI": FastApiIcon,
  "Django": DjangoIcon,
  "Go (Golang)": GoIcon,
  "Golang": GoIcon,
  "Go": GoIcon,
  "Java Spring Boot": SpringIcon,
  "Spring Boot": SpringIcon,
  "Spring": SpringIcon,
  "NestJS": NestJsIcon,
  "Nest.js": NestJsIcon,

  // Database
  "MongoDB": MongoDbIcon,
  "PostgreSQL": PostgresSqlIcon,
  "PostgresSQL": PostgresSqlIcon,
  "Postgres": PostgresSqlIcon,
  "MySQL": MySqlIcon,
  "Redis": RedisIcon,
  "Firebase Firestore": FirebaseIcon,
  "Firebase": FirebaseIcon,
  "SQLite": SqLiteIcon,

  // Other Services
  "Docker": DockerIcon,
  "AWS S3": AwsIcon,
  "AWS": AwsIcon,
  "Vercel": VercelIcon,
  "Cloudflare": CloudflareIcon,
  "GitHub Actions": GitHubActionsIcon,
  "Render":RenderIcon,
};

// Categorized structure mapping technology names to icon assets
export const techIconsByCategory = {
  frontend: [
    { name: "Next.js", icon: NextJsIcon },
    { name: "React", icon: ReactIcon },
    { name: "Vue.js", icon: VueJsIcon },
    { name: "Svelte", icon: SvelteIcon },
    { name: "Tailwind CSS", icon: TailwindCssIcon },
    { name: "TypeScript", icon: TypeScriptIcon },
    { name: "Redux", icon: ReduxIcon },
  ],
  backend: [
    { name: "Node.js", icon: NodeJsIcon },
    { name: "Express.js", icon: ExpressIcon },
    { name: "Python FastAPI", icon: FastApiIcon },
    { name: "Django", icon: DjangoIcon },
    { name: "Go (Golang)", icon: GoIcon },
    { name: "Java Spring Boot", icon: SpringIcon },
    { name: "NestJS", icon: NestJsIcon },
  ],
  database: [
    { name: "MongoDB", icon: MongoDbIcon },
    { name: "PostgreSQL", icon: PostgresSqlIcon },
    { name: "MySQL", icon: MySqlIcon },
    { name: "Redis", icon: RedisIcon },
    { name: "Firebase Firestore", icon: FirebaseIcon },
    { name: "SQLite", icon: SqLiteIcon },
  ],
  otherServices: [
    { name: "Docker", icon: DockerIcon },
    { name: "AWS S3", icon: AwsIcon },
    { name: "Vercel", icon: VercelIcon },
    { name: "Cloudflare", icon: CloudflareIcon },
    { name: "GitHub Actions", icon: GitHubActionsIcon },
  ],
};

/**
 * Helper function to retrieve a tech icon by technology name (supports case-insensitive & normalized matching)
 */
export function getTechIcon(techName: string): any {
  if (!techName) return null;

  // Direct lookup
  if (techIconMap[techName]) {
    return techIconMap[techName];
  }

  // Normalized case-insensitive lookup
  const cleanTarget = techName.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const [key, value] of Object.entries(techIconMap)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanKey === cleanTarget) {
      return value;
    }
  }

  return null;
}

export default techIconMap;