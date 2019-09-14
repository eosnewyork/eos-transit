import React from 'react';
import MetrolPinScreen from './metro/MetroPinScreen'
import {ProviderProps} from './ProviderTypes'

const Provider = (props: ProviderProps) => {

    switch(props.ProviderId)
    {
        case 'Metro' :
            {
                return <MetrolPinScreen {...props} />
            }
            default :
            {
                return null
            }
    }
}

export default Provider