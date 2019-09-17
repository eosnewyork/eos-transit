export interface ConnectSettings {
	appname?: string;
	pin?: string;
}

export interface ProviderProps {
    onSelect?: (connectSettings: ConnectSettings) => void;
    ProviderId: string;
    providerName?:string;
    hasError:boolean
  }
