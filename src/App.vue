<template>
  <div id="app">
    <h1>Gallery</h1>
    <div v-if="!errorCount" class="upload-section" v-cloak @drop.prevent="onFileUpload" @dragover.prevent>
      <p class="text-center">Перетащите сюда изображения</p>
      <img class="upload-section__badge" src="@/assets/img/upload.jpg" alt="Загрузить">
      <div>
        <div class="file-upload">
          <label class="file-upload__label">
            <div class="btn">или выберите изображения / json-файл</div>
            <input class="file-upload__input" ref="fileupload" multiple type="file" @change="onFileUpload($event)" />
          </label>
        </div>
        <div class="url-upload">
          <input class="url-upload__input" v-model="url" type="url" placeholder="Введите url картинки">
          <button class="btn" @click="fetchURL(url)">Загрузить по url</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="error">
        <p class="error__text">Количество ошибок: {{errorCount}}</p>
        <p class="error__text">Файлы с ошибками не были загружены</p>
        <button class="btn" @click="errorCount = 0">Окей</button>
      </div>
    </div>
    <button v-if="images.length > 0" class="btn upload-section__toggle-delete" @click="toggleDeleteIcon()"><span><span
          v-if="show">Спрятать</span><span v-else>Показать</span> значки "удалить"</span></button>
    <div class="gallery" v-if="images.length > 0">
      <div class="gallery__spinner" v-if="spinner"><img src="@/assets/img/loading-buffering.gif"></div>
      <cardimage v-for="imgObj in images" :key="imgObj.id" :show="show" :spinner="spinner" :imgObj="imgObj"
        @deleteImage="deleteImage(imgObj)">
      </cardimage>
    </div>
  </div>
</template>

<script>
  import cardimage from '@/components/cardimage.vue'
  import {
    uniqueID,
  } from "@/assets/js/util.js";

  export default {
    components: {
      cardimage
    },
    data() {
      return {
        images: [],
        spinner: false,
        url: "",
        isValid: false,
        imgRegex: /(https?:\/\/.*\.(?:png|jpg|apng|avif|gif|jpeg|jfif|pjpeg|pjp|png|svg|webp))/i,
        show: true,
        errorCount: 0,
      }
    },
    methods: {
      async addFileToArray(url, width, height) {
        this.images.unshift({
          url: url,
          id: new uniqueID(),
          width: width,
          height: height
        })
      },
      async fetchURL(url) {
        if (this.imgRegex.test(url)) {
          try {
            this.spinner = true
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], url, {
              type: blob.type
            });
            if (this.checkFile(file.type)) {
              const img = new Image();
              const scope = this
              img.src = url
              img.onload = function () {
                scope.addFileToArray(img.src, this.width, this.height)
              };

            }
          } catch (err) {
            this.errorCount++
          }
          this.url = ""
          this.spinner = false
        } else {
          this.errorCount++
        }

      },
      async fetchJSON(image) {
        if (this.imgRegex.test(image.url)) {
          this.spinner = true
          try {
            const response = await fetch(image.url)
            const blob = await response.blob()
            const file = new File([blob], image.url, {
              type: blob.type
            });
            if (this.checkFile(file.type)) {
              const url = URL.createObjectURL(file)
              this.addFileToArray(url, image.width, image.height)
            }
          } catch (err) {
            this.errorCount++
          }
          this.spinner = false
        } else {
          this.errorCount++
        }
      },
      toggleDeleteIcon() {
        this.show = !this.show
      },
      checkFile(type) {
        switch (type) {
          case 'image/jpeg':
          case 'image/png':
          case 'image/apng':
          case 'image/avif':
          case 'image/gif':
          case 'image/svg+xml':
          case 'image/webp':
            return true
          default:
            this.errorCount++
            return false
        }
      },
      deleteImage(imgObj) {
        this.images = this.images.filter(image => image.id !== imgObj.id)
      },
      uniqueID() {
        return '_' + Math.random().toString(36).substr(2, 9);
      },
      async onFileUpload(e) {
        let scope = this
        let files = e.target.files || e.dataTransfer.files;
        let reader = new FileReader();
        if (!files.length) return;
        for (const file of files) {
          if (this.checkFile(file.type)) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            const scope = this
            reader.onload = (file) => {
              var image = new Image();
              image.src = file.target.result;
              image.onload = function () {
                scope.addFileToArray(image.src, this.width, this.height)
              };
            }
            reader.onerror = function () {
              this.errorCount++
            }
          } else if (file.type === 'application/json') {
            console.log('json!')
            reader.onload = async function (e) {
              let jsonObj = JSON.parse(e.target.result)
              for (const image of jsonObj.galleryImages) {
                scope.fetchJSON(image, file)
              }
            }
            reader.readAsText(file)
            this.$refs.fileupload.value = null;
          }
        }

      }
    }
  }
</script>
<style lang="scss">
  :root {
    --color-primary: #01b0f1;
  }

  .gallery {
    display: flex;
    flex-wrap: wrap;
    max-width: 860px;
    margin-top: 10px;
    min-width: 320px
  }

  .gallery::after {
    content: '';
    flex-grow: 999999999;
  }

  .upload-section {
    max-width: 80%;
    padding: 10px;
    background-color: #fff;
    color: var(--color-primary);
    text-transform: uppercase;
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    border: 1px dashed var(--color-primary);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;


    &__toggle-delete {
      margin: 5px auto;
    }
  }

  .btn {
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: transparent;
    border: 2px solid var(--color-primary);
    border-radius: 0.6em;
    color: var(--color-primary);
    cursor: pointer;
    align-self: center;
    line-height: 1;
    padding: 0.8em 2.2em;
    text-decoration: none;
    text-align: center;
    text-transform: uppercase;
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
  }

  .btn:hover {
    box-shadow: 0 0 40px 40px var(--color-primary) inset;
    color: #fff;
  }

  .error__text {
    font-family: "Montserrat", sans-serif;
    color: var(--color-primary);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
    margin-bottom: 10px;
  }


  .url-upload {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 80%;
    margin: auto;

    &__input {
      border: 2px solid var(--color-primary);
      border-radius: 0.6em;
      padding: 0.8em 2.2em;
      font-family: "Montserrat", sans-serif;
      color: var(--color-primary);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 12px;

      &::placeholder {
        font-family: "Montserrat", sans-serif;
        color: var(--color-primary);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 12px;
      }
    }

    &>* {
      margin-top: 5px;
    }
  }

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hide {
    display: none;
  }

  .upload-section__badge {
    width: 600px;
    max-width: 90%;
    display: block;
  }


  .file-upload {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    &__input {
      display: none;
    }

  }

  .error {
    display: flex;
    flex-direction: column;
  }

  .text-center {
    text-align: center;
  }
</style>