const { useEffect, useState } = wp.element;
const { Card, CardHeader, CardBody, CardFooter, CheckboxControl, ExternalLink, TextControl } = wp.components;

import { __ } from '@wordpress/i18n';

import { dispatch, useDispatch, useSelect, select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

import StatusDisplay from './StatusDisplay'

export default function InboundLinks({postId}) {

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
    
            return Array.from(doc.querySelectorAll('a')).map(async (link, index) => {

                const linkId = `${blockId}/${index}`;
                const href = link.href;
                
                const existingLink = links.find(l => l.id === linkId);
                const status = await getUpdatedStatus(existingLink?.href, href, existingLink?.status);

                return {
                    id: linkId,
                    href: href,
                    innerText: link.innerText,
                    blockId: blockId,
                    targetBlank: link.attributes.target ? link.attributes.target.value : '',
                    noFollow: link.attributes.rel ? link.attributes.rel.value : '',
                    status: status
                };
            });
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

    const scrollToBlock = (blockId) => {
        setTimeout(() => {
            const blockElement = document.querySelector(`[data-block="${blockId}"]`);
            if (blockElement) {
                blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                dispatch('core/block-editor').flashBlock(blockId)
            }
        }, 100);
    };

    const getUpdatedStatus = async (oldHref, newHref, oldStatus) => {
        if (oldHref !== newHref) {
            return await checkStatus(newHref);
        }
        return oldStatus;
    };

    const updateLink = async (linkId, values) => {
        const updatedLinks = [...links];
        const linkToUpdate = updatedLinks.find(link => link.id === linkId);

        if (linkToUpdate) {

            if (values.href) {
                linkToUpdate.status = await getUpdatedStatus(linkToUpdate.href, values.href, linkToUpdate.status);
                linkToUpdate.href = values.href;
            }

            if (values.blank !== undefined) {
                linkToUpdate.targetBlank = !values.blank ? undefined : '_blank';
            }

            if (values.rel !== undefined) {
                linkToUpdate.noFollow = !values.rel ? undefined : 'nofollow';
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
                    link.setAttribute('rel', linkToUpdate.noFollow)
                }

            });

            const updatedContent = doc.body.innerHTML;

            dispatch('core/block-editor').updateBlockAttributes(linkToUpdate.blockId, { content: updatedContent });
            
            dispatch('core/block-editor').flashBlock(linkToUpdate.blockId)
        }
    };

    return(
        <div>
            <h3>{__('Outbound Links', 'simple-link-checker')}</h3>
            {links.map((link) => (
                <div key={link.id} style={{marginBottom: '1rem'}}>

                    <Card>
                        <CardHeader>
                            <div>
                                <p><ExternalLink href={link.href}>{link.innerText}</ExternalLink></p>
                                <p><StatusDisplay statusCode={link.status} /></p>
                                <p><button onClick={() => scrollToBlock(link.blockId)}>{__('Scroll to Block', 'simple-link-checker')}</button></p>                                
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

                            <CheckboxControl
                                label={__('Mark as nofollow')}
                                checked={link.noFollow === 'nofollow'}
                                onChange={(rel) => updateLink(link.id, {rel})}
                            />
                        </CardBody>
                    </Card>

                </div>
            ))}
        </div>   
    )
}