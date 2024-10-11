const { Button, Card, CardHeader, CardBody, CardFooter, CheckboxControl, ExternalLink, Flex, FlexBlock, FlexItem, TextControl } = wp.components;

import { __ } from '@wordpress/i18n';

import StatusDisplay from './StatusDisplay'

export default function OutboundLink({ link }) {

    return(
        <FlexItem
            width={'30%'}
        >
            <Card>
                <CardBody>
                    <Flex>
                        <FlexItem>
                            <StatusDisplay statusCode={link.status} />
                        </FlexItem>
                        <FlexBlock>
                            <ExternalLink href={link.href}>
                                {link.isImageLink ? __('Image: ', 'simple-link-checker') : ''}
                                {link.innerText || __('(No text)', 'simple-link-checker')}
                            </ExternalLink>
                        </FlexBlock>
                    </Flex>
                </CardBody>
            </Card>
        </FlexItem>
    )

}
