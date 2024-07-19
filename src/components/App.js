const { useEffect, useState } = wp.element;
const { Card, CardHeader, CardBody, CardFooter, CheckboxControl, ExternalLink, TextControl } = wp.components;

import { __ } from '@wordpress/i18n';

import { dispatch, useDispatch, useSelect, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';


export default function App() {

    const [links, setLinks] = useState([]);

    const [blocks, setBlocks] = useState([]);

    const currentBlocks = useSelect(select => 
        select('core/block-editor').getBlocks()
    );

    const blockCount = useSelect(select => 
        select('core/block-editor').getBlockCount()
    );

    useEffect(() => {
        const updatedBlocks = currentBlocks.map(block => ({
            clientId: block.clientId,
            name: block.name,
            htmlContent: wp.blocks.getBlockContent(block)
        }));
        setBlocks(updatedBlocks);
    }, [currentBlocks, blockCount]);

    useEffect(() => {
        fetchLinks()
    }, [blocks])


    const fetchLinks = async () => {
        if (!blocks) return;
    
        const linkPromises = blocks.flatMap(block => {
            const blockId = block.clientId;
            const content = block.htmlContent || '';
    
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
    
            return Array.from(doc.querySelectorAll('a')).map(async (link, index) => ({
                id: `${blockId}/${index}`,
                href: link.href,
                innerText: link.innerText,
                blockId: blockId,
                targetBlank: link.attributes.target ? link.attributes.target.value : '',
                status: await checkStatus(link.href)
            }));
        });
    
        const resolvedLinks = await Promise.all(linkPromises.flat());
        setLinks(resolvedLinks);
    };

    const checkStatus = (url) => {
        return apiFetch({
            url: `${simpleLinkChecker.apiUrl}simple-link-checker/v1/check-link?url=${encodeURIComponent(url)}`,
            method: 'GET'
        }).then(response => response.status)
        .catch(error => {
            return `Error: ${error.message}`;
        });
    };

    const updateLink = (linkId, values) => {
        const updatedLinks = [...links];
        const linkToUpdate = updatedLinks.find(link => link.id === linkId);

        if (linkToUpdate) {

            if (values.href) {
                linkToUpdate.href = values.href;
            }

            if (values.blank !== undefined) {
                linkToUpdate.targetBlank = !values.blank ? undefined : '_blank';
            }

            setLinks(updatedLinks);

            updateBlockContent(linkToUpdate);
        }
    };

    const updateBlockContent = (linkToUpdate) => {
        const block = select('core/block-editor').getBlock(linkToUpdate.blockId);

        if (block) {
            const content = block.attributes.content || '';

            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');

            const links = doc.querySelectorAll('a');

            links.forEach((link, index) => {

                const linkToUpdateIndex = parseInt(linkToUpdate.id.split('/')[1])

                if (index === linkToUpdateIndex) {
                    link.setAttribute('href', linkToUpdate.href);
                    link.setAttribute('target', linkToUpdate.targetBlank)
                }

            });

            const updatedContent = doc.body.innerHTML;

            dispatch('core/block-editor').updateBlockAttributes(linkToUpdate.blockId, { content: updatedContent });

            dispatch('core/block-editor').flashBlock(linkToUpdate.blockId)
        }
    };

    return (
        <div>
            <h3>{__('Outbound Links', 'simple-link-checker')}</h3>
            {links.map((link) => (
                <div key={link.id} style={{marginBottom: '1rem'}}>

                    <Card>
                        <CardHeader>
                            <div>
                                <span>{__('Link')}: <ExternalLink href={link.href}>{link.innerText}</ExternalLink></span><br/>
                                <span>{__('Status')} {link.status}</span>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <TextControl
                                value={link.href}
                                onChange={(href) => updateLink(link.id, {href})}
                            />

                            <CheckboxControl
                                label={__('Open in new tab')}
                                checked={link.targetBlank === '_blank'}
                                onChange={(blank) => updateLink(link.id, {blank})}
                            />
                        </CardBody>
                    </Card>

                </div>
            ))}
        </div>
    );
    
}