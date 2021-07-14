<template>
    <div class="img-card" :style="{width: image.width + 'px', 'flex-grow':image.width}">
        <i class="img-card__padding-icon" :style="{paddingBottom: image.paddingBottom + '%'}"></i>
        <img class="img-card__image" :src="image.url" />
        <a v-show="show" class="img-card__removal" @click="$emit('deleteImage')"> <i
                class="img-card__delete-icon">&#xe802;</i>
        </a>
    </div>
</template>
<script>
    export default {
        props: {
            imgObj: {
                type: Object,
                required: true
            },
            show: {
                type: Boolean,
                required: true
            }

        },
        emits: ['deleteImage'],
        computed: {
            image() {
                const imageProperties = {
                    url: this.imgObj.url,
                    width: this.imgObj.width * 150 / this.imgObj.height,
                    paddingBottom: this.imgObj.height / this.imgObj.width * 100
                }
                return imageProperties
            }
        }
    }
</script>
<style lang="scss">
    .img-card {
        margin: 2px;
        position: relative;

        &__padding-icon {
            display: block;
        }

        &__image {
            position: absolute;
            top: 0;
            width: 100%;
            vertical-align: bottom;

        }

        &__removal {
            position: absolute;
            top: 5px;
            right: 5px;

            &:hover {
                cursor: pointer;
            }

        }

        &__delete-icon {
            font-family: "fontello";
            font-style: normal;
            font-weight: normal;
            display: inline-block;
            text-decoration: inherit;
            width: 1em;
            margin-right: .2em;
            text-align: center;
            font-variant: normal;
            text-transform: none;
            line-height: 1em;
            margin-left: .2em;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-weight: 700;
            font-size: 30px;
            color: #01b0f1;
        }
    }


    @font-face {
        font-family: 'fontello';
        src: url('~@/assets/fonts/fontello.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
</style>