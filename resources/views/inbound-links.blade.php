<div x-data="inboundLinks()">
    <h2 class="slc-text-md slc-font-medium slc-text-gray-900 slc-p-0 slc-mb-4">{!! esc_html__('Inbound Links', 'simple-link-checker') !!}</h2>

    <template x-if="links && links.length &gt; 0">
        <div>
            <template x-for="link in links" :key="link.ID">
                <template x-if="link.ID">
                    <a :href=`${window.simpleLinkChecker.adminUrl}post.php?post=${link.ID}&action=edit` target="_blank" rel="noopener noreferrer" x-html="`${link.post_title} (${link.post_type})`"></a>
                </template>
            </template>
        </div>
    </template>
</div>