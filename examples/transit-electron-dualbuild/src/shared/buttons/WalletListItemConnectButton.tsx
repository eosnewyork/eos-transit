import styled from 'react-emotion';

export const WalletListItemConnectButton = styled('button')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    border: 'none',
    borderRadius: 1,
    padding: '8px 20px',
    fontSize: 11,
    fontWeight: 300,
    textAlign: 'center',
    backgroundColor: '#98243f',
    color: 'white',
    textTransform: 'uppercase',
    outline: 'none',
    transition: 'all 0.2s',
  
    '&:last-child': {
      borderBottomLeftRadius: 1,
      borderBottomRightRadius: 1
    },
  
    '&:hover': {
      // backgroundColor: '#2e3542',
      backgroundColor: '#ab2847',
      color: 'white',
      cursor: 'pointer'
    },
  
    '&:active': {
      // backgroundColor: '#2e3542',
      backgroundColor: '#c3173f'
    }
  });

  export default WalletListItemConnectButton