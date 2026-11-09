import { escapeHtml, renderDocument } from './design/index.js'
import { SERVICE_ROUTES } from './service-routes.js'

const serviceLinks = SERVICE_ROUTES.map((service) => {
  const href = '/out/' + encodeURIComponent(service.id)
  return `<a class="link-button" href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(service.name)}</a>`
}).join('\n    ')

const body = `
<section class="menu-shell" aria-label="dash xd menu">
  <button
    class="link-button console-toggle"
    type="button"
    data-console-toggle
    aria-expanded="false"
    aria-controls="console-panel"
  >&gt;_</button>

  <nav class="link-stack" aria-label="Primary links" data-primary-links>
    ${serviceLinks}
  </nav>

  <section class="console-panel" id="console-panel" data-console-panel hidden aria-label="dash xd console">
    <div
      class="chat-transcript"
      data-chat-transcript
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="conversation"
    ></div>

    <form class="chat-composer-shell" data-chat-form>
      <label class="composer-label" for="chat-composer">message dash xd</label>
      <textarea
        class="chat-composer"
        id="chat-composer"
        data-chat-composer
        rows="3"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder=">_"
      ></textarea>
    </form>
  </section>
</section>`

const script = String.raw`
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
    message.className = 'chat-message chat-message--' + role
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

initializeConsole()
`

export function renderDashXdPage(meta) {
  return renderDocument({
    title: 'dashxd.com',
    body,
    meta,
    logoAlt: 'dashxd logo',
    script,
  })
}

export function renderServicePlaceholder(meta, service) {
  return renderDocument({
    title: `${service.name} · dashxd.com`,
    meta,
    logoAlt: 'dashxd logo',
    body: `<section class="content-shell">
      <p class="body-copy">${escapeHtml(service.name)}</p>
      <p class="body-copy">service placeholder · destination not configured</p>
      <a class="link-button" href="/">back to dashxd.com</a>
    </section>`,
  })
}
