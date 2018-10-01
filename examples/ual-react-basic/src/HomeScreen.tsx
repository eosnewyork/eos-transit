import React from 'react';
import { TiThSmall } from 'react-icons/ti';
import { NoContent } from './shared/NoContent';

export function HomeScreen() {
  return (
    <div>
      <NoContent
        message="Some app content will be here soon"
        note="Under construction, hang tight!"
        icon={TiThSmall}
      />
    </div>
  );
}

export default HomeScreen;
