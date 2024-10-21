import Alpine from 'alpinejs';

import apiFetch from '@wordpress/api-fetch';

declare global {
    interface Window {
        simpleLinkChecker: {
            apiUrl: string,
            postID: number,
            adminUrl: string,
        };
    }
}

interface Link {
    ID: number;
    post_title: string;
    post_type: string;
}

// Main function to set up outbound links functionality
export default function inboundLinks(): void {
    document.addEventListener('alpine:init', () => {
        Alpine.data('inboundLinks', () => ({
           
            links: [] as Link[],

            async init(): Promise<void> {

                this.links = await apiFetch({
                    url: `${window.simpleLinkChecker.apiUrl}simple-link-checker/v1/inbound-links/?post_id=${window.simpleLinkChecker.postID}`,
                    method: 'GET',
                });

            },

        }));
    });
}