export interface EmailUser {
    operationType:      string;
    credential:         null;
    additionalUserInfo: AdditionalUserInfo;
    user:               UserClass;
}

export interface AdditionalUserInfo {
    isNewUser:  boolean;
    providerId: string;
    profile:    Profile;
}

export interface Profile {
}

export interface UserClass {
    uid:             string;
    email:           string;
    emailVerified:   boolean;
    isAnonymous:     boolean;
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
    displayName: null;
    email:       string;
    phoneNumber: null;
    photoURL:    null;
}

export interface StsTokenManager {
    refreshToken:   string;
    accessToken:    string;
    expirationTime: number;
}
