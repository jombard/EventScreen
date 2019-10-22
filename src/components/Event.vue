<template>
  <form>
    <b-form-group
      label="Summary"
      label-for="summary-input">
      <b-form-input
        id="summary-input"
        v-model="eventInfo.Summary">
      </b-form-input>
    </b-form-group> 
    <b-form-group
      label="Description"
      label-for="description-input">
      <b-form-textarea
        id="description-input"
        v-model="eventInfo.Description">
      </b-form-textarea>
    </b-form-group>
    <b-form-group
      label="FromDate">
      <b-row>
        <b-col>
          <b-form-input type="date" v-model="eventInfo.FromDate"></b-form-input>
        </b-col>
        <b-col>
          <b-form-input type="time" v-model="eventInfo.FromTime"></b-form-input>
        </b-col>
      </b-row>
    </b-form-group>
    <b-form-group
      label="ToDate">
      <b-row>
        <b-col>
          <b-form-input type="date" v-model="eventInfo.ToDate"></b-form-input>
        </b-col>
        <b-col>
          <b-form-input type="time" v-model="eventInfo.ToTime"></b-form-input>
        </b-col>
      </b-row>
    </b-form-group>
    <b-form-group
      label="Country & Venue">
      <b-row>
        <b-col>
          <multi-select
            v-model="eventInfo.Country"
            :options="countryList"
            :searchable="true"
            :allow-empty="true"
            :show-labels="false"
            track-by="name"
            label="name"
            placeholder="Select Country"
            @input="changeVenueList()"
          ></multi-select>
        </b-col>
        <b-col>
          <multi-select
            v-model="eventInfo.Venue"
            :options="venueList"
            :searchable="true"
            :allow-empty="true"
            :show-labels="false"
            placeholder="Select Venue"
          ></multi-select>
        </b-col>
      </b-row>
    </b-form-group>
    <b-form-group>
      <multi-select
        v-model="eventInfo.Categories"
        :options="categoryList"
        :searchable="true"
        :allow-empty="true"
        :show-labels="false"
        :multiple="true"
        placeholder="Select Category"
        track-by="id"
        label="name"
      ></multi-select>
    </b-form-group>
    <b-form-group>
      <b-form-checkbox
        v-model="eventInfo.IsHeadline"
        inline>
        HeadLine
      </b-form-checkbox>
      <b-form-checkbox
        v-model="eventInfo.IsTopStory"
        inline>
        TopStory
      </b-form-checkbox>
      <b-form-checkbox
        v-model="eventInfo.IsProvisionalDate"
        inline>
        Provisional
      </b-form-checkbox>
    </b-form-group>
    <b-form-group>
      <b-form-checkbox
        v-model="eventInfo.PrivateEvent"
        inline>
        Private
      </b-form-checkbox>
      <b-form-checkbox
        v-model="eventInfo.StarredEvent"
        inline>
        Starred
      </b-form-checkbox>
    </b-form-group>
  </form>  
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
import MultiSelect from 'vue-multiselect'
export default {
  props: {
    eventInfo: Object
  },
  components: {
    MultiSelect
  },
  computed: {
		...mapState({
      categoryList: state => state.category.data,
      countryList: state => state.country.data
    })
  },
  data() {
    return {
      venueList: []
    }
  },
  created() {
    this.initEvent()
  },
  methods: {
    changeVenueList() {
      if( this.eventInfo.Country){
        this.venueList = this.eventInfo.Country.venues
      }else{
        this.venueList = []
      }
      this.eventInfo.Venue = ''
    },
    initEvent() {
      let vm= this
      if (vm.eventInfo.FromDate) {
        let fromDate = vm.eventInfo.FromDate
        vm.eventInfo.FromDate = moment(Number(fromDate)).format("YYYY-MM-DD")
        vm.eventInfo.FromTime = moment(Number(fromDate)).format("HH:mm:ss")
      }

      if (vm.eventInfo.ToDate) {
        let toDate = vm.eventInfo.ToDate
        vm.eventInfo.ToDate = moment(Number(toDate)).format("YYYY-MM-DD")
        vm.eventInfo.ToTime = moment(Number(toDate)).format("HH:mm:ss")
      }

      if (vm.eventInfo.Country) {
        vm.eventInfo.Country = vm.countryList.find( item => item.name == vm.eventInfo.Country )
        vm.venueList = vm.eventInfo.Country.venues
      }

      if (this.eventInfo.Categories) {
        let cat_list = []
        vm.eventInfo.Categories.forEach((cat) => {
          cat_list.push( vm.categoryList.find( item => item.name == cat ))
        })
        vm.eventInfo.Categories = cat_list
      }
    }
  }
}
</script>