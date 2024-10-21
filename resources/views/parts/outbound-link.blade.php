<div class="slc-overflow-hidden slc-rounded-lg slc-bg-white slc-shadow">
    <div class="slc-px-2 slc-py-3 sm:slc-p-2">
        <div class="slc-mb-2 slc-flex slc-gap-2">
            <a class="slc-no-underline slc-rounded slc-bg-indigo-50 slc-px-2 slc-py-1 slc-text-xs slc-font-semibold slc-text-indigo-600 slc-shadow-sm hover:slc-bg-indigo-100" :href="link.href" target="_blank">{!! esc_html__('Open Link', 'simple-link-checker') !!}</a>

            <template x-if="!link.status">
                <button class="slc-border-0 slc-cursor-pointer slc-no-underline slc-rounded slc-bg-teal-50 slc-px-2 slc-py-1 slc-text-xs slc-font-semibold slc-text-teal-600 slc-shadow-sm hover:slc-bg-teal-100" @click="checkLinkStatus()" :disabled="link.loading == true">{!! esc_html__('Check Status', 'simple-link-checker') !!}</button>
            </template>

            <template x-if="link.status">
                <span class="slc-border-0 slc-no-underline slc-rounded slc-bg-gray-50 slc-px-2 slc-py-1 slc-text-xs slc-font-semibold slc-text-gray-600 slc-shadow-sm" x-html="link.status"></span>
            </template>
        </div>

        <div class="slc-mb-2">
            <label for="`edit-${link.id}`" class="slc-sr-only">{!! esc_html__('Edit Link', 'simple-link-checker') !!}</label>
            <input type="text" name="`edit-${link.id}`" :id="`edit-${link.id}`" class="slc-block slc-w-full slc-rounded-md slc-border-0 slc-py-1.5 slc-text-gray-900 slc-shadow-sm slc-ring-1 slc-ring-inset slc-ring-gray-300 placeholder:slc-text-gray-400 focus:slc-ring-2 focus:slc-ring-inset focus:slc-ring-indigo-600 sm:slc-text-sm sm:slc-leading-6" x-model="link.href" @change.debounce.500ms="updateLink()">
        </div>

        <div class="slc-relative slc-flex slc-items-start slc-mb-2">
            <div class="slc-flex slc-h-6 slc-items-center">
                <input :id="`newTab-${link.id}`" :name="`newTab-${link.id}`" type="checkbox" class="slc-m-0 slc-h-4 slc-w-4 slc-rounded slc-border-gray-300 slc-text-indigo-600 focus:slc-ring-indigo-600" x-model="link.targetBlank" @change="toggleTargetBlank()">
            </div>
            
            <div class="slc-ml-2 slc-text-sm slc-leading-6">
                <label :for="`newTab-${link.id}`" class="slc-font-medium slc-text-gray-900">{!! esc_html__('Open in new tab', 'simple-link-checker') !!}</label>
            </div>
        </div>

        <div class="slc-relative slc-flex slc-items-start">
            <div class="slc-flex slc-h-6 slc-items-center">
                <input :id="`noFollow-${link.id}`" :name="`noFollow-${link.id}`" type="checkbox" class="slc-m-0 slc-h-4 slc-w-4 slc-rounded slc-border-gray-300 slc-text-indigo-600 focus:slc-ring-indigo-600" x-model="link.noFollow" @change="toggleNoFollow()">
            </div>

            <div class="slc-ml-2 slc-text-sm slc-leading-6">
                <label :for="`noFollow-${link.id}`" class="slc-font-medium slc-text-gray-900">{!! esc_html__('Mark as noFollow', 'simple-link-checker') !!}</label>
            </div>
        </div>
    </div>
</div>