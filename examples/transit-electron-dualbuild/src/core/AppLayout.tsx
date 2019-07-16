import React, { ReactNode } from 'react';
import {
	ScreenLayout,
	ScreenContentHeader,
	ScreenContentBody,
	ScreenContentBodyContainer,
	ScreenContentHeaderMain
} from '../shared/screen';
import { LogoLink } from '../shared/LogoLink';
import UserBlock from './UserBlock';

export interface AppLayoutProps {
	children?: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
	return (
		<ScreenLayout>
			<ScreenContentHeader>
				<ScreenContentHeaderMain>
					<LogoLink to="/" />
				</ScreenContentHeaderMain>
				<UserBlock />
			</ScreenContentHeader>

			<ScreenContentBody>
				<ScreenContentBodyContainer>{children}</ScreenContentBodyContainer>
			</ScreenContentBody>
		</ScreenLayout>
	);
}

export default AppLayout;
