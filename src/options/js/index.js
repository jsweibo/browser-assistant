const RECOMMENDED_CONFIG = {
  status: true,
  onlyTop: true,
  patterns: ['.*'],
  playbackRates: [1, 1.25, 1.5, 1.75, 2],
};

const configForm = document.querySelector('#config');
const statusInput = document.querySelector('#status');
const onlyTopInput = document.querySelector('#onlyTop');
const patternsInput = document.querySelector('#patterns');
const playbackRatesInput = document.querySelector('#playbackRates');
let needSave = false;

configForm.addEventListener('change', function () {
  needSave = true;
});

configForm.addEventListener('submit', function (event) {
  event.preventDefault();

  let savedConfig = {
    status: statusInput.checked,
    onlyTop: onlyTopInput.checked,
    patterns: [],
    playbackRates: [],
  };

  if (patternsInput.value) {
    // check patterns syntax
    try {
      const patterns = JSON.parse(patternsInput.value);
      if (!Array.isArray(patterns)) {
        notify({
          type: 'error',
          message: 'Invalid Patterns',
        });
        return false;
      } else if (!patterns.length) {
        notify({
          type: 'error',
          message: 'Invalid Patterns',
        });
        return false;
      }
      patternsInput.value = JSON.stringify(patterns, null, 2);
    } catch (error) {
      notify({
        type: 'error',
        message: 'Error Patterns',
      });
      return false;
    }
    // pass check
    savedConfig.patterns = JSON.parse(patternsInput.value);
  }

  if (playbackRatesInput.value) {
    // check playbackRates syntax
    try {
      const playbackRates = JSON.parse(playbackRatesInput.value);
      if (!Array.isArray(playbackRates)) {
        notify({
          type: 'error',
          message: 'Invalid PlaybackRates',
        });
        return false;
      } else if (!playbackRates.length) {
        notify({
          type: 'error',
          message: 'Invalid PlaybackRates',
        });
        return false;
      }
      playbackRatesInput.value = JSON.stringify(playbackRates, null, 2);
    } catch (error) {
      notify({
        type: 'error',
        message: 'Error PlaybackRates',
      });
      return false;
    }
    // pass check
    savedConfig.playbackRates = JSON.parse(playbackRatesInput.value);
  }

  // save options
  chrome.storage.local.set(
    {
      config: savedConfig,
    },
    function () {
      notify({
        type: 'success',
        message: 'Saved',
      });
      needSave = false;
    }
  );
});

document.querySelector('#get-advice').addEventListener('click', function () {
  needSave = true;
  statusInput.checked = RECOMMENDED_CONFIG.status;
  onlyTopInput.checked = RECOMMENDED_CONFIG.onlyTop;
  patternsInput.value = JSON.stringify(RECOMMENDED_CONFIG.patterns, null, 2);
  playbackRatesInput.value = JSON.stringify(
    RECOMMENDED_CONFIG.playbackRates,
    null,
    2
  );
});

window.addEventListener('beforeunload', function (event) {
  if (needSave) {
    event.preventDefault();
    event.returnValue = '';
  }
});

// start
chrome.storage.local.get('config', function (res) {
  if ('config' in res) {
    if (res.config.status) {
      statusInput.checked = res.config.status;
    }
    if (res.config.onlyTop) {
      onlyTopInput.checked = res.config.onlyTop;
    }
    if (res.config.patterns) {
      patternsInput.value = JSON.stringify(res.config.patterns, null, 2);
    }
    if (res.config.playbackRates) {
      playbackRatesInput.value = JSON.stringify(
        res.config.playbackRates,
        null,
        2
      );
    }
  }
});
