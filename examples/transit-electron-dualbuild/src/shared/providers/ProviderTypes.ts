export interface ConnectSettings {
	appname?: string;
	pin?: string;
}

export interface ProviderProps {
    onPinValid:(connectSettings: ConnectSettings) => void;
    providerId:string;
  }
