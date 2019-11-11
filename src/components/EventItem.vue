<template>
  <b-card no-body class="item-card mb-1">
    <b-card-body>
      <b-card-title>
        <span v-if="eventData.summary">{{ eventData.summary }}</span>
        <span v-else>{{ eventData.description }}</span>
        <b-link class="edit-link ml-2" v-if="eventData.starredEvent">
          <font-awesome-icon :icon="['fas','star']" />
        </b-link>
        <b-link class="edit-link ml-2" v-if="eventData.privateEvent">
          <font-awesome-icon :icon="['fas','lock']" />
        </b-link>
        <b-link class="edit-link float-right" @click="$emit('showEditEvent')">
          <font-awesome-icon icon="pencil-alt" />
        </b-link>
        <b-link class="edit-link float-right" @click="eventData.isSelected = !eventData.isSelected, $emit('changeSelected')">
          <font-awesome-icon
            :icon=" eventData.isSelected ?  ['far','check-square'] : ['far','square']"
          />
        </b-link>
      </b-card-title>
      <div class="tags mb-2">
        <b-badge variant="primary" v-if="eventData.isHeadline">Headline</b-badge>
        <b-badge variant="secondary" v-if="eventData.isTopStory">Top Story</b-badge>
        <b-badge variant="info" v-if="eventData.isNew">New</b-badge>
        <b-badge variant="success" v-if="eventData.isUpdated">Updated</b-badge>
        <b-badge variant="warning" v-if="eventData.isProvisional">Provisional</b-badge>
      </div>
      <b-card-text v-if="viewMode==2" class="fix-desc">{{ eventData.description }}</b-card-text>
      <b-card-text>
        <font-awesome-icon icon="clock" class="mr-2" />
        {{ eventData.startDate | msFormatDateTime }}
        <span
          v-if="eventData.startDate!=eventData.endDate"
        >- {{ eventData.endDate | msFormatDateTime }}</span>
      </b-card-text>
      <b-card-text v-if="viewMode==2">
        <font-awesome-icon
          icon="map-marker-alt"
          class="mr-2"
          :class="eventData.location ? 'text-primary' : ''"
          @click="$emit('showGoogleMap')"
        />
        {{ eventData.venue }} {{ eventData.countryName }}
      </b-card-text>
      <b-card-text v-if="viewMode==2">
        <font-awesome-icon icon="tags" class="mr-2" />
        <span v-for="(cat,index) in eventData.categories" :key="index">
          <span v-if="index>0">,</span>
          {{ cat.categoryName }}
        </span>
      </b-card-text>
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
    };
  }
};
</script>