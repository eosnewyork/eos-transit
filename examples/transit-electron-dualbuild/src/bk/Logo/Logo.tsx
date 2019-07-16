import React from 'react';

import logoImage from './logo.svg';
import classes from './Logo.module.css';

const logo = (props: any) => (
    <div className={classes.Logo} onClick={props.clicked}>
        <img src={logoImage} alt="React Logo" />
    </div>
);

export default logo;
