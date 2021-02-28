import { User } from '.';
import { JWT } from './jwt';
import { NonNullParams, NullableParams, WithAdditionalParams } from './_utils';

export interface Provider<T extends string | undefined = undefined, U = T extends string ? 'oauth' : string> {
    id: T;
    name: string;
    type: U extends string ? U : 'oauth' | 'email' | 'credentials';
    version: string;
    scope: string;
    params: { grant_type: string };
    accessTokenUrl: string;
    requestTokenUrl: string;
    authorizationUrl: string;
    profileUrl: string;
    profile: (profile: Record<string, unknown>, tokens: unknown) => User & { id: string };
    clientId: string;
    clientSecret: string | Record<string, unknown>;
}

export interface AppProvider extends Pick<Provider, 'id' | 'name' | 'type'> {
    signinUrl: string;
    callbackUrl: string;
}

export interface DefaultProviders {
    Apple: Apple;
    Auth0: Auth0;
    Basecamp: Basecamp;
    BattleNet: BattleNet;
    Box: Box;
    Cognito: Cognito;
    Credentials: Credentials;
    Discord: Discord;
    Email: Email;
    Facebook: Facebook;
    GitHub: GitHub;
    GitLab: GitLab;
    Google: Google;
    IdentityServer4: IdentityServer4;
    LinkedIn: LinkedIn;
    Mixer: Mixer;
    Okta: Okta;
    Reddit: Reddit;
    Slack: Slack;
    Spotify: Spotify;
    Twitch: Twitch;
    Twitter: Twitter;
    Yandex: Yandex;
}

export type Providers = Array<ReturnType<DefaultProviders[keyof DefaultProviders]>>;

declare const Providers: DefaultProviders;

export default Providers;

/**
 * Email
 */
type Email = (options: ProviderEmailOptions) => NonNullParams<ProviderEmailOptions> & { id: 'email'; type: 'email'; };

interface VerificationRequestParams extends Provider {
    identifier: string;
    url: string;
    baseUrl: string;
    token: string;
    provider: ProviderEmailOptions;
}

interface ProviderEmailOptions {
    name?: string;
    server?: string | ProviderEmailServer;
    from?: string;
    maxAge?: number;
    sendVerificationRequest?: (options: VerificationRequestParams) => Promise<void>;
}

interface ProviderEmailServer {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
}

/**
 * Credentials
 */
type Credentials = (options: ProviderCredentialsOptions) => NonNullParams<ProviderCredentialsOptions> & { id: 'credentials'; type: 'credentials'; };

interface ProviderCredentialsOptions {
    id?: string;
    name: string;
    credentials: CredentialInput;
    authorize(credentials: Record<string, string>): Promise<User | null>;
}

interface CredentialInput {
    [key: string]: {
        label?: string;
        type?: string;
        value?: string;
        placeholder?: string;
    };
}

type OptionsBase = {
    [K in keyof Omit<Provider, 'id'>]?: Provider[K]
};

interface ProviderCommonOptions extends OptionsBase {
    name?: string;
    clientId: string;
    clientSecret: string;
}

/**
 * Apple
 */
type Apple = (options: ProviderAppleOptions) => Provider<'apple'> & { protection: 'none' };

interface ProviderAppleOptions extends Omit<ProviderCommonOptions, 'clientSecret'> {
    name?: string;
    clientId: string;
    clientSecret: Record<'appleId' | 'teamId' | 'privateKey' | 'keyId', string>;
}

interface ProviderAppleSecret {
    appleId: string;
    teamId: string;
    privateKey: string;
    keyId: string;
}

/**
 * Twitter
 */
type Twitter = (options: ProviderCommonOptions) => Provider<'twitter'>;

/**
 * Facebook
 */
type Facebook = (options: ProviderCommonOptions) => Provider<'facebook'>;

/**
 * GitHub
 */
type GitHub = (options: ProviderGitHubOptions) => Provider<'github'>;

interface ProviderGitHubOptions extends Omit<ProviderCommonOptions, 'scope'> {
    scope?: string;
}

/**
 * GitLab
 */
type GitLab = (options: ProviderCommonOptions) => Provider<'gitlab'>;

/**
 * Slack
 */
type Slack = (options: ProviderCommonOptions) => Provider<'slack'>;

/**
 * Google
 */
type Google = (options: ProviderGoogleOptions) => Provider<'google'>;

interface ProviderGoogleOptions extends ProviderCommonOptions {
    authorizationUrl?: string;
}

/**
 * Auth0
 */
type Auth0 = (options: ProviderAuth0Options) => Provider<'auth0'> & { domain: string };

interface ProviderAuth0Options extends Omit<ProviderCommonOptions, 'profile'> {
    domain: string;
    profile?: (profile: Auth0Profile) => User & { id: string };
}

interface Auth0Profile {
    sub: string;
    nickname: string;
    email: string;
    picture: string;
}

/**
 * IS4
 */

type IdentityServer4 = (options: ProviderIS4Options) => Provider<'identity-server4' | string> & { domain: string };

interface ProviderIS4Options extends Omit<ProviderCommonOptions, 'id'> {
    id: string;
    scope: string;
    domain: string;
}

/**
 * Discord
 */
type Discord = (options: ProviderCommonOptions) => Provider<'discord'>;

/**
 * Twitch
 */
type Twitch = (options: ProviderCommonOptions) => Provider<'twitch'>;

/**
 * Mixer
 */
type Mixer = (options: ProviderCommonOptions) => Provider<'mixer'>;

/**
 * Okta
 */
type Okta = (options: ProviderOktaOptions) => Provider<'okta'> & { domain: string };

interface ProviderOktaOptions extends ProviderCommonOptions {
    domain: string;
}

/**
 * Battle.net
 */
type BattleNet = (options: ProviderBattleNetOptions) => Provider<'battlenet'> & { region: string };

interface ProviderBattleNetOptions extends ProviderCommonOptions {
    region: string;
}

/**
 * Box
 */
type Box = (options: ProviderCommonOptions) => Provider<'box'>;

/**
 * Cognito
 */
type Cognito = (options: ProviderCognitoOptions) => Provider<'cognito'> & { domain: string };

interface ProviderCognitoOptions extends ProviderCommonOptions {
    domain: string;
}

/**
 * Yandex
 */
type Yandex = (options: ProviderCommonOptions) => Provider<'yandex'>;

/**
 * LinkedIn
 */
type LinkedIn = (options: ProviderLinkedInOptions) => Provider<'linkedin'>;

interface ProviderLinkedInOptions extends ProviderCommonOptions {
    scope?: string;
}

/**
 * Spotify
 */
type Spotify = (options: ProviderSpotifyOptions) => Provider<'spotify'>;

interface ProviderSpotifyOptions extends ProviderCommonOptions {
    scope?: string;
}

/**
 * Basecamp
 */
type Basecamp = (options: ProviderCommonOptions) => Provider<'basecamp'>;

/**
 * Reddit
 */
type Reddit = (options: ProviderCommonOptions) => Provider<'reddit'>;
