import { makeUAL } from 'eos-ual';
import { makeScatterDesktopIntegration } from 'eos-ual/lib/integrations/scatter-desktop';

// Some hardcode data

const appName = 'my_eos_dapp';

const scatterNetworkConfig = {
  blockchain: 'eos',
  host: 'api.pennstation.eosnewyork.io',
  port: 7001,
  protocol: 'http',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
};

const scatterDesktopIntegration = makeScatterDesktopIntegration(
  appName,
  scatterNetworkConfig
);

const opts = {
  appName,
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
  httpEndpoint: 'http://api.pennstation.eosnewyork.io:7001',
  expireInSeconds: 60,
  integrations: [scatterDesktopIntegration]
};

async function init() {
  const UAL = makeUAL(opts);
  
  console.log('[init]', appName);
  const account = await UAL.getAccount('bob123451234');
  console.log(account);

  function requestTxn(senderName, receiverName, amount) {
    return UAL.transfer(senderName, receiverName, amount)
      .then(result => {
        console.log('[txn]: Transaction successful', result);
      })
      .catch(error => {
        console.warn('[txn]: Transaction error', error);
      });
  }

  // Boring DOM stuff
  const senderInputEl = document.getElementById('sender');
  const receiverInputEl = document.getElementById('receiver');
  const amountInputEl = document.getElementById('amount');
  const txtButton = document.getElementById('txnButton');
  txtButton.addEventListener('click', () =>
    requestTxn(senderInputEl.value, receiverInputEl.value, amountInputEl.value)
  );
}

document.addEventListener('DOMContentLoaded', init);
