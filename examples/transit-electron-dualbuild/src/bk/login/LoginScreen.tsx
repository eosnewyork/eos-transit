import React, { Component } from 'react';
import styled from 'react-emotion';
import { Redirect, withRouter } from 'react-router';
import WAL, { WalletProvider, Wallet, DiscoveryAccount, DiscoveryData, KeyModifierCallback, DiscoveryOptions } from 'eos-transit';
import { CloseButton } from '../shared/buttons/CloseButton';
import { LoginButton } from './LoginButton';
import { LoginScreenWalletList } from './LoginScreenWalletList';

// Visual components

const LoginScreenRoot = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: 100
});

const ContentPanelHeader = styled('div')({
  display: 'flex',
  width: '100%',
  marginBottom: 15
});

interface ContentPanelHeaderItemProps {
  main?: boolean;
  alignEnd?: boolean;
}

const ContentPanelHeaderItem = styled('div')(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  ({ main, alignEnd }: ContentPanelHeaderItemProps) => {
    const style = {};

    if (main) {
      Object.assign(style, { flex: 1 });
    }

    if (alignEnd) {
      Object.assign(style, { justifyContent: 'flex-end' });
    }

    return style;
  }
);




const ContentPanelHeading = styled('span')({
  fontSize: 12,
  textTransform: 'uppercase',
  fontWeight: 300
});

// Exported components

export interface LoginScreenState {
  showLoginOptions: boolean;
}

export class LoginScreen extends Component<any, LoginScreenState> {
  state = {
    showLoginOptions: false
  };

  switchScreen = () => {
    this.setState(state => ({ showLoginOptions: !state.showLoginOptions }));
  };

  handleWalletProviderSelect = (walletProvider: WalletProvider) => {
    const wallet = WAL.accessContext.initWallet(walletProvider);
    // wallet.connect().then(wallet.discover().then(wallet.login));
    
    // A callback of this kind can be supplied to the discover function, which will allow the caller to modify the list of keys before the account lookup process happens. 
    // The feature was added so that key returned from the Ledger device can be modified to have a ENU prefix when in use with the the enumivo chain 
    const keyModCallback : KeyModifierCallback = ( discoveryData: DiscoveryData ) : DiscoveryData => {
      console.log("Inside My KeyModifierCallback");
      console.log("Before data is modified");
      console.log(discoveryData);
      const modifiedDiscoveryData = discoveryData;
      if(modifiedDiscoveryData !== undefined && modifiedDiscoveryData.keys !== undefined && modifiedDiscoveryData.keys[0].key !== undefined) {
        modifiedDiscoveryData.keys[0].key = modifiedDiscoveryData.keys[0].key.replace("EOS", "ENU");
      }
      console.log("After data is modified");        
      console.log(modifiedDiscoveryData);
      return modifiedDiscoveryData;
    }
    
    wallet.connect().then(() => {

      const start1 = window.performance.now();
        // wallet.discover({ pathIndexList: [ 0,1 ], keyModifierFunc: keyModCallback} ).then((discoveryData: DiscoveryData) => {

        const myStorage = window.localStorage;
        const discoveryDataCached : any = localStorage.getItem('discoveryData');
        let presetKeyMap : any;
        const discoveryOptions : DiscoveryOptions = { pathIndexList: [ 0,1 ] };

        if(discoveryDataCached) { 
          presetKeyMap = JSON.parse(discoveryDataCached);
          console.log("LocalStorage contains data. presetKeyMap:");
          console.log(presetKeyMap);
          
          // Note: Setting this value will warm the discoveryData cache, this allows you to save discoveryData from a previous session and supply it again .. avoiding the network overhead of looking up the data again. 
          // discoveryOptions.presetKeyMap = presetKeyMap;
          // OR 
          // discoveryOptions.presetKeyMap = [{
          //   key: "EOS5TYtUXsbRJrz61gsQWQho6AYyCcRFgbFm4TPfrEbzb43x8Ewfq",
          //   index: 0
          // }];

          if(discoveryOptions.presetKeyMap) {
            console.log("Supply presetKeyMap and warm the cache");
          }

        }

        wallet.discover( discoveryOptions ).then((discoveryData: DiscoveryData) => {

          localStorage.setItem('discoveryData', JSON.stringify(discoveryData.keyToAccountMap));

          const end1 = window.performance.now();
          const time1 = end1 - start1;
          console.log(time1);

          console.log(discoveryData);

          console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        
          if (discoveryData.keyToAccountMap.length > 0) {
            // console.log(discoveryData.keyToAccountMap.length + ' keys returned, pick one');
            const index = 0;
            const keyObj = discoveryData.keyToAccountMap[index];
  
            const accountName = keyObj.accounts[0].account;
            const authorization = keyObj.accounts[0].authorization;
  
            wallet.login(accountName, authorization);
          } else {
            // 0 keys returned, we need to user to select an account
            wallet.login();
          }

        }); 
    });
  };

  handleWalletReconnectClick = (wallet: Wallet) => {
    wallet.connect().then(wallet.login);
  };

  isLoggedIn = () => !!WAL.accessContext.getActiveWallets().length;

  render() {
    const {
      switchScreen,
      handleWalletProviderSelect,
      handleWalletReconnectClick,
      isLoggedIn
    } = this;
    const { showLoginOptions } = this.state;
    const { getWallets, getWalletProviders } = WAL.accessContext;

    if (isLoggedIn()) return <Redirect to="/" />;

    return (
      
      <LoginScreenRoot>
        {showLoginOptions ? (
          <>
            <ContentPanelHeader>
              <ContentPanelHeaderItem main={true}>
                <ContentPanelHeading>Login Options</ContentPanelHeading>
              </ContentPanelHeaderItem>
              <ContentPanelHeaderItem alignEnd={true}>
                <CloseButton onClick={switchScreen} size={40} />
              </ContentPanelHeaderItem>
            </ContentPanelHeader>
            <LoginScreenWalletList
              walletProviders={getWalletProviders()}
              wallets={getWallets()}
              onWalletProviderSelect={handleWalletProviderSelect}
              onWalletReconnectClick={handleWalletReconnectClick}
            />
          </>
        ) : (
          <LoginButton onClick={switchScreen} />
        )}
      </LoginScreenRoot>
    );
  }
}

export default withRouter(LoginScreen);
