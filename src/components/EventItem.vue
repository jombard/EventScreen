<template>
  <b-card 
    :title=eventData.Summary
    class="item-card"
    @click="isActive = !isActive"
    :class="{ active : isActive }">
    <b-link class="edit-link" @click="$emit('showEditEvent')">Edit</b-link>
    <b-card-text class="fix-desc">
      {{ eventData.Description }}
    </b-card-text>
    <b-card-text class="mb-1">
      <font-awesome-icon icon="map-marker-alt" class="mr-2" /> 
      {{ eventData.Venue }} {{ eventData.Country }}
      <font-awesome-icon icon="clock" class="ml-5 mr-2" /> 
      {{ eventData.FromDate | msFormatDateTime }} - {{ eventData.ToDate | msFormatDateTime }}
    </b-card-text>
    <b-card-text>
      <font-awesome-icon icon="tags" class="mr-2"/>
      {{ eventData.Categories.join(", ") }}
    </b-card-text>
    <ul class="tags">
      <li v-if="eventData.IsProvisionalDate" class="tag-provisional">Provisional</li>
      <li v-if="eventData.IsNew" class="tag-new">New</li>
      <li v-if="eventData.IsUpdated" class="tag-updated">Updated</li>
      <li v-if="eventData.IsHeadline" class="tag-headline">HeadLine</li>
      <li v-if="eventData.IsTopStory" class="tag-topstory">TopStroty</li>
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
    }
  }
}
</script>