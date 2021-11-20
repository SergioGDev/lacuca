export interface GoogleUser {
    operationType:      string;
    credential:         Credential;
    additionalUserInfo: AdditionalUserInfo;
    user:               GoogleUser;
}

export interface AdditionalUserInfo {
    isNewUser:  boolean;
    providerId: string;
    profile:    Profile;
}

export interface Profile {
    name:           string;
    granted_scopes: string;
    id:             string;
    verified_email: boolean;
    given_name:     string;
    locale:         string;
    family_name:    string;
    email:          string;
    picture:        string;
}

export interface Credential {
    idToken:      string;
    accessToken:  string;
    pendingToken: null;
    providerId:   string;
    signInMethod: string;
}

export interface GoogleUser {
    uid:             string;
    email:           string;
    emailVerified:   boolean;
    displayName:     string;
    isAnonymous:     boolean;
    photoURL:        string;
    providerData:    ProviderDatum[];
    stsTokenManager: StsTokenManager;
    createdAt:       string;
    lastLoginAt:     string;
    apiKey:          string;
    appName:         string;
}

export interface ProviderDatum {
    providerId:  string;
    uid:         string;
    displayName: string;
    email:       string;
    phoneNumber: null;
    photoURL:    string;
}

export interface StsTokenManager {
    refreshToken:   string;
    accessToken:    string;
    expirationTime: number;
}
