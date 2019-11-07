<template>
  <div>
    <b-navbar type="light" variant="light">
      <b-navbar-brand href="#">Event Management</b-navbar-brand>
    </b-navbar>
    <b-container fluid>
      <b-card class="side-bar float-left" bg-variant="light">
        <b-form-group>
          <b-form-input type="search" placeholder="Search" v-model="searchText"></b-form-input>
        </b-form-group>
        <b-form-group>
          <multi-select
            v-model="selPeriod"
            :options="periodList"
            :show-labels="false"
            placeholder="Select Period"
            track-by="value"
            label="text"
          ></multi-select>
          <div v-if="selPeriod.value == 'custom'" class="ml-2 mt-1">
            <b-form-group label="From">
              <b-form-input type="date" v-model="startDate"></b-form-input>
            </b-form-group>
            <b-form-group label="To">
              <b-form-input type="date" v-model="endDate"></b-form-input>
            </b-form-group>
          </div>
        </b-form-group>
        <b-form-group>
          <multi-select
            v-model="selCategory"
            :options="categoryList"
            :searchable="true"
            :allow-empty="true"
            :show-labels="false"
            :multiple="true"
            placeholder="Select Category"
            track-by="categoryId"
            label="categoryName"
          ></multi-select>
        </b-form-group>
        <b-button variant="outline-primary" @click="searchEvent()">Search Events</b-button>
      </b-card>
      <div class="event-content pl-2">
        <b-card class="mb-2">
          <span
            class="d-block font-weight-bold mt-2 float-left"
          >{{ searchEventList.length }} Results</span>
          <b-button class="float-right" variant="primary" @click="showCreateEvent()">Add Event</b-button>
          <b-button
            class="float-right mr-2"
            variant="outline-primary"
            @click="setSelPrivate()"
          >Set Private</b-button>
          <b-button
            class="float-right mr-2"
            variant="outline-primary"
            @click="setSelStarred()"
          >Set Starred</b-button>
          <b-link class="edit-link float-right mr-2" @click="selectAll">
            <font-awesome-icon :icon=" isAllSelected ?  ['far','check-square'] : ['far','square']" />
          </b-link>

          <div class="float-right">
            <b>View</b>
            <b-link
              class="view-link m-2"
              :class="statusView == 2 ? 'active' : ''"
              @click="statusView = 2"
            >
              <font-awesome-icon icon="align-justify" />
            </b-link>
            <b-link
              class="view-link mr-5"
              :class="statusView == 1 ? 'active' : ''"
              @click="statusView = 1"
            >
              <font-awesome-icon icon="equals" />
            </b-link>
          </div>
          <b-modal
            v-model="modalShow"
            title="Event"
            :ok-title=" flagInsert == 'new' ? 'Create Event' : 'Update Event'"
            @ok="saveEvent()"
          >
            <event-form :eventInfo="eventInfo"></event-form>
          </b-modal>
        </b-card>
        <div v-if="isLoading" class="text-center mt-5">
          <div class="spinner-grow text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="spinner-grow text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="spinner-grow text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else>
          <a v-for="(event, index) in displayEventList" :key="index">
            <event-item
              :eventData="event"
              @showEditEvent="showEditEvent(event)"
              @showGoogleMap="showGoogleMap(event)"
              :viewMode="statusView"
            ></event-item>
          </a>
          <b-card v-if="displayEventList.length == 0">
            <b-card-text>Sorry, we have not any events.</b-card-text>
          </b-card>
          <div v-if="cntEvent< searchEventList.length" class="text-center my-1">
            <b-button @click="showMore()" variant="info">Load More</b-button>
          </div>
        </div>
      </div>
    </b-container>
    <b-modal ref="map-modal" hide-footer title="Google Map" size="x1">
      <div class="d-block text-center">
        <GmapMap
          :center="location"
          :zoom="15"
          map-type-id="terrain"
          style="width: 100%; height:700px;"
        >
          <GmapMarker :position="location" />
        </GmapMap>
      </div>
    </b-modal>
  </div>
</template>
<script>
import moment from "moment";
import { mapState } from "vuex";
import EventItem from "./EventItem";
import EventForm from "./EventForm";
import MultiSelect from "vue-multiselect";

export default {
  name: "MainPage",
  components: {
    MultiSelect,
    EventItem,
    EventForm
  },
  computed: {
    ...mapState({
      categoryList: state => state.category.data,
      eventList: state => state.event.data,
      countryList: state => state.country.data,
      isLoading: state => state.event.isLoading
    })
  },
  data() {
    return {
      periodList: [
        {
          value: "",
          text: ""
        },
        {
          value: "today",
          text: "Today"
        },
        {
          value: "tomorrow",
          text: "Tomorrow"
        },
        {
          value: "three_day",
          text: "Next 3 days"
        },
        {
          value: "one_week",
          text: "Next week"
        },
        {
          value: "one_month",
          text: "Next month"
        },
        {
          value: "six_month",
          text: "Next 6 months"
        },
        {
          value: "year",
          text: "Next 12 months"
        },
        {
          value: "custom",
          text: "Custom"
        }
      ],
      selCategory: [],
      selPeriod: "",
      startDate: "",
      endDate: "",
      searchEventList: [],
      searchText: "",
      modalShow: false,
      eventInfo: {},
      flagInsert: "new",
      cntEvent: 10,
      stepCnt: 10,
      displayEventList: [],
      isAllSelected: false,
      statusStarred: false,
      statusPrivate: false,
      statusView: 2,
      location: {}
    };
  },
  created() {
    this.$store.dispatch("getCategoryData");
    this.$store.dispatch("getEventData");
    this.$store.dispatch("getCountryData");
  },
  watch: {
    isLoading: function() {
      if (!this.isLoading) {
        this.searchEvent();
      }
    }
  },
  methods: {
    searchEvent() {
      let vm = this;
      let sDate = moment().startOf("day");
      let eDate = moment().endOf("day");
      switch (this.selPeriod.value) {
        case "today":
          break;
        case "tomorrow":
          eDate.add(1, "days");
          break;
        case "three_day":
          eDate.add(3, "days");
          break;
        case "one_week":
          eDate = moment()
            .add(7, "days")
            .endOf("week");
          break;
        case "one_month":
          eDate = moment()
            .add(1, "months")
            .endOf("month");
          break;
        case "six_month":
          eDate = moment()
            .add(6, "months")
            .endOf("month");
          break;
        case "year":
          eDate = moment()
            .add(12, "months")
            .endOf("month");
          break;
        case "custom":
          sDate = moment(this.startDate).startOf("day");
          eDate = moment(this.endDate).endOf("day");
          break;
      }
      sDate = sDate.format("YYYY-MM-DDT00:00:00");
      eDate = eDate.format("YYYY-MM-DDT23:59:59");

      vm.searchEventList = [];
      vm.eventList.forEach(item => {
        if (vm.searchText) {
          if (
            item.summary.search(vm.searchText) === -1 &&
            item.description.search(vm.searchText) === -1
          )
            return;
        }
        if (vm.selPeriod.value) {
          if (item.startDate > eDate || item.endDate < sDate) return;
        }
        if (vm.selCategory.length > 0) {
          let flagFind = false;
          vm.selCategory.every(cat => {
            item.categories.every(real_cat => {
              if (cat.categoryId == real_cat.categoryId) {
                flagFind = true;
                return false;
              }
            });
            if (flagFind) {
              return false;
            }
            return true;
          });
          if (!flagFind) return;
        }
        // item['isSelected'] = false
        if (!item.starredEvent) item.starredEvent = false;
        if (!item.privateEvent) item.privateEvent = false;
        vm.searchEventList.push(item);
      });
      vm.displayEventList = vm.searchEventList.slice(0, vm.cntEvent);
    },
    saveEvent() {
      let vm = this;
      vm.eventInfo.startDate = moment(
        vm.eventInfo.startDate + " " + vm.eventInfo.startTime
      ).format("YYYY-MM-DDTHH:mm:ss");
      vm.eventInfo.endDate = moment(
        vm.eventInfo.endDate + " " + vm.eventInfo.endTime
      ).format("YYYY-MM-DDTHH:mm:ss");

      if (vm.flagInsert == "new") {
        vm.eventInfo.isNew = true;
        vm.eventInfo.isUpdated = false;
        vm.eventInfo.itemId = Math.floor(Math.random() * 10000000 + 1);
        vm.eventList.push(vm.eventInfo);
      } else {
        vm.eventInfo.isNew = false;
        vm.eventInfo.isUpdated = true;
        let curIndex = -1;
        vm.eventList.every((item, index) => {
          if (item.itemId === vm.eventInfo.itemId) {
            curIndex = index;
            return false;
          }
          return true;
        });
        if (curIndex !== -1) {
          vm.eventList[curIndex] = vm.eventInfo;
        }
      }
      this.searchEvent();
    },
    showCreateEvent() {
      this.initEvent();
      this.flagInsert = "new";
      this.modalShow = true;
    },
    showEditEvent(curEvent) {
      this.eventInfo = { ...curEvent };
      this.flagInsert = "update";
      this.modalShow = true;
    },
    initEvent() {
      this.eventInfo = {
        itemId: 0,
        summary: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        countryName: "",
        venue: "",
        categories: [],
        isHeadline: false,
        isTopStory: false,
        isProvisional: false,
        isNew: false,
        isUpdated: false,

        isDeleted: false,
        isSelected: false,
        privateEvent: false,
        starredEvent: false
      };
    },
    showMore() {
      this.cntEvent += this.stepCnt;
      this.displayEventList = this.searchEventList.slice(0, this.cntEvent);
    },
    setSelPrivate() {
      let vm = this;
      vm.statusPrivate = !vm.statusPrivate;
      this.displayEventList
        .filter(item => item.isSelected)
        .forEach(item => {
          item.privateEvent = vm.statusPrivate;
        });
    },
    setSelStarred() {
      let vm = this;
      vm.statusStarred = !vm.statusStarred;
      this.displayEventList
        .filter(item => item.isSelected)
        .forEach(item => {
          item.starredEvent = vm.statusStarred;
        });
    },
    selectAll() {
      let vm = this;
      vm.isAllSelected = !vm.isAllSelected;
      this.displayEventList.forEach(item => {
        item.isSelected = vm.isAllSelected;
      });
      vm.displayEventList = vm.searchEventList.slice(0, vm.cntEvent);
    },
    showGoogleMap(curEvent) {
      if (curEvent.location) {
        this.location = curEvent.location;
        this.$refs["map-modal"].show();
      }
    }
  }
};
</script>