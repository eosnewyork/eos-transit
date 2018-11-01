import styled from 'react-emotion';

export interface Props {
  visible?: boolean;
  alignRight?: boolean;
}

export const DropdownContent = styled('div')<Props>(
  {
    position: 'absolute',
    zIndex: 20,
    top: '100%',
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: '#171c24',
    color: 'white',
    boxShadow: '0 5px 30px -8px rgba(0, 0, 0, 0.5)',
    transform: 'scale(0)',
    transition: 'all 0.2s'
  },
  ({ alignRight, visible }: Props) => {
    return {
      display: 'block',
      visibility: visible ? 'visible' : 'hidden',
      // display: visible ? 'block' : 'none',
      right: alignRight ? 0 : 'auto',
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1) scaleY(1)' : 'scaleX(0.95) scaleY(0.9)',
      transformOrigin: 'top right'
    };
  }
);

DropdownContent.displayName = 'DropdownContent';

export default DropdownContent;
