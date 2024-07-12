const { useEffect, useState } = wp.element;
const { CheckboxControl, ExternalLink, Flex, FlexItem, TextControl } = wp.components;
import { __ } from '@wordpress/i18n';

import { createBlock, store as blocksStore } from '@wordpress/blocks';
import { dispatch, useDispatch, useSelect, select } from '@wordpress/data';

export default function App() {

    const [links, setLinks] = useState([]);

    const blocks = useSelect((select) =>
        select('core/block-editor').getBlocks()
    );

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = () => {
        
        const links = blocks ? blocks.flatMap(block => {

            const blockId = block.clientId;
            const content = block.originalContent || '';

            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');

            const links = Array.from(doc.querySelectorAll('a')).map((link, index) => ({
                id: `${blockId}/${index}`,
                href: link.href,
                innerText: link.innerText,
                blockId: blockId,
                targetBlank: link.attributes.target ? link.attributes.target.value : ''
            }));

            return links;

        }) : [];

        setLinks(links);
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
                <div key={link.id}>

                    <ExternalLink href={link.href}>{link.innerText}</ExternalLink>

                    <Flex
                        gap="3"
                        justify="flex-start"
                    >
                        <FlexItem>
                            <TextControl
                                value={link.href}
                                onChange={(href) => updateLink(link.id, {href})}
                            />
                        </FlexItem>

                        <FlexItem>
                            <CheckboxControl
                                label={__('Target _blank' , 'simple-link-checker')}
                                checked={link.targetBlank === '_blank'}
                                onChange={(blank) => updateLink(link.id, {blank})}
                            />
                        </FlexItem>
                        
                    </Flex>

                </div>
            ))}
        </div>
    );
    
}