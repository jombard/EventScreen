<template>
  <b-card
    no-body
    class="item-card">
    <b-card-body>
      <b-card-title>
        <span>{{ eventData.summary }}</span>
        <b-link class="edit-link ml-2" v-if="eventData.starredEvent">
          <font-awesome-icon :icon="['fas','heart']" />
        </b-link>
        <b-link class="edit-link ml-2" v-if="eventData.privateEvent">
          <font-awesome-icon :icon="['fas','lock']" />
        </b-link>
        <b-link class="edit-link float-right" @click="$emit('showEditEvent')">
          <font-awesome-icon icon="pencil-alt" />
        </b-link>
        <b-link class="edit-link float-right" @click="eventData.isSelected = !eventData.isSelected">
          <font-awesome-icon :icon=" eventData.isSelected ?  ['far','check-square'] : ['far','square']" />
      </b-link>
      </b-card-title>
      <b-card-text v-if="viewMode==2" class="fix-desc">{{ eventData.description }}</b-card-text>
      <b-card-text class="mb-1">
        <font-awesome-icon icon="map-marker-alt" class="mr-2" :class="eventData.location ? 'text-primary' : ''" @click="$emit('showGoogleMap')"/>
        {{ eventData.venue }} {{ eventData.countryName }}
        <font-awesome-icon icon="clock" class="ml-5 mr-2" />
        {{ eventData.startDate | msFormatDateTime }}
        <span v-if="eventData.startDate!=eventData.endDate"> - {{ eventData.endDate | msFormatDateTime }}</span>
      </b-card-text>
      <b-card-text v-if="viewMode==2">
        <font-awesome-icon icon="tags" class="mr-2" />
        <span v-for="(cat,index) in eventData.categories" :key="index">
          <span v-if="index>0">, </span>
          {{ cat.categoryName }}
        </span>
      </b-card-text>
      <ul class="tags" v-if="viewMode==2">
        <li v-if="eventData.isProvisional" class="tag-provisional">Provisional</li>
        <li v-if="eventData.isNew" class="tag-new">New</li>
        <li v-if="eventData.isUpdated" class="tag-updated">Updated</li>
        <li v-if="eventData.isHeadline" class="tag-headline">HeadLine</li>
        <li v-if="eventData.isTopStory" class="tag-topstory">TopStory</li>
      </ul>
      
    </b-card-body>
  </b-card>
</template>
<script>
export default {
  props: {
    eventData: Object,
    viewMode: Number
  },
  data() {
    return {
      // isActive: this.eventData.isSelected
      // isSelected: this.eventData.isSelected,
      // starredEvent: this.eventData.starredEvent,
      // privateEvent: this.eventData.privateEvent
    }
  },
};
</script>