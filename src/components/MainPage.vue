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
					<b-form-select
						v-model="selPeriod"
						:options="periodList"
					></b-form-select>
					<div v-if="selPeriod == 'custom'" class="ml-2 mt-1">
						<b-form-group
							label="From">
							<b-form-input type="date" v-model="startDate"></b-form-input>
						</b-form-group>
						<b-form-group
							label="To">
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
						track-by="id"
						label="name"
					></multi-select>
				</b-form-group>
        <b-button variant="outline-primary" @click="searchEvent()">Search Events</b-button>
      </b-card>
      <div class="event-content pl-2">
				<b-card>
					<span class="d-block font-weight-bold mt-2 float-left">{{ searchEventList.length }} Results</span>	
					<b-button class="float-right" variant="primary" @click="showCreateEvent()">Add Event</b-button>
					<b-button class="float-right mr-2" variant="outline-primary" @click="setPrivate()">Set Private</b-button>
					<b-button class="float-right mr-2" variant="outline-primary" @click="setStarred()">Set Starred</b-button>
					<!-- <b-button class="float-right mr-2" variant="outline-info" @click="selectAll()">Select All</b-button> -->
					<b-modal 
						v-model="modalShow"
						title="Event"
						:ok-title=" flagInsert == 'new' ? 'Create Event' : 'Update Event'"
						@ok="saveEvent()"
						>
						<event :eventInfo="eventInfo"></event>
					</b-modal>
				</b-card>
        <a v-for="(event, index) in displayEventList" :key="index" @click="event.isSelected = !event.isSelected">
					<event-item :eventData="event" @showEditEvent="showEditEvent(event)" ></event-item>
        </a>
        <b-card v-if="displayEventList.length == 0">
          <b-card-text>
            Sorry, we have not any events.
          </b-card-text>
        </b-card>
				<div v-if="cntEvent< searchEventList.length" class="text-center my-1">
					<b-button @click="showMore()" variant="info">Load More</b-button>
				</div>
      </div>
		</b-container>
	</div>
</template>
<script>
import moment from 'moment'
import { mapState } from 'vuex'
import EventItem from './EventItem'
import Event from './Event'
import MultiSelect from 'vue-multiselect'
export default {
	name: 'MainPage',
	components: {
		MultiSelect,
		EventItem,
		Event
	},
	computed: {
		...mapState({
			categoryList: state => state.category.data,
			eventList: state => state.event.data,
			countryList: state => state.country.data
		}),
		// displayEventList() {
		// 	return this.searchEventList.slice(0, this.cntEvent)
		// }
	},
	data() {
		return {
			periodList: [
				{
					value: '',
					text: ''
				},
				{
					value: 'today',
					text: "Today"
				},
				{ 
					value: 'tomorrow',
					text: 'Tomorrow'
				},
				{
					value: 'three_day',
					text: 'Next 3 days'
				},
				{
					value: 'one_week',
					text: 'Next week'
				},
				{
					value: 'one_month',
					text: 'Next month'
				},
				{ 
					value: 'six_month',
					text: 'Next 6 months'
				},
				{
					value: 'year',
					text: 'Next 12 months'
				},
				{
					value: 'custom',
					text: 'Custom'
				}
			],
			selCategory: [],
			selPeriod: '',
			startDate: '',
			endDate: '',
			searchEventList: [],
			searchText:'',
			modalShow: false,
			eventInfo: {},
			flagInsert: 'new',
			cntEvent: 10,
			displayEventList: [],
			isSelected: false
		}
	},
	created() {
		this.$store.dispatch('getCategoryData')
		this.$store.dispatch('getEventData')
		this.$store.dispatch('getCountryData')
	},
	methods: {
		searchEvent() {
			let vm = this
			let sDate = moment().startOf('day')
			let eDate = moment().endOf('day')
			switch (this.selPeriod) {
				case 'today':
					break
				case 'tomorrow':
					eDate.add(1, 'days')
					break
				case 'three_day':
					eDate.add(3, 'days')
					break
				case 'one_week':
					eDate = moment().add(7, 'days').endOf('week')
					break
				case 'one_month':
					eDate =  moment().add(1,'months').endOf('month')
					break
				case 'six_month':
					eDate =  moment().add(6,'months').endOf('month')
					break
				case 'year':
					eDate =  moment().add(12,'months').endOf('month')
					break
				case 'custom':
					sDate = moment(this.startDate).startOf('day')
					eDate = moment(this.endDate).endOf('day')
					break
			}
			sDate = sDate.valueOf()
			eDate = eDate.valueOf()
			vm.searchEventList = []
			vm.eventList.forEach((item) => {
				
				if (vm.searchText){
					if (item.Summary.search(vm.searchText) ===-1 && item.Description.search(vm.searchText) === -1) return
				}
				if (vm.selPeriod) {
					if (item.FromDate > eDate || item.ToDate < sDate) return
				}
				if(vm.selCategory.length > 0){
					let flagFind = false
					vm.selCategory.every( (cat) => {
						if (item.Categories.includes(cat.name)) {
							flagFind = true
							return false
						}
						return true
					})
					if (!flagFind) return
				}
				item['isSelected'] = false
				vm.searchEventList.push(item)
			})
			vm.displayEventList = vm.searchEventList.slice(0, vm.cntEvent)
		},
		saveEvent() {
			let vm = this
			vm.eventInfo.Country = vm.eventInfo.Country.name
			let new_cat = []
			vm.eventInfo.Categories.forEach( (item) => {
				new_cat.push(item.name)
			})
			vm.eventInfo.Categories = new_cat

			vm.eventInfo.FromDate = moment(vm.eventInfo.FromDate + " " + vm.eventInfo.FromTime).valueOf()
			vm.eventInfo.ToDate = moment(vm.eventInfo.ToDate + " " + vm.eventInfo.ToTime).valueOf()

			if (vm.flagInsert == 'new'){
				vm.eventInfoIsNew = true
				vm.eventInfo.ItemId = Math.floor((Math.random() * 10000000) + 1);
				vm.eventList.push( vm.eventInfo)
			} else {
				vm.eventInfo.IsNew = false
				vm.eventInfo.IsUpdated =true
				let curIndex = -1 
				vm.eventList.every( (item, index) => {
					if (item.ItemId === vm.eventInfo.ItemId) {
						curIndex = index
						return false
					}
					return true;
				})
				if (curIndex !== -1) {
					vm.eventList[curIndex] = vm.eventInfo
				}
			}
			this.searchEvent()
		},
		showCreateEvent() {
			this.initEvent()
			this.flagInsert = "new"
			this.modalShow = true
		},
		showEditEvent(curEvent) {
			console.log(curEvent)
			this.eventInfo = {...curEvent}
			this.flagInsert = "update"
			this.modalShow = true
		},
		initEvent() {
			this.eventInfo = {
				ItemId: 0,
				Summary: '',
				Description: '',
				FromDate: '',
				ToDate: '',
				FromTime: '',
				ToTime: '',
				Country: '',
				Venue: '',
				Categories: [],
				IsHeadline: false,
				IsTopStory: false,
				IsNew: false,
				IsUpdated: false,
				IsProvisionalDate: false,
				IsDeleted: false,
				PrivateEvent: false,
				StarredEvent: false
			}
		},
		showMore() {
			this.cntEvent +=10
			this.displayEventList = this.searchEventList.slice(0, this.cntEvent)
		},
		setPrivate() {
			this.displayEventList.filter( item => item.isSelected ).forEach( (item) => {
				item.PrivateEvent = true
			})
		},
		setStarred() {
			this.displayEventList.filter( item => item.isSelected ).forEach( (item) => {
				item.StarredEvent = true
			})
		},
		selectAll() {
			this.displayEventList.forEach( (item) => {
				item.isSelected = true
			})
		}
	}
}
</script>