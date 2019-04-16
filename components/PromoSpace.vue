<template>
  <section
    class="promo p-4"
    :class="variant"
  >
    <b-container class="mx-auto my-1">
      <div
        :id="divId"
        class="gpt-ad-unit"
        :style="style"/>
    </b-container>
  </section>
</template>
<script>
import GptAds from "~/plugins/gpt-ads";

export default {
  name: "AdUnit",
  data() {
    return {
      adSlot: null,
      mapping: [],
      currentSizeMappingIndex: null,
      windowResizeListenerDebounce: null,
      ghostMode: false,
      adUnit: this.whichPromoSpace(),
      size: this.mySize() || [[728, 90], [300, 250], [180, 150]],
      sizeMapping: this.mySize() || [
        [[1024, 0], [728, 90]],
        [[375, 0], [300, 250]],
        [[0, 0], [180, 150]]
      ],
      slots: [],
      responsive: true,
      individualRefresh: true
    };
  },
  props: {
    variant: {
      type: String,
      default: "dark"
    },
    dimensions: {
      type: String,
      default: ""
    }
  },
  computed: {
    networkCode() {
      const gptAds = GptAds.gatherMeData().gptAdsOptions;
      return gptAds ? gptAds.networkCode : null;
    },
    adUnitPath() {
      const networkCode = GptAds.gatherMeData().gptAdsOptions.networkCode;
      return `/${networkCode}/${this.whichPromoSpace()}`;
    },
    divId() {
      const id = this.whichPromoSpace();
      return `div-gpt-ad-${id}-0`;
    },
    formattedSize() {
      return this.formatSizeList(GptAds.gatherMeData().gptAdsOptions.size);
    },
    style() {
      if (this.ghostMode) {
        const { formattedSize, currentSizeMappingIndex, mapping } = this;
        let baseSize = formattedSize;
        if (currentSizeMappingIndex !== null) {
          baseSize = mapping[currentSizeMappingIndex][1];
        }
        const size = Array.isArray(baseSize[0])
          ? baseSize[0]
          : [baseSize[0], baseSize[1]];
        const [width, height] = size;
        return {
          margin: "0 auto",
          width: `${width}px`,
          height: `${height}px`,
          border: "1px solid black"
        };
      }
      return null;
    }
  },
  methods: {
    mySize() {
      if (this.dimensions === "square") {
        return [
          [[1024, 0], [300, 250]],
          [[375, 0], [300, 250]],
          [[0, 0], [300, 250]]
        ];
      } else {
        return null;
      }
    },
    /*
     * Formats a given size to make it compatible with GPT
     *   If size is an Array, it is returned as is
     *   If size is a string, it is formatted so that 123x456 becomes [123, 456]
     *
     * @param {Array,string} size The size
     * @return {Array} Formatted size
     */
    formatSize(size) {
      if (Array.isArray(size)) {
        return size;
      }
      if (typeof size === "string") {
        return size.split("x").map(value => parseInt(value, 10));
      }
      return [];
    },
    /*
     * Formats a given list of sizes to make it compatible with GPT API
     * If sizesList is an Array, it is returned as is
     * If sizesList is a string, it is formatted so that
     * 123x456,654x321 becomes [[123, 456], [654, 321]]
     *
     * @param      {Array,string}  sizesList  The sizes
     * @return     {Array} Formatted sizes list
     */
    formatSizeList(sizesList) {
      if (Array.isArray(sizesList)) {
        return sizesList;
      }
      if (typeof sizesList === "string") {
        return sizesList.split(",").map(size => this.formatSize(size));
      }
      return [];
    },
    /**
     * Refresh ad slot
     */
    refreshSlot() {
      googletag.pubads().refresh([this.adSlot]);
    },
    /**
     * Window resize event listener
     * Attached only when responsive mode is enabled, it checks wether a different size
     * mapping can be activated after resize and forces the slot to be refreshed if it"s
     * the case
     */
    handleWindowResize() {
      const { windowResizeDebounce } = this;
      clearTimeout(this.windowResizeListenerDebounce);
      this.windowResizeListenerDebounce = setTimeout(() => {
        const currentSizeMappingIndex = this.getCurrentSizeMappingIndex();
        if (currentSizeMappingIndex !== this.currentSizeMappingIndex) {
          if (!this.ghostMode) {
            this.refreshSlot();
          }
          this.currentSizeMappingIndex = currentSizeMappingIndex;
        }
      }, windowResizeDebounce);
    },
    /**
     * Gets the current size mapping index
     *
     * @return     {Number}  The current size mapping index
     */
    getCurrentSizeMappingIndex() {
      const mapping = this.mapping || [];
      let index = null;
      mapping.some((size, i) => {
        const [browserSize] = size;
        const [width, height] = browserSize;
        const mediaQuery = `(min-width: ${width}px) and (min-height: ${height}px)`;
        if (window.matchMedia(mediaQuery).matches) {
          index = i;
          return true;
        }
        return false;
      });
      return index;
    },
    whichPromoSpace() {
      let adunit = "";
      if (this.variant == "dark") {
        adunit = "dfp-ad-aap_desktop_leaderboard_ad_large";
      } else if (this.variant === "fpoet") {
        adunit = "AAP-Desktop-Homepage-MedRectangle-AD";
      } else {
        adunit = "AAP-Mobile-TeachersPage-Bottom-AD";
      }

      return adunit;
    }
  },
  mounted() {
    if (!googletag) {
      return;
    }
    const {
      // ghostMode,
      adUnitPath,
      divId,
      sizeMapping,
      isResponsive,
      collapseEmptyDiv
    } = this;
    // https://support.google.com/admanager/answer/183282
    googletag.pubads().enableSingleRequest();

    // Init Ad slot
    googletag.cmd.push(() => {
      const adSlot = googletag
        .defineSlot(adUnitPath, this.formattedSize, divId)
        .addService(googletag.pubads());

      // Collapse empty div slot-level override
      if (collapseEmptyDiv !== null) {
        adSlot.setCollapseEmptyDiv(collapseEmptyDiv);
      }

      // Build size mapping if any
      if (sizeMapping.length > 0) {
        const mapping = googletag.sizeMapping();
        sizeMapping.forEach(size => {
          const browserSize = this.formatSize(size[0]);
          const adSizes = this.formatSizeList(size[1]);
          mapping.addSize(browserSize, adSizes);
          this.mapping.push([browserSize, adSizes]);
        });
        adSlot.defineSizeMapping(mapping.build());
      }

      // Init responsive behavior
      if (this.sizeMapping.length > 0 && isResponsive) {
        const currentSizeMappingIndex = this.getCurrentSizeMappingIndex();
        this.currentSizeMappingIndex = currentSizeMappingIndex;
        window.addEventListener("resize", this.handleWindowResize);
      }

      this.adSlot = adSlot;
      this.slots.push(adSlot);

      if (!this.ghostMode) {
        googletag.display(divId);
        if (this.individualRefresh) {
          this.refreshSlot();
        }
      }
    });
  },
  beforeDestroy() {
    if (!googletag) {
      return;
    }
    // Destroy ad slot
    googletag.cmd.push(() => {
      // const destroyed = googletag.destroySlots([this.adSlot]);
    });
    // Remove window resize listener
    window.removeEventListener("resize", this.handleWindowResize);
  },
  render(h) {
    const { divId, style } = this;

    return h("div", {
      style,
      attrs: {
        id: divId
      },
      domProps: { innerHTML: "" }
    });
  }
};
</script>
<style lang="scss" scoped>
.promo.dark {
  background-color: var(--black);
}
.promo.transparent {
  background-color: transparent;
}
.gpt-ad-unit {
  text-align: center;
}
@include media-breakpoint-down(md) {
  .promo.dark,
  .promo.transparent {
    display: none;
  }
}
</style>
