const { useEffect, useState } = wp.element;
const { Card, CardBody } = wp.components;

import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

export default function InboundLinks({postId}) {

    const [inboundLinks, setInboundLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInboundLinks();
    }, [postId])

    const fetchInboundLinks = async () => {
        try {
            const response = await apiFetch({
                url: `${simpleLinkChecker.apiUrl}simple-link-checker/v1/inbound-links/?post_id=${postId}`,
                method: 'GET',
            });

            setInboundLinks(response);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching inbound links:', error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <p>Loading inbound links...</p>;
    }

    return (
        <div>
            <h3>{__('Inbound Links', 'simple-link-checker')}</h3>

            <Card>
                <CardBody>

                    {inboundLinks.length === 0 ? (
                        <p>{__('No inbound links found.', 'simple-link-checker')}</p>
                    ) : (
                        <ul>
                            {inboundLinks.map((link) => (
                                <li key={link.ID}>
                                    <a href={`/wp-admin/post.php?post=${link.ID}&action=edit`} target="_blank" rel="noopener noreferrer">
                                        {link.post_title} ({link.post_type})
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}

                </CardBody>
            </Card>
        </div>
    );

  }