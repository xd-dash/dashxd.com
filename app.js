const PLACEHOLDER_ORIGIN = 'https://placeholder.invalid'

const INITIAL_BOT_MESSAGE = `hi xd
im dash xd
ask me what i can do xd
...`

const FIRST_MAINTENANCE_REPLY = `sorry xd
im under maintenance xd
come back soon xd`

const MAINTENANCE_REPLY = `under maintenance xd
come back soon xd`

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

function createChatController({ toggle, panel, transcript, composer, primaryLinks }) {
  let isOpen = false
  let replyCount = 0

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

  function setOpen(nextOpen) {
    isOpen = nextOpen
    toggle.textContent = isOpen ? '<' : '>_'
    toggle.setAttribute('aria-expanded', String(isOpen))
    primaryLinks.hidden = isOpen
    panel.hidden = !isOpen

    if (isOpen) {
      composer.focus()
      scrollTranscriptToBottom()
    }
  }

  function submitMessage() {
    const text = composer.value.trim()
    if (!text) return

    appendMessage('user', text)
    composer.value = ''

    const reply = replyCount === 0 ? FIRST_MAINTENANCE_REPLY : MAINTENANCE_REPLY
    replyCount += 1

    window.setTimeout(() => {
      appendMessage('bot', reply)
    }, 180)
  }

  appendMessage('bot', INITIAL_BOT_MESSAGE)

  toggle.addEventListener('click', () => {
    setOpen(!isOpen)
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
  const primaryLinks = document.querySelector('[data-primary-links]')

  if (!toggle || !panel || !transcript || !composer || !primaryLinks) return

  createChatController({ toggle, panel, transcript, composer, primaryLinks })
}

initializeOutboundLinks()
initializeConsole()
