import Alpine from 'alpinejs';

import apiFetch from '@wordpress/api-fetch';

// Extend the global Window interface to include WordPress-specific properties
declare global {
    interface Window {
        wp: {
            data: {
                select: (store: string) => any;
                subscribe: (callback: () => void) => void;
                dispatch: (store: string) => any;
            };
            blocks: {
                getBlockContent: (block: any) => string;
            };
        };
    }
}

// Define interfaces for our data structures
interface Block {
    clientId: string;
    name: string;
    content: string;
    links: Link[];
}

interface Link {
    id: string;
    href: string;
    innerText: string;
    targetBlank: boolean;
    noFollow: boolean;
    isImageLink: boolean;
    status: number;
}

// Destructure WordPress data and blocks functions
const { select, subscribe, dispatch } = window.wp.data;
const { getBlockContent } = window.wp.blocks;

const COMPATIBLE_BLOCKS = [
    'core/paragraph',
    'core/heading',
    'core/list',
    'core/quote',
    'core/buttons',
    'core/columns',
    'core/group'
];

// Main function to set up outbound links functionality
export default function outboundLinks(): void {
    document.addEventListener('alpine:init', () => {
        Alpine.data('outboundLinks', () => ({
            blocks: [] as Block[],
            links: [] as Link[],

            // Initialize the component
            init(): void {
                // Subscribe to WordPress block editor changes
                subscribe(this.updateBlocks.bind(this));
            },

            // Update blocks when changes occur in the editor
            updateBlocks(): void {
                const { getBlocks, getBlock } = select('core/block-editor');
                const blocks = getBlocks();

                // Map each block to our Block interface and filter out null values
                this.blocks = blocks
                    .map((block: Block) => this.createBlockData(getBlock(block.clientId)))
                    .filter((block: Block): block is Block => block !== null);
            },

            // Create a Block object from WordPress block data
            createBlockData(block: any): Block | null {
                if (!block) return null;

                if (!COMPATIBLE_BLOCKS.includes(block.name)) {
                    return null;
                }

                const content = getBlockContent(block);
                const links = this.getBlockLinks(block, content);

                return {
                    clientId: block.clientId,
                    name: block.name,
                    content,
                    links,
                };
            },

            // Extract links from a block's content
            getBlockLinks(block: any, content: string): Link[] {
                if (!content) return [];

                const doc = new DOMParser().parseFromString(content, 'text/html');
                return Array.from(doc.querySelectorAll('a')).map((link: HTMLAnchorElement, index: number) =>
                    this.createLinkData(block.clientId, link, index)
                );
            },

            // Create a Link object from an HTML anchor element
            createLinkData(blockId: string, link: HTMLAnchorElement, index: number): Link {
                return {
                    id: `${blockId}/${index}`,
                    href: link.href,
                    innerText: link.innerText,
                    targetBlank: link.target === '_blank',
                    noFollow: link.rel ? link.rel.includes('nofollow') : false,
                    isImageLink: link.querySelector('img') !== null,
                };
            },

            // Scroll to a specific block in the editor
            scrollToBlock(block: Block): void {
                const blockElement = document.querySelector(`[data-block="${block.clientId}"]`);
                if (blockElement) {
                    blockElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const blockEditor = dispatch('core/block-editor');
                    blockEditor.flashBlock(block.clientId);
                    blockEditor.selectBlock(block.clientId);
                }
            },

            // Update a link in the editor
            updateLink(): void {
                const { getBlock, getBlockAttributes } = select('core/block-editor');
                const { updateBlockAttributes } = dispatch('core/block-editor');
                const blockId = this.$data.block.clientId;
                const block = getBlock(blockId);

                if (block) {
                    const blockContent = getBlockAttributes(blockId). content
                    const updatedContent = this.updateLinkInContent(blockContent);

                    updateBlockAttributes(blockId, { content: updatedContent });
                }
            },

            // Helper function to update a link within the block content
            updateLinkInContent(content: string): string {
                const doc = new DOMParser().parseFromString(content, 'text/html');

                const links = doc.querySelectorAll('a');
                const linkToUpdateIndex = parseInt(this.$data.link.id.split('/')[1]);

                // Update the href attribute of the specific link
                links[linkToUpdateIndex]?.setAttribute('href', this.$data.link.href);

                return doc.body.innerHTML;
            },

            // Toggle nofollow attribute for a link
            toggleNoFollow(): void {
                const { getBlock, getBlockAttributes } = select('core/block-editor');
                const { updateBlockAttributes } = dispatch('core/block-editor');
                const blockId = this.$data.block.clientId;
                const block = getBlock(blockId);

                if (block) {
                    const updatedContent = this.updateLinkAttribute(
                        getBlockAttributes(blockId).content,
                        'rel',
                        'nofollow',
                        this.$data.link.noFollow
                    );
                    updateBlockAttributes(blockId, { content: updatedContent });
                }
            },

            // Toggle target="_blank" attribute for a link
            toggleTargetBlank(): void {
                const { getBlock, getBlockAttributes } = select('core/block-editor');
                const { updateBlockAttributes } = dispatch('core/block-editor');
                const blockId = this.$data.block.clientId;
                const block = getBlock(blockId);

                if (block) {
                    const updatedContent = this.updateLinkAttribute(
                        getBlockAttributes(blockId).content,
                        'target',
                        '_blank',
                        this.$data.link.targetBlank
                    );
                    updateBlockAttributes(blockId, { content: updatedContent });
                }
            },

            // Helper function to update link attributes
            updateLinkAttribute(content: string, attribute: string, value: string, shouldAdd: boolean): string {
                const doc = new DOMParser().parseFromString(content, 'text/html');

                const links = doc.querySelectorAll('a');
                const linkToUpdateIndex = parseInt(this.$data.link.id.split('/')[1]);
                const linkElement = links[linkToUpdateIndex];

                if (linkElement) {
                    if (attribute === 'rel') {
                        const relValues = (linkElement.getAttribute('rel') || '').split(' ').filter(val => val !== '');
                        if (shouldAdd && !relValues.includes(value)) {
                            relValues.push(value);
                        } else if (!shouldAdd) {
                            const index = relValues.indexOf(value);
                            if (index > -1) {
                                relValues.splice(index, 1);
                            }
                        }
                        if (relValues.length > 0) {
                            linkElement.setAttribute('rel', relValues.join(' '));
                        } else {
                            linkElement.removeAttribute('rel');
                        }
                    } else if (attribute === 'target') {
                        if (shouldAdd) {
                            linkElement.setAttribute(attribute, value);
                        } else {
                            linkElement.removeAttribute(attribute);
                        }
                    }
                }

                return doc.body.innerHTML;
            },

            async checkLinkStatus(): Promise<void> {

                this.$data.link.loading = true

                const link = this.$data.link

                const response = await apiFetch({
                    url: `${window.simpleLinkChecker.apiUrl}simple-link-checker/v1/check-link/?url=${link.href}`,
                    method: 'GET',
                });

                this.$data.link.loading = false
                this.$data.link.status = response.status

            }

        }));
    });
}