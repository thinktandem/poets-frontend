export default {
  /*
   * Gather the data needed to query Google Ad Manager for adverts.
   */
  gatherMeData() {
    const gptAdsOptions = {
      debug: false,
      individualRefresh: true,
      collapseEmptyDivs: false,
      size: [[728, 90], [970, 250]],
      networkCode: "307760595",
      GPT_LIB_SCRIPT_ID: "google-publisher-tag-lib-script",
      GPT_INIT_SCRIPT_ID: "google-publisher-tag-init-script",
      slots: [],
      responsive: true,
      ghostMode: false
    };

    // Prepare the GPT init script
    let gptInitScriptHtml =
      "var googletag = googletag || {};googletag.cmd = googletag.cmd || [];";

    // Disable initial load
    const gptDisableInitialLoad = gptAdsOptions.individualRefresh
      ? "googletag.pubads().disableInitialLoad();"
      : "";

    // Collapse empty div
    const gptCollapseEmptyDivs = gptAdsOptions.collapseEmptyDivs
      ? "googletag.pubads().collapseEmptyDivs();"
      : "";
    gptInitScriptHtml += `
      googletag.cmd.push(function(){
        googletag.pubads().enableSingleRequest();
        ${gptDisableInitialLoad}
        ${gptCollapseEmptyDivs}
        googletag.enableServices();
      });
    `;

    const debug = gptAdsOptions.debug;
    if (debug) {
      gptInitScriptHtml +=
        "googletag.cmd.push(function(){googletag.openConsole();});";
    }

    return {
      gptAdsOptions,
      gptInitScript: {
        id: gptAdsOptions.GPT_INIT_SCRIPT_ID,
        innerHTML: gptInitScriptHtml
      }
    };
  }
};
