(() => {

  document.querySelector('#preview')?.addEventListener('click', (event) => {
    event.preventDefault()
    const form = event.currentTarget.form
    if (form.checkValidity() === false) return
    document.querySelector('#preview-modal').showModal()

    const content = document.querySelector('#preview-content')
    content.innerHTML = ''

    fetch(`${form.action}?_preview=1`, {
      method: "POST",
      body: new URLSearchParams(new FormData(form)),
      headers: {
        'X-REQUESTED-WITH': 'XMLHttpRequest'
      }
    })
    .then((response) => response.text())
    .then((body) => {
      content.insertAdjacentHTML('afterbegin', `<pre>${body}</pre>`)
    })
    .catch((err) => {
      debugger
    })
    return false
  })

  const count_chars = (id) => {
    const el = document.querySelector(`#${id}`)
    document.querySelector(`#${id}_count`).textContent = twttr.txt.getTweetLength(el.value)
  }

  if (document.querySelector('#content_count')) {
    const content = document.querySelector('#content')
    content.addEventListener('change', () => count_chars('content'))
    content.addEventListener('keyup', () => count_chars('content'))
    count_chars('content')
  }

  if (document.querySelector('#summary_count')) {
    const summary = document.querySelector('#summary')
    summary.addEventListener('change', () => count_chars('summary'))
    summary.addEventListener('keyup', () => count_chars('summary'))
    count_chars('summary')
  }

  document.querySelector('#preview')?.insertAdjacentHTML('afterend', '<button type="button" class="btn" id="helpable-toggle" data-toggle="button" aria-pressed="false">Help</button>');

  document.querySelector('#helpable-toggle')?.addEventListener('click', () => {
    document.querySelectorAll('.helpable .help-block').forEach((el) => {
      const display = el.style.getPropertyValue('display')

      if (display.length && display !== 'none') {
        el.style.removeProperty('display')
      } else {
        el.style.setProperty('display', 'block')
      }
    })
  })

  document.querySelector('#settings-format-form')?.addEventListener('change', () => {
    document.querySelector('#settings-format-form').submit()
  })

  // progressively enhance if js is available
  document.querySelectorAll('.helpable .help-block').forEach((el) => el.style.setProperty('display', 'none'))
  document.querySelector('#content-html')?.style.setProperty('display', 'none')
  document.querySelector('trix-editor')?.style.setProperty('display', 'block')

  const getLocation = (callback) => {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = (Math.round(position.coords.latitude * 100000) / 100000);
      var longitude = (Math.round(position.coords.longitude * 100000) / 100000);
      var accuracy = (Math.round(position.coords.accuracy * 100000) / 100000);

      callback(latitude, longitude, accuracy)

    }, function(err){
      if(err.code == 1) {
        alert("The website was not able to get permission");
      } else if(err.code == 2) {
        alert("Location information was unavailable");
      } else if(err.code == 3) {
        alert("Timed out getting location");
      }
    })
  }

  document.querySelector('#find_location')?.addEventListener('click', () => {
    const callback = (latitude, longitude) => {
      document.querySelector('#latitude').value = latitude
      document.querySelector('#longitude').value = longitude
    }
    getLocation(callback)
    return false
  })

  if (document.querySelector('#auto_location') !== null) {
    const getAutoLocation = () => {
      return localStorage.getItem('autoLocation') === 'true'
    }

    const fillLocation = () => {
      if (!getAutoLocation()) return

      const callback = (latitude, longitude, accuracy) => {
        document.querySelector('#location').value = `geo:${latitude},${longitude};u=${accuracy}`
      }
      getLocation(callback)
    }

    document.querySelector('#auto_location').checked = getAutoLocation()

    document.querySelector('#auto_location').addEventListener('change', (event) => {
      localStorage.setItem('autoLocation', event.target.checked)
      fillLocation()
    })

    fillLocation()
  }

  document.querySelector('#upload_photo')?.addEventListener('click', () => {
    document.querySelector('#photo_file')?.dispatchEvent(new Event('click'))
    return false
  })

  document.querySelector('#photo_file')?.addEventListener('change', (event) => {
    const body = new FormData()
    const files = event.target.files[0]
    body.append('file', files)

    fetch('/media', {
      method: 'POST',
      body
    })
    .then((response) => {
      if (response.ok) {
        return response.text()
      } else {
        alert(response.statusText)
      }
    })
    .then((response) => {
      const photo = document.querySelector('#photo')
      let val = photo.value + '\n' + response
      val = val.trim();
      photo.value = value
      photo.setAttribute('rows', value.split('\n').length || 1)
    })
  })
})();

const countdown = (el, duration) => {
  const countdown = setInterval(() => {
    if (--duration) {
      el.innerHTML `Redirecting in ${duration} second ${(duration != 1 ? 's' : '')}`
    } else {
      el.innerHTML = 'Redirecting…'
      clearInterval(countdown)
      document.location = document.location
    }
  }, 1000)
}

