const PLACEHOLDER_ORIGIN = 'https://placeholder.invalid'
const BOT_MESSAGE_DELAY_MS = 650

const INITIAL_BOT_MESSAGES = [
  'hi xd',
  'im dash xd',
  'ask me what i can do xd',
]

const FIRST_MAINTENANCE_REPLY = [
  'sorry xd',
  'im under maintenance xd',
  'come back soon xd',
]

const MAINTENANCE_REPLY = [
  'under maintenance xd',
  'come back soon xd',
]

function buildOutboundUrl(target) {
  const source = new URL(window.location.href)
  const outbound = new URL(`/out/${encodeURIComponent(target)}`, PLACEHOLDER_ORIGIN)

  outbound.searchParams.set('source_path', source.pathname)

  for (const [key, value] of source.searchParams) {
    outbound.searchParams.append(key, value)
  }

  if (source.hash) {
    outbound.searchParams.set('source_hash', source.hash.slice(1))
  }

  return outbound.toString()
}

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

function createChatController({ toggle, panel, transcript, composer, form, primaryLinks }) {
  let isOpen = false
  let hasStarted = false
  let replyCount = 0
  let botQueue = Promise.resolve()

  function scrollTranscriptToBottom() {
    transcript.scrollTop = transcript.scrollHeight
  }

  function appendMessage(role, text) {
    const message = document.createElement('div')
    message.className = `chat-message chat-message--${role}`
    message.textContent = text
    transcript.append(message)
    scrollTranscriptToBottom()
  }

  function queueBotMessages(messages) {
    botQueue = botQueue.then(async () => {
      for (const message of messages) {
        await delay(BOT_MESSAGE_DELAY_MS)
        appendMessage('bot', message)
      }
    })

    return botQueue
  }

  function setOpen(nextOpen) {
    isOpen = nextOpen
    toggle.textContent = isOpen ? '<' : '>_'
    toggle.setAttribute('aria-expanded', String(isOpen))
    primaryLinks.hidden = isOpen
    panel.hidden = !isOpen

    if (!isOpen) return

    if (!hasStarted) {
      hasStarted = true
      queueBotMessages(INITIAL_BOT_MESSAGES)
    }

    composer.focus()
    scrollTranscriptToBottom()
  }

  function submitMessage() {
    const text = composer.value.trim()
    if (!text) return

    appendMessage('user', text)
    composer.value = ''

    const reply = replyCount === 0 ? FIRST_MAINTENANCE_REPLY : MAINTENANCE_REPLY
    replyCount += 1
    queueBotMessages(reply)
  }

  toggle.addEventListener('click', () => {
    setOpen(!isOpen)
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submitMessage()
  })

  composer.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    event.preventDefault()
    submitMessage()
  })
}

function initializeOutboundLinks() {
  document.querySelectorAll('[data-outbound-target]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault()
      window.open(buildOutboundUrl(button.dataset.outboundTarget), '_blank', 'noopener,noreferrer')
    })
  })
}

function initializeConsole() {
  const toggle = document.querySelector('[data-console-toggle]')
  const panel = document.querySelector('[data-console-panel]')
  const transcript = document.querySelector('[data-chat-transcript]')
  const composer = document.querySelector('[data-chat-composer]')
  const form = document.querySelector('[data-chat-form]')
  const primaryLinks = document.querySelector('[data-primary-links]')

  if (!toggle || !panel || !transcript || !composer || !form || !primaryLinks) return

  createChatController({ toggle, panel, transcript, composer, form, primaryLinks })
}

async function initializeWorkerMeta() {
  const footer = document.querySelector('[data-worker-meta]')
  if (!footer) return

  try {
    const response = await fetch('/meta', { cache: 'no-store' })
    if (!response.ok) return

    const meta = await response.json()
    const details = [
      `cloudflare worker · ${meta.service}`,
      meta.colo ? `colo ${meta.colo}` : null,
      meta.httpProtocol || null,
      meta.tlsVersion || null,
      meta.country ? `country ${meta.country}` : null,
      meta.ray ? `ray ${meta.ray}` : null,
    ].filter(Boolean)

    footer.textContent = details.join(' · ')
  } catch {
    // Keep the static fallback when edge metadata is unavailable.
  }
}

initializeOutboundLinks()
initializeConsole()
initializeWorkerMeta()
