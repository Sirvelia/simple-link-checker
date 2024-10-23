<div x-data="outboundLinks()">
    <h2 class="slc-text-md slc-font-medium slc-text-gray-900 slc-p-0 slc-mb-4">{!! esc_html__('Outbound Links', 'simple-link-checker') !!}</h2>

    <template x-if="blocks && blocks.length &gt; 0">
        <div>
            <template x-for="block in blocks" :key="block.clientId">
                <template x-if="block.links && block.links.length &gt; 0">

                    <div class="slc-overflow-hidden slc-rounded-lg slc-bg-gray-50 slc-border slc-border-gray-200 slc-border-solid slc-mb-4 slc-shadow">
                        <div class="slc-px-2 slc-py-3 sm:slc-p-3">
                            <div class="slc-flex slc-justify-between slc-items-center">
                                <span class="lg:slc-text-md">{!! esc_html__( 'Block' ) !!}</span>

                                <button @click="scrollToBlock(block)" class="slc-border-0 slc-cursor-pointer slc-rounded slc-bg-white slc-px-2 slc-py-1 slc-text-xs slc-font-semibold slc-text-gray-900 slc-shadow-sm slc-ring-1 slc-ring-inset slc-ring-gray-300 hover:slc-bg-gray-50">{!! esc_html__('Scroll to Block', 'simple-link-checker') !!}</button>
                            </div>

                            <div class="slc-relative slc-mb-2">
                                <div class="slc-absolute slc-inset-0 slc-flex slc-items-center" aria-hidden="true">
                                    <div class="slc-w-full slc-border slc-border-t slc-border-gray-300 slc-border-solid"></div>
                                </div>
                                
                                <div class="slc-relative slc-flex slc-justify-center">
                                    <span class="slc-bg-gray-50 slc-px-3 slc-text-xs slc-leading-6 slc-text-gray-900">{!! esc_html__('Links') !!}</span>
                                </div>
                            </div>

                            <div class="slc-grid slc-grid-cols-1 lg:slc-grid-cols-2 slc-gap-4">
                                <template x-for="link in block.links" :key="link.id">
                                    @include('parts/outbound-link.blade.php')
                                </template>
                            </div>  
                        </div>
                    </div>

                </template>
            </template>
        </div>
    </template>
</div>