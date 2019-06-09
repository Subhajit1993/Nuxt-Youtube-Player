<template>
  <v-layout
    row
    wrap
  >
    <v-flex xs12>
      <v-layout row wrap>
        <v-text-field
          solo
          flat
          placeholder="Search For Video"
          append-icon="search"
          @keyup.enter="updateUrlQuery"
          clearable
          dark
          autofocus
          v-model="keyword"
        ></v-text-field>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 md3 v-for="(item,index) in videoList" :key="index" class="video-list-flex">
          <v-card class="list-card" @click="showPlayer(item.id.videoId)">
            <div class="listing-image">
              <img :src=item.snippet.thumbnails.medium.url class="listing-image"/>
            </div>
            <div class="video-title padder">
              {{item.snippet.title}}
            </div>
            <div class="video-channel-title white-text padder">
              {{item.snippet.channelTitle}}
            </div>
            <div class="published-text white-text padder">
              Date : {{((item.snippet.publishedAt).split('T'))[0]}}
            </div>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout style="justify-content: center; margin-top: 20px">
        <v-btn
          :loading="show_loader"
          :disabled="show_loader"
          color="pink"
          @click="loadProducts"
          large
          outline
        >
          Load More products
          <span slot="loader" class="custom-loader">
        <v-icon light>cached</v-icon>
      </span>
        </v-btn>
      </v-layout>
    </v-flex>
    <v-dialog
      v-model="dialog"
      width="640"
      light
      :full-width="$vuetify.breakpoint.smAndDown"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <v-card>
        <v-layout row wrap>
          <div class="modal-btn-wrapper">
            <v-icon size="30" @click="dialog=false">minimize</v-icon>
            <v-icon size="30" @click="stopVideo">close</v-icon>
          </div>
        </v-layout>
        <v-layout row wrap>
          <youtube resize :video-id="videoId" ref="youtube" @playing="onPlaying"></youtube>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

  export default {
    name: 'index',
    components: {},
    computed: {
      player() {
        return this.$refs.youtube.player
      }
    },
    data: () => ({
      dialog: false,
      videoId: '',
      show_loader: false,
      keyword: '',
      nextPageToken: '',
      videoList: [],
      api_key: 'AIzaSyBAekYC1Hu6cHgmGsa5lo3kr9agqyYp3gs'
    }),
    mounted() {
      if (this.$route.query.q) {
        this.keyword = this.$route.query.q;
        this.fireYoutubeSearch(false)
      }
    },
    methods: {
      onPlaying: function () {

      },
      stopVideo:function(){
        this.player.stopVideo();
        this.dialog = false;
      },
      showPlayer: function (videoId) {
        this.videoId = videoId;
        this.dialog = true;
        this.player.playVideo();
      },
      loadProducts: async function () {
        this.show_loader = true;
        await this.fireYoutubeSearch(true)
        this.show_loader = false
      },
      updateUrlQuery: function () {
        if (!this.keyword || !this.keyword.length) {
          this.$router.push({
            name: 'index',
            query: null
          });
        }
        else {
          this.$router.push({
            name: 'index',
            query: {q: this.keyword}
          });
        }
      },
      fireYoutubeSearch: function (shouldAppend) {
        return new Promise((resolve => {
          this.$axios.get('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=' + this.$route.query.q + '&key=' + this.api_key + '&pageToken=' + this.nextPageToken).then(res => {
            this.nextPageToken = res.data.nextPageToken;
            if (!shouldAppend) {
              this.videoList = res.data.items;
            }
            else {
              this.videoList = this.videoList.concat(res.data.items)
            }
            resolve(true)
          }).catch(err => {
            console.error(err)
            resolve(null)
          })
        }))
      }
    },
    watch: {
      '$route'(to, from) {
        if (!this.$route.query.q) {
          this.videoList = []
        }
        else {
          this.fireYoutubeSearch(false)
        }
      }
    }
  }
</script>
<style scoped>
  .video-list-flex {
    padding: 10px;
  }

  .listing-image {
    width: 100%;
  }

  .video-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    font-weight: 600;
  }

  .padder {
    padding: 2px 10px;
  }

  .video-channel-title {

  }

  .published-text {
    font-size: 12px;
    color: #b4b4b4;
  }

  .list-card {
    cursor: pointer;
  }

  .modal-btn-wrapper {
    margin: 5px 10px 5px auto;
  }
</style>
<style>
  @media only screen and (max-width: 958px) {
    .v-breadcrumbs {
      padding: 0 !important;
    }
  }

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
