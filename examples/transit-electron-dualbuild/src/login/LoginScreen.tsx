import React, { Component } from 'react';
import styled from 'react-emotion';
import { Redirect, withRouter } from 'react-router';
import WAL, { WalletProvider, Wallet, DiscoveryData, DiscoveryOptions, DiscoverContinueCallback, DiscoveryAccount } from 'eos-transit';
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

  handleWalletProviderSelect = (walletProvider: WalletProvider, pin: any) => {
    const wallet = WAL.accessContext.initWallet(walletProvider);
    // wallet.connect().then(wallet.discover().then(wallet.login));
    // @ts-ignore
    wallet.connect(pin).then(() => {

      const start1 = window.performance.now();
        // wallet.discover({ pathIndexList: [ 0,1 ], keyModifierFunc: keyModCallback} ).then((discoveryData: DiscoveryData) => {

        const discoveryDataCached : any = localStorage.getItem('discoveryData');
        let presetKeyMap : any;
        const discoveryOptions : DiscoveryOptions = { pathIndexList: [ 0,1 ] };

        discoveryOptions.keyLookupFunc = (discoveryData: DiscoveryData, callback: DiscoverContinueCallback) => {
          console.log('discoveryData in keyLookupFunc: ');
          console.log(discoveryData);

          /*
          Exmaple discoveryData structure:
          {
            "keys": [
              {
                "index": 0,
                "key": "EOS5TYtUXsbRJrz61gsQWQho6AYyCcRFgbFm4TPfrEbzb43x8Ewfq"
              },
              {
                "index": 1,
                "key": "EOS8MBNb9GwkqM3eXYCDVsgeqVeMbf3wS7fp6smzCj63CVZgFEede"
              }
            ],
          }
          */

          /*
          * Your function is provided with an array of keys in the format above. 
          * Use whatever method you'd like to resolve the keys to account information and build a structure that looks like the DiscoveryAccount[] structure below. 
          * Then call the callback() function with the data which will allow the login process to continue.
          */

          let accountInfoArray: DiscoveryAccount[] = [{
            index: 0,
            key: "EOS5TYtUXsbRJrz61gsQWQho6AYyCcRFgbFm4TPfrEbzb43x8Ewfq",
            accounts : [{
              account: "wozzawozza",
              authorization: "active"
            }]
          }];

          /*
          Example DiscoveryAccount[] structure
          [
            {
              "index": 0,
              "key": "EOS5TYtUXsbRJrz61gsQWQho6AYyCcRFgbFm4TPfrEbzb43x8Ewfq",
              "accounts": [
                {
                  "account": "wozzawozza",
                  "authorization": "active"
                }
              ]
            }
          ]
          */

          callback(accountInfoArray);
        }

        // Uncomment this when testing the keyLookupFunc above
        discoveryOptions.keyLookupFunc = undefined;

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
