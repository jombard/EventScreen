<template>
  <b-card
    :title="eventData.summary"
    class="item-card"
    @click="isActive = !isActive"
    :class="{ active : isActive }"
  >
    <b-link class="edit-link" @click="$emit('showEditEvent')">Edit</b-link>
    <b-card-text class="fix-desc">{{ eventData.description }}</b-card-text>
    <b-card-text class="mb-1">
      <font-awesome-icon icon="map-marker-alt" class="mr-2" />
      {{ eventData.venue }} {{ eventData.country }}
      <font-awesome-icon icon="clock" class="ml-5 mr-2" />
      {{ eventData.startDate | msFormatDateTime }} - {{ eventData.endDate | msFormatDateTime }}
    </b-card-text>
    <b-card-text>
      <font-awesome-icon icon="tags" class="mr-2" />
      <!-- {{ eventData.Categories.join(", ") }} -->
    </b-card-text>
    <ul class="tags">
      <li v-if="eventData.isProvisionalDate" class="tag-provisional">Provisional</li>
      <li v-if="eventData.isNew" class="tag-new">New</li>
      <li v-if="eventData.isUpdated" class="tag-updated">Updated</li>
      <li v-if="eventData.isHeadline" class="tag-headline">HeadLine</li>
      <li v-if="eventData.isTopStory" class="tag-topstory">TopStory</li>
    </ul>
  </b-card>
</template>
<script>
export default {
  props: {
    eventData: Object
  },
  data() {
    return {
      isActive: this.eventData.isSelected
    };
  }
};
</script>