let config = null;
let toolbar = null;

function executeScript(details) {
  const temp = document.createElement('script');
  temp.textContent = details.code;
  document.documentElement.insertBefore(
    temp,
    document.documentElement.firstChild
  );
  temp.remove();
}

function editHtml() {
  if (!document.documentElement.isContentEditable) {
    document.documentElement.contentEditable = true;
  } else {
    document.documentElement.contentEditable = false;
  }
}

/**
 * navigation sub-context-menu
 */

function goBack() {
  history.back();
}

function goForward() {
  history.forward();
}

function goTop() {
  document.documentElement.scrollTop = 0;
}

function goBottom() {
  document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

/**
 * reload sub-context-menu
 */

function reloadImg() {
  document.querySelectorAll('img').forEach(function (item) {
    item.src += '';
  });
}

function reloadIFrame() {
  document.querySelectorAll('iframe').forEach(function (item) {
    item.src += '';
  });
}

function reloadHtml() {
  location.reload();
}

/**
 * media sub-context-menu
 */

function switchPlaybackRate(event) {
  const playbackRate = event.target.dataset.playbackRate;

  // retransmit signal
  chrome.runtime.sendMessage({
    action: 'switch-playback-rate',
    playbackRate,
  });
}

function shrinkDeepOne(target) {
  target.parentNode.classList.toggle('hidden');
  target.parentNode.nextElementSibling.classList.toggle('active');
}

function shrinkDeepTwo(target, shadowRoot) {
  target.parentNode.classList.toggle('hidden');
  target.parentNode.previousElementSibling.classList.toggle('active');
  shadowRoot.querySelector('.context-menu > .panel').classList.toggle('hidden');
  shadowRoot
    .querySelector('.context-menu > .menu-item')
    .classList.toggle('active');
}

function resetAllSubContentMenu(shadowRoot) {
  shadowRoot
    .querySelectorAll('.sub-context-menu > .menu-item')
    .forEach(function (item) {
      item.classList.remove('active');
    });
  shadowRoot
    .querySelectorAll('.sub-context-menu .sub-panel')
    .forEach(function (item) {
      item.classList.add('hidden');
    });
}

function run() {
  const container = document.createElement('aside');
  toolbar = container;
  const shadowRoot = container.attachShadow({
    mode: 'closed',
  });

  let output = '';
  config.playbackRates.forEach(function (item) {
    output += `
      <div
        class="menu-item"
        data-function-name="switch-playback-rate"
        data-playback-rate="${item}"
        title="switch-playback-rate"
      >
        ${item}
      </div>
      `;
  });

  const assistant = document.createElement('div');

  // android
  assistant.addEventListener('touchmove', function (event) {
    event.preventDefault();

    const clientX = event.changedTouches[0].clientX;
    const clientY = event.changedTouches[0].clientY;

    this.style.left = clientX - 32 + 'px';
    this.style.bottom = innerHeight - clientY - 32 + 'px';
  });

  // pc
  assistant.draggable = true;
  assistant.addEventListener('dragend', function (event) {
    const clientX = event.clientX;
    const clientY = event.clientY;

    this.style.left = clientX - 32 + 'px';
    this.style.bottom = innerHeight - clientY - 32 + 'px';
  });

  assistant.id = 'assistant';
  assistant.innerHTML = `
<div class="context-menu">
  <div class="panel hidden">
    <div class="menu-item" data-function-name="edit-html" title="edit-html">
      ✏️
    </div>
    <div class="sub-context-menu">
      <div
        class="menu-item"
        data-function-name="toggle-sub-panel"
        data-panel-name="navigation"
        title="navigation"
      >
        🧭
      </div>
      <div class="sub-panel hidden">
        <div class="menu-item" data-function-name="go-back" title="go-back">
          ⬅️
        </div>
        <div
          class="menu-item"
          data-function-name="go-forward"
          title="go-forward"
        >
          ➡️
        </div>
        <div class="menu-item" data-function-name="go-top" title="go-top">
          ⬆️
        </div>
        <div class="menu-item" data-function-name="go-bottom" title="go-bottom">
          ⬇️
        </div>
      </div>
    </div>
    <div class="sub-context-menu">
      <div
        class="menu-item"
        data-function-name="toggle-sub-panel"
        data-panel-name="reload"
        title="reload"
      >
        🔄
      </div>
      <div class="sub-panel hidden">
        <div
          class="menu-item"
          data-function-name="reload-img"
          title="reload-img"
        >
          Img
        </div>
        <div
          class="menu-item"
          data-function-name="reload-iframe"
          title="reload-iframe"
        >
          IFrame
        </div>
        <div
          class="menu-item"
          data-function-name="reload-html"
          title="reload-html"
        >
          Html
        </div>
      </div>
    </div>
    <div class="sub-context-menu">
      <div
        class="menu-item"
        data-function-name="toggle-sub-panel"
        data-panel-name="media"
        title="media"
      >
        🎞️
      </div>
      <div class="sub-panel hidden">${output}</div>
    </div>
  </div>
  <div class="menu-item" data-function-name="toggle-panel" title="toggle-panel">
    ⭕
  </div>
</div>
`;

  const assistantCSS = document.createElement('link');
  assistantCSS.rel = 'stylesheet';
  assistantCSS.href = chrome.runtime.getURL('css/toolbar.css');

  shadowRoot.appendChild(assistant);
  shadowRoot.appendChild(assistantCSS);

  assistant.addEventListener('click', function (event) {
    const target = event.target;
    switch (target.dataset.functionName) {
      case 'toggle-panel':
        resetAllSubContentMenu(shadowRoot);
        target.classList.toggle('active');
        target.previousElementSibling.classList.toggle('hidden');
        break;
      case 'edit-html':
        editHtml();
        shrinkDeepOne(target);
        target.classList.toggle('active');
        break;
      case 'toggle-sub-panel':
        if (!target.classList.contains('active')) {
          resetAllSubContentMenu(shadowRoot);
        }
        target.classList.toggle('active');
        target.nextElementSibling.classList.toggle('hidden');
        break;
      case 'go-back':
        goBack();
        shrinkDeepTwo(target, shadowRoot);
        break;
      case 'go-forward':
        goForward();
        shrinkDeepTwo(target, shadowRoot);
        break;
      case 'go-top':
        goTop();
        shrinkDeepTwo(target, shadowRoot);
        break;
      case 'go-bottom':
        goBottom();
        shrinkDeepTwo(target, shadowRoot);
        break;
      case 'reload-img':
        reloadImg();
        shrinkDeepTwo(target, shadowRoot);
        break;
      case 'reload-iframe':
        reloadIFrame();
        shrinkDeepTwo(target, shadowRoot);
        break;
      case 'reload-html':
        reloadHtml();
        shrinkDeepTwo(target, shadowRoot);
        break;
      case 'switch-playback-rate':
        switchPlaybackRate(event);
        shrinkDeepTwo(target, shadowRoot);
        break;
    }
  });

  document.body.appendChild(container);
}

function onSwitchPlaybackRate(message) {
  const playbackRate = message.playbackRate;

  const audios = document.querySelectorAll('audio');
  const videos = document.querySelectorAll('video');

  Array.prototype.forEach.call(audios, function (item) {
    item.playbackRate = playbackRate;
  });
  Array.prototype.forEach.call(videos, function (item) {
    item.playbackRate = playbackRate;
  });

  if (/bilibili\.com/.test(location.href)) {
    executeScript({
      code: `(function () {
          const shadowHost = document.querySelector('bwp-video');
          if (shadowHost) {
            shadowHost.playbackRate = ${playbackRate};
          }
        })()`,
    });
  } else if (/pan\.baidu\.com/.test(location.href)) {
    const shadowHost = document.querySelector('#video-root');
    if (shadowHost) {
      shadowHost.shadowRoot.querySelector('video').playbackRate = playbackRate;
    }
  }
}

chrome.runtime.onMessage.addListener(function (message) {
  switch (message.action) {
    case 'switch-playback-rate':
      onSwitchPlaybackRate(message);
      break;
  }
});

function runCheck() {
  if (config.status) {
    const patterns = config.patterns.map(function (item) {
      return new RegExp(item);
    });

    for (let pattern of patterns) {
      if (pattern.test(location.href)) {
        // inject
        if (!config.onlyTop) {
          run();
        } else if (top === window) {
          run();
        }
        break;
      }
    }
  }
}

// start
executeScript({
  code: `(function () {
      const _attachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function (run) {
        run.mode = 'open';
        return _attachShadow.call(this, run);
      };
    })()`,
});

window.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get('config', function (res) {
    if ('config' in res) {
      config = res.config;
      runCheck();
    }
  });
});

chrome.storage.onChanged.addListener(function (changes) {
  if (changes.config) {
    // sync
    if ('newValue' in changes.config) {
      config = changes.config.newValue;
      if (toolbar) {
        toolbar.remove();
      }
      toolbar = null;
      runCheck();
    } else {
      if (toolbar) {
        toolbar.remove();
      }
      config = null;
      toolbar = null;
    }
  }
});
