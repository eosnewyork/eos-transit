import React, { ReactNode } from 'react';
import {
	ScreenLayout,
	ScreenContentHeader,
	ScreenContentBody,
	ScreenContentBodyContainer,
	ScreenContentHeaderMain
} from '.';
import { LogoLink } from '../ui/LogoLink';

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
			</ScreenContentHeader>

			<ScreenContentBody>
				<ScreenContentBodyContainer>{children}</ScreenContentBodyContainer>
			</ScreenContentBody>
		</ScreenLayout>
	);
}

export default AppLayout;
