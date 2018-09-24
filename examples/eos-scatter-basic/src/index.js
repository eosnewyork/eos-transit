import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

// Some hardcode data

const network = {
  blockchain: 'eos',
  host: 'api.pennstation.eosnewyork.io',
  port: 7001,
  protocol: 'http',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
};

const eosOptions = { expireInSeconds: 60 };

// Note: Just left here for reference and reuse
const customEosOptions = {
  httpEndpoint: `${network.protocol}://${network.host}:${network.port}`,
  chainId: network.chainId
};

function connectToScatter(preferExtension = true, appName = 'my_eos_dapp') {
  return new Promise((resolve, reject) => {
    if (preferExtension) {
      document.addEventListener('scatterLoaded', () => {
        resolve(ScatterJS.scatter);
      });
    } else {
      // NOTE: This is only needed by Scatter Desktop, looks like
      // ScatterWebExtension already has scatter.eos defined on its own.
      ScatterJS.plugins(new ScatterEOS());

      // Note: This actually tries to connect to Scatter Desktop explicitly
      // and logs out the console error if its not running.
      ScatterJS.scatter
        .connect(
          appName,
          { initTimeout: 10000 }
        )
        .then(connected => {
          if (connected) {
            resolve(ScatterJS.scatter);
          } else {
            reject(new Error('Cannot connect to Scatter'));
          }
        });
    }
  });
}

function getIdentity(scatter, net) {
  return scatter.getIdentity({
    accounts: [net]
  });
}

function getEosAccount(identity) {
  return identity.accounts.find(x => x.blockchain === 'eos');
}

function pay(eosInstance, senderName, receiverName, amount) {
  return new Promise((resolve, reject) => {
    if (!senderName) {
      return reject(new Error('Sender account name is not provided!'));
    }
    if (!receiverName) {
      return reject(new Error('Receiver account name is not provided!'));
    }

    if (!amount) return reject(new Error('Amount not specified'));

    eosInstance.transfer(
      {
        from: senderName,
        to: receiverName,
        quantity: `${Number(amount).toFixed(4)} EOS`,
        memo: 'test_vr'
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
  });
}

async function init() {
  const scatter = await connectToScatter(false);
  console.log('[app] Scatter instance', scatter);

  const eosInstance = scatter.eos(network, Eos, eosOptions);
  console.log('[app] Scatter-wrapped EOS instance', eosInstance);

  const identity = await getIdentity(scatter, network);
  console.log('[app] Identity obtained', identity);

  const account = getEosAccount(identity);
  console.log('[app] Account selected', account);

  function requestTxn(senderName, receiverName, amount) {
    return pay(
      eosInstance,
      // Eos(Object.assign({}, customEosOptions, { signProvider: customSignProvider })),
      senderName /* account.name */,
      receiverName,
      amount
    )
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
