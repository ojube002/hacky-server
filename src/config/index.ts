import * as nconf from "nconf";
import { Credentials } from "keycloak-admin/lib/utils/auth";

nconf
  .argv()
  .env({
    separator: "__",
    lowerCase: true,
    parseValues: true,
    transform: (obj: { key: string }) => {
      obj.key = obj.key.replace(/base[uU]rl/g, "baseUrl");
      obj.key = obj.key.replace(/client[iI]d/g, "clientId");
      obj.key = obj.key.replace(/client[sS]ecret/g, "clientSecret");
      obj.key = obj.key.replace(/([^_])_([^_])/g, "$1-$2");
      return obj;
    }
  })
  .file({file: __dirname + "/../../config.json"})
  .defaults(require( __dirname + "/../../default-config.json"));

export interface KeycloakAdminConfig {
  realm: string;
  baseUrl: string,
  username: string,
  password: string,
  grant_type: string,
  client_id: string
  client_secret: string
}


export interface KeycloakConfig {
  realm: string;
  "bearer-only"?: boolean;
  "auth-server-url": string;
  "ssl-required": string;
  resource: string;
  "public-client"?: boolean;
  "confidential-port": number;
}

export interface Keycloak {
  admin: KeycloakAdminConfig;
  rest: KeycloakConfig;
  app: KeycloakConfig;
  hackyServer: KeycloakConfig;
}

export interface Mysql {
  host: string;
  database: string;
  username: string;
  password: string;
  port: string;
}


export interface Migrations {
  "lock-file": string;
}

export interface ClientServerConfig {
  host: string
  port: string
  secure: boolean
}

export interface Config {
  mode: string;
  port: number;
  "session-secret": string;
  keycloak: Keycloak;
  mysql: Mysql;
  migrations: Migrations,
  admin: Credentials
}

export function config(): Config {
  return { 
    ... nconf.get()
  }
}